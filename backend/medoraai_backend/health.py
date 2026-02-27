"""
Health Check Endpoints (CORS-safe for frontend health checks).
"""
from django.http import JsonResponse
from django.db import connection
from django.core.cache import cache
from django.conf import settings
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import logging

logger = logging.getLogger(__name__)


def _add_cors(response):
    """Ensure CORS headers so frontend never gets blocked (fallback)."""
    origins = getattr(settings, 'CORS_ALLOWED_ORIGINS', None)
    origin = origins[0] if origins else '*'
    response['Access-Control-Allow-Origin'] = origin
    return response


@require_http_methods(['GET', 'OPTIONS'])
@csrf_exempt
def health_check(request):
    """Basic health check; OPTIONS allowed for CORS preflight."""
    if request.method == 'OPTIONS':
        r = JsonResponse({})
        r['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        r['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return _add_cors(r)
    r = JsonResponse({
        'status': 'healthy',
        'service': 'medoraai-backend',
    })
    return _add_cors(r)


@require_http_methods(['GET', 'OPTIONS'])
@csrf_exempt
def health_detailed(request):
    """Detailed health check with database and cache."""
    if request.method == 'OPTIONS':
        r = JsonResponse({})
        r['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        r['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return _add_cors(r)
    checks = {
        'status': 'healthy',
        'service': 'medoraai-backend',
        'checks': {}
    }
    
    # Database check
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            checks['checks']['database'] = 'ok'
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        checks['checks']['database'] = 'error'
        checks['status'] = 'unhealthy'
    
    # Cache check
    try:
        cache.set('health_check', 'ok', 10)
        if cache.get('health_check') == 'ok':
            checks['checks']['cache'] = 'ok'
        else:
            checks['checks']['cache'] = 'error'
            checks['status'] = 'unhealthy'
    except Exception as e:
        logger.error(f"Cache health check failed: {e}")
        checks['checks']['cache'] = 'error'
        checks['status'] = 'unhealthy'
    
    # Settings check
    checks['checks']['debug'] = settings.DEBUG
    checks['checks']['allowed_hosts'] = len(settings.ALLOWED_HOSTS) > 0
    
    status_code = 200 if checks['status'] == 'healthy' else 503
    r = JsonResponse(checks, status=status_code)
    return _add_cors(r)
