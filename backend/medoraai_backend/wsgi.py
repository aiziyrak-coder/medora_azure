"""
WSGI config for medoraai_backend project.
DisallowedHost bartaraf: get_host() ni application yuklanishidan OLDIN patch qilamiz.
"""

import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medoraai_backend.settings')

# Patch get_host() DARHOL — Django hech qanday request qilishidan oldin
import django
django.setup()
from django.http import HttpRequest

def _safe_get_host(self):
    return (self.META.get('HTTP_HOST') or 'medora.cdcgroup.uz').split('#')[0].strip()

HttpRequest.get_host = _safe_get_host

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
