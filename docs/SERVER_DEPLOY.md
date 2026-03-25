# Serverda deploy (CDCGroupNew)

`/path/to/AiDoktorai` — bu faqat namuna. Serverda **haqiqiy loyiha yo‘lini** ishlating.

---

## 1. Loyiha qayerda ekanini aniqlash

Agar loyiha allaqachon serverda clone qilingan bo‘lsa:

```bash
# Qidirish (odatda /root yoki /home ostida)
sudo find /root /home -maxdepth 4 -name "AiDoktorai" -type d 2>/dev/null
# yoki
ls -la /root/
ls -la /home/
```

Agar **hali clone qilinmagan** bo‘lsa, bir marta clone qiling (masalan `/root/AiDoktorai` ga):

```bash
cd /root
git clone https://github.com/aiziyrak-coder/AiDoktorai.git
cd AiDoktorai
```

Keyingi qadamlar uchun **loyiha papkasi** — masalan `/root/AiDoktorai` yoki `/home/cdcgroup/AiDoktor_platform/app`. Bu yo‘lni `APP_DIR` deb belgilaymiz.

---

## 2. Python: venv ishlatish (majburiy)

Debian/Ubuntu (PEP 668) tizimda `pip install` system-wide taqiqlangan. **Virtual environment** ishlatish kerak.

```bash
# Backend uchun venv (bir marta)
APP_DIR="/root/AiDoktorai"
cd "$APP_DIR/backend"
python3 -m venv venv
source venv/bin/activate   # Linux/Mac
pip install -r requirements.txt
python manage.py migrate --noinput
deactivate
```

Gateway uchun **o‘sha venv** dan foydalanishingiz mumkin (yoki alohida venv):

```bash
cd "$APP_DIR/backend"
source venv/bin/activate
pip install -r ../monitoring_gateway/requirements.txt
# Gateway ishga tushirish: cd "$APP_DIR" && backend/venv/bin/uvicorn monitoring_gateway.main:app --host 0.0.0.0 --port 9000
deactivate
```

---

## 3. To‘g‘ri yo‘l bilan deploy (venv + frontend)

Quyidagi buyruqlarda **faqat birinchi qatordagi `APP_DIR` ni** o‘z serveringizdagi yo‘lga o‘zgartiring.

```bash
# ========== BU YERNI O‘ZGARTIRING ==========
APP_DIR="/root/AiDoktorai"
# ==========================================

cd "$APP_DIR" || exit 1
git pull origin main

# --- Backend (venv orqali) ---
cd "$APP_DIR/backend" || exit 1
if [ ! -d venv ]; then
  python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate --noinput
deactivate

# Gunicorn / systemd: agar AiDoktor.service mavjud bo‘lsa
if systemctl list-unit-files 2>/dev/null | grep -q AiDoktor.service; then
  sudo systemctl restart AiDoktor
else
  echo "AiDoktor.service yo‘q. Backend ni qo‘lda: cd $APP_DIR/backend && source venv/bin/activate && gunicorn --bind 127.0.0.1:8000 AiDoktorai_backend.wsgi:application"
fi

# --- Frontend build ---
cd "$APP_DIR/frontend" || exit 1
npm install
npm run build

echo "Frontend build tugadi. Nginx root: $APP_DIR/frontend/dist yoki $APP_DIR/dist"

# --- Gateway (ixtiyoriy): venv da dependencylar ---
cd "$APP_DIR/backend" && source venv/bin/activate
pip install -r ../monitoring_gateway/requirements.txt
deactivate
echo "Gateway: cd $APP_DIR && $APP_DIR/backend/venv/bin/uvicorn monitoring_gateway.main:app --host 0.0.0.0 --port 9000"
```

---

## 4. systemd (AiDoktor.service) yo‘q bo‘lsa

Agar `Unit AiDoktor.service not found` chiqsa:

- **Variant A:** Backend ni **qo‘lda** ishga tushiring (test uchun):
  ```bash
  cd $APP_DIR/backend
  export DJANGO_SETTINGS_MODULE=AiDoktorai_backend.settings
  gunicorn --bind 127.0.0.1:8000 AiDoktorai_backend.wsgi:application
  ```

- **Variant B:** `AiDoktor.service` yarating (repo dagi namuna: `backend/AiDoktor.service`). Undagi `WorkingDirectory` va `ExecStart` yo‘llarini o‘z serveringizdagi `APP_DIR` ga moslashtiring, keyin:
  ```bash
  sudo cp $APP_DIR/backend/AiDoktor.service /etc/systemd/system/
  # Fayldagi /home/cdcgroup/AiDoktor_platform/app/backend ni $APP_DIR/backend ga o‘zgartiring
  sudo nano /etc/systemd/system/AiDoktor.service
  sudo systemctl daemon-reload
  sudo systemctl enable AiDoktor
  sudo systemctl start AiDoktor
  ```

---

## 5. Qisqa xulosa (xatolar)

| Xato | Sabab | Yechim |
|------|--------|--------|
| `cd: /path/to/AiDoktorai: No such file or directory` | Namuna yo‘l | Haqiqiy yo‘l: `APP_DIR="/root/AiDoktorai"` |
| `fatal: not a git repository` | Git repo yo‘q | `git clone https://github.com/aiziyrak-coder/AiDoktorai.git` |
| **externally-managed-environment** | System pip taqiqlangan | Backend va gateway uchun **venv** ishlating (2–3-band) |
| **npm ci ... Missing: @google/genai** | package-lock.json eski | Serverda `npm install` ishlating (keyin `npm run build`). Yoki `git pull` dan keyin yangi lock file keladi. |
| `Unit AiDoktor.service not found` | systemd yo‘q | Qo‘lda: `cd backend && source venv/bin/activate && gunicorn --bind 127.0.0.1:8000 AiDoktorai_backend.wsgi:application` |

---

## 6. Serverda darhol ishlatish (copy-paste)

Loyiha `/root/AiDoktorai` da bo‘lsa, quyidagini **ketma-ket** copy-paste qiling (git pull avval qiling: `cd /root/AiDoktorai && git pull origin main`).

```bash
APP_DIR="/root/AiDoktorai"
cd "$APP_DIR/backend"
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate --noinput
deactivate

cd "$APP_DIR/frontend"
npm install
npm run build

cd "$APP_DIR/backend" && source venv/bin/activate
pip install -r ../monitoring_gateway/requirements.txt
deactivate
echo "Tugadi. Backend: cd $APP_DIR/backend && source venv/bin/activate && gunicorn --bind 127.0.0.1:8000 AiDoktorai_backend.wsgi:application"
```

---

## 7. Port 8000 band bo‘lsa (Connection in use)

Agar `gunicorn` yoki boshqa dastur 8000 portni allaqachon ishlatayotgan bo‘lsa, avval portni bo‘shating:

```bash
# 8000 portni kim ishlatayotganini ko‘rish
sudo lsof -i :8000
# yoki
sudo ss -tlnp | grep 8000

# PID ni topib to‘xtatish (PID — jadvaldagi ikkinchi ustun)
sudo kill <PID>
# yoki zo‘r bilan:
sudo kill -9 <PID>
```

Keyin gunicorn ni qayta ishga tushiring.
-NoNewline
