# 🚨 TEZKOR FIX - HTTPS Ishlamaslik Muammosi

## ❌ Muammo
Backend ishlayapti (http://127.0.0.1:8001/health/ ✅) lekin HTTPS orqali kirib bo'lmayapti.

## 🔍 Sabab
1. `.env` fayl yo'q (faqat `.env.example` mavjud)
2. ALLOWED_HOSTS sozlanmagan
3. Nginx konfiguratsiyasini tekshirish kerak

---

## ✅ YECHIM (3 Qadam)

### **QADAM 1: .env Faylini Yaratish**

```bash
cd /root/medoraai/backend
cp .env.example .env
nano .env
```

**.env fayliga quyidagilarni qo'shing:**

```env
SECRET_KEY=django-insecure-medoraai-dev-key-change-in-production
DEBUG=True

# ENG MUHIM - ALLOWED_HOSTS:
ALLOWED_HOSTS=localhost,127.0.0.1,medoraapi.cdcgroup.uz,medora.cdcgroup.uz,medora.ziyrak.org,medoraapi.ziyrak.org,20.82.115.71,167.71.53.238

# CORS:
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173,https://medora.cdcgroup.uz,https://medoraapi.cdcgroup.uz

# Database:
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=/root/medoraai/backend/db.sqlite3

# AI:
GEMINI_API_KEY=AIzaSyCn4G1ZYDW_WZ9zCoP39EycFHkfrJAEGZA
AI_MODEL_DEFAULT=gemini-3-pro-preview

# Telegram:
TELEGRAM_BOT_TOKEN=8345119740:AAETf0ZTo8zh2A3S5TKIkm7nWQnhO74yBAo
TELEGRAM_PAYMENT_GROUP_ID=-5041567370
```

**Saqlash:** `Ctrl+O` → `Enter` → `Ctrl+X`

---

### **QADAM 2: Gunicorn Restart**

```bash
# Eski process'larni to'xtatish
pkill -f gunicorn

# Yangi boshlash
cd /root/medoraai/backend
source venv/bin/activate

nohup gunicorn medoraai_backend.wsgi:application \
    --bind 127.0.0.1:8001 \
    --workers 3 \
    --timeout 120 \
    --access-logfile logs/access.log \
    --error-logfile logs/error.log \
    >> logs/gunicorn.log 2>&1 &

echo "Gunicorn started: $!"
```

**Test:**
```bash
curl http://127.0.0.1:8001/health/
```

---

### **QADAM 3: Nginx Tekshirish**

#### 3.1. Nginx konfiguratsiyasini tekshirish:

```bash
nginx -t
```

Agar xatolik bo'lsa:
```bash
cat /etc/nginx/sites-enabled/medoraapi
# yoki
cat /etc/nginx/conf.d/medoraapi.conf
```

#### 3.2. Nginx reload:

```bash
sudo systemctl reload nginx
```

#### 3.3. Nginx holati:

```bash
sudo systemctl status nginx
```

---

## 🧪 TEST

### 1. Local test (server ichida):
```bash
curl http://127.0.0.1:8001/
curl http://127.0.0.1:8001/health/
curl http://127.0.0.1:8001/admin/
```

### 2. HTTPS test (brauzerda):
- https://medoraapi.cdcgroup.uz/
- https://medoraapi.cdcgroup.uz/admin/
- https://medoraapi.cdcgroup.uz/swagger/

### 3. CURL test:
```bash
curl -I https://medoraapi.cdcgroup.uz/
```

---

## 📋 LOGLAR

Agar hali ham ishlamasa, loglarni tekshiring:

```bash
# Django logs
tail -f /root/medoraai/backend/logs/django.log
tail -f /root/medoraai/backend/logs/django_errors.log

# Gunicorn logs
tail -f /root/medoraai/backend/logs/gunicorn.log

# Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# Systemd logs
journalctl -u nginx -f
journalctl -u medoraai-backend-f
```

---

## 🔧 AVTOMATIK FIX SCRIPT

Barcha qadamlarni avtomatik bajarish uchun:

```bash
cd /root/medoraai/deploy

# 1. .env yaratish (interactive)
./deploy-test.sh

# Yoki tez restart (agar.env allaqachon mavjud bo'lsa)
./quick-restart.sh
```

---

## ⚠️ MUHIM ESLATMALAR

1. **DEBUG=True** - Development/test uchun
   - Production da `DEBUG=False` qiling!
   
2. **SECRET_KEY** - Production da yangi key yarating:
   ```bash
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```

3. **ALLOWED_HOSTS** - Har doim domenlarni qo'shing:
   - `medoraapi.cdcgroup.uz`
   - `medora.cdcgroup.uz`
   - IP manzillar: `20.82.115.71`, `167.71.53.238`

---

## 🎯 QAISIQDA BUYRUQLAR (Copy-Paste)

```bash
# 1. .env yaratish va tahrirlash
cd /root/medoraai/backend
cp .env.example .env
nano .env
# (yuqoridagi .env content ni copy-paste qiling)

# 2. Gunicorn restart
pkill -f gunicorn
cd /root/medoraai/backend
source venv/bin/activate
nohup gunicorn medoraai_backend.wsgi:application --bind 127.0.0.1:8001 --workers 3 --timeout 120 >> logs/gunicorn.log 2>&1 &

# 3. Nginx reload
sudo nginx -t && sudo systemctl reload nginx

# 4. Test
curl http://127.0.0.1:8001/health/
curl -I https://medoraapi.cdcgroup.uz/
```

---

**📅 Sana:** March 11, 2026  
**🔧 Holat:** Backend HTTP ishlayapti, HTTPS uchun .env kerak
