"""
Remove the monitoring demo user (+998907000001).
Usage: python manage.py remove_monitoring_demo_user
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()
DEMO_PHONE = '+998907000001'


class Command(BaseCommand):
    help = 'Remove monitoring demo user (+998907000001)'

    def handle(self, *args, **options):
        deleted, _ = User.objects.filter(phone=DEMO_PHONE).delete()
        if deleted:
            self.stdout.write(self.style.SUCCESS(f'Demo user removed: {DEMO_PHONE}'))
        else:
            self.stdout.write(f'No demo user found for {DEMO_PHONE} (already removed or never created).')
