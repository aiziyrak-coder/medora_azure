"""
WSGI: DisallowedHost bartaraf — get_host() va ALLOWED_HOSTS dastlabki yuklanishda o'rnatiladi.
"""

import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medoraai_backend.settings')

# 1) get_host() ni PATCH qilish DARHOL — django.setup() DAN OLDIN (request moduli birinchi marta import)
import django.http.request as _req_mod
_safe_get_host = lambda self: (self.META.get('HTTP_HOST') or 'medora.cdcgroup.uz').split('#')[0].strip()
_req_mod.HttpRequest.get_host = _safe_get_host

# 2) Django ishga tushirish
import django
django.setup()

# 3) ALLOWED_HOSTS majburan * (serverni .env override qilishini bekor qilish)
from django.conf import settings as _s
_s.ALLOWED_HOSTS = ['*']

# 4) Application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
