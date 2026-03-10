# Monitoring / Demo kirish (default login)

Bemor monitoring platformasi va umumiy demo kirish uchun **bitta default** foydalanuvchi:

| Maydon    | Qiymat            |
|-----------|-------------------|
| **Login** | `+998907000001`   |
| **Parol** | `monitoring_demo` |

- **Rol:** Bemor monitoring  
- **Platforma:** [medora.cdcgroup.uz](https://medora.cdcgroup.uz) — login sahifasida shu raqam va parolni kiriting.

Bu foydalanuvchi har safar `deploy/server-deploy.sh` ishlaganda avtomatik yaratiladi yoki paroli yangilanadi (`python manage.py create_monitoring_demo_user`).

Qo‘lda yaratish (serverda):

```bash
cd /root/medoraai/backend && source venv/bin/activate && python manage.py create_monitoring_demo_user
```
