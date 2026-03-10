# Data migration: ensure monitoring demo user exists (login +998907000001 / monitoring_demo)

from django.db import migrations


def create_demo_user(apps, schema_editor):
    User = apps.get_model('accounts', 'User')
    phone = '+998907000001'
    if not User.objects.filter(phone=phone).exists():
        user = User.objects.create_user(
            phone=phone,
            password='monitoring_demo',
            name='Monitoring Operator',
            role='monitoring',
        )
        user.subscription_status = 'active'
        user.save(update_fields=['subscription_status'])
    else:
        user = User.objects.get(phone=phone)
        user.set_password('monitoring_demo')
        user.role = 'monitoring'
        user.name = 'Monitoring Operator'
        user.subscription_status = 'active'
        user.save(update_fields=['password', 'role', 'name', 'subscription_status'])


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_rename_accounts_act_user_id_8a0f0d_idx_accounts_ac_user_id_ca4948_idx'),
    ]

    operations = [
        migrations.RunPython(create_demo_user, noop),
    ]
