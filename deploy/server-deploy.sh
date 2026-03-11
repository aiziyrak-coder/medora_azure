#!/bin/bash
# AiDoktorAI — serverda to'liq deploy (167.71.53.238, /root/AiDoktorai)
# Ishga tushirish: sudo bash deploy/server-deploy.sh  (yoki: chmod +x deploy/server-deploy.sh && sudo ./deploy/server-deploy.sh)

set -e
APP_DIR="/root/AiDoktorai"
cd "$APP_DIR" || { echo "Xato: $APP_DIR topilmadi"; exit 1; }

echo "=== 1. Git pull ==="
git pull origin main

echo "=== 2. Backend venv va migrate ==="
cd "$APP_DIR/backend"
if [ ! -d venv ]; then
  python3 -m venv venv
fi
source venv/bin/activate
pip install -q -r requirements.txt
python manage.py migrate --noinput
python manage.py collectstatic --noinput 2>/dev/null || true
deactivate
# Backend restart — yangi ALLOWED_HOSTS/settings uchun (400 Bad Request bartaraf)
systemctl restart AiDoktorai-backend-8001.service 2>/dev/null || true

echo "=== 3. Frontend build (API: AiDoktor.fargana.uz — bitta domen) ==="
cd "$APP_DIR/frontend"
npm install --silent 2>/dev/null || npm install
# Bitta domen: AiDoktor.fargana.uz (API ham shu domen orqali)
export VITE_API_BASE_URL=https://AiDoktor.fargana.uz/api
# Gemini: backend/.env dan GEMINI_API_KEY ni frontend build uchun beramiz
if [ -f "$APP_DIR/backend/.env" ]; then
  GEMINI_API_KEY=$(grep -E '^GEMINI_API_KEY=' "$APP_DIR/backend/.env" 2>/dev/null | cut -d= -f2-)
  [ -n "$GEMINI_API_KEY" ] && export VITE_GEMINI_API_KEY="$GEMINI_API_KEY"
fi
npm run build

# Nginx (www-data) /root/AiDoktorai/dist ni o'qishi uchun huquq
chmod 755 /root 2>/dev/null || true
chmod 755 "$APP_DIR" "$APP_DIR/dist" 2>/dev/null || true
chmod -R o+rX "$APP_DIR/dist" 2>/dev/null || true
chmod -R o+rX "$APP_DIR/backend/staticfiles" "$APP_DIR/backend/media" 2>/dev/null || true

# Dist tekshiruv: index.html borligi
if [ ! -f "$APP_DIR/dist/index.html" ]; then
  echo "XATO: $APP_DIR/dist/index.html topilmadi. Build chiqishi: $(ls -la $APP_DIR/dist 2>/dev/null | head -5)"
  exit 1
fi
echo "  dist/index.html mavjud ($(wc -c < "$APP_DIR/dist/index.html") bayt)"

# Serverni .env da ALLOWED_HOSTS override qilishini o'chirish (DisallowedHost bartaraf)
if [ -f "$APP_DIR/backend/.env" ]; then
  sed -i.bak '/^ALLOWED_HOSTS=/d' "$APP_DIR/backend/.env" 2>/dev/null || true
  echo "  .env dan ALLOWED_HOSTS o'chirildi (agar bor edi)."
fi
# wsgi.py da patch borligini tekshirish
grep -q "HttpRequest.get_host = _safe_get_host\|_req_mod.HttpRequest.get_host" "$APP_DIR/backend/AiDoktorai_backend/wsgi.py" 2>/dev/null && echo "  wsgi.py: get_host patch mavjud." || echo "  DIQQAT: wsgi.py da get_host patch yo'q!"

# Eski (qo'lda ishga tushirilgan) AiDoktorai gunicorn ni to'xtatish — faqat systemd bitta instance ishlashi uchun
pkill -f "gunicorn.*AiDoktorai_backend.wsgi" 2>/dev/null || true
sleep 1

echo "=== 5. Systemd: AiDoktorAI backend 8001 ==="
cp "$APP_DIR/deploy/AiDoktorai-backend-8001.service" /etc/systemd/system/
systemctl daemon-reload
systemctl enable AiDoktorai-backend-8001.service
systemctl restart AiDoktorai-backend-8001.service
sleep 3
# Backend 8001 ishlamasa qayta urinish va xabar
for i in 1 2; do
  if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8001/health/ | grep -q 200; then
    echo "  Backend 8001 ishga tushdi."
    break
  fi
  if [ "$i" -eq 1 ]; then
    echo "  Backend 8001 birinchi marta javob bermadi, qayta ishga tushirilmoqda..."
    systemctl restart AiDoktorai-backend-8001.service
    sleep 3
  else
    echo "  XATO: Backend 8001 ishlamadi. Tekshiring: systemctl status AiDoktorai-backend-8001.service && journalctl -u AiDoktorai-backend-8001.service -n 30 --no-pager"
    exit 1
  fi
done

echo "=== 6. Nginx (AiDoktor.fargana.uz, AiDoktorai.fargana.uz) + HTTPS ==="
if [ -d /etc/nginx/sites-available ]; then
  for f in /etc/nginx/sites-enabled/*; do
    [ -e "$f" ] || continue
    target="$(readlink -f "$f" 2>/dev/null)" || target="$f"
    if grep -q "server_name.*AiDoktor.*cdcgroup\|server_name.*AiDoktorai.*cdcgroup" "$target" 2>/dev/null; then
      case "$(basename "$f")" in AiDoktorai-cdcgroup) continue ;; esac
      echo "  Eski config o'chirilmoqda: $f"
      rm -f "$f"
    fi
  done
  cp "$APP_DIR/deploy/nginx-AiDoktorai-ip.conf" /etc/nginx/sites-available/AiDoktorai-ip
  ln -sf /etc/nginx/sites-available/AiDoktorai-ip /etc/nginx/sites-enabled/AiDoktorai-ip 2>/dev/null || true

  CERT_PATH="/etc/letsencrypt/live/AiDoktor.fargana.uz/fullchain.pem"
  if [ ! -f "$CERT_PATH" ]; then
    echo "  SSL sertifikat yo'q. HTTP-only config, keyin certbot..."
    cp "$APP_DIR/deploy/nginx-cdcgroup-http-only.conf" /etc/nginx/sites-available/AiDoktorai-cdcgroup
    ln -sf /etc/nginx/sites-available/AiDoktorai-cdcgroup /etc/nginx/sites-enabled/AiDoktorai-cdcgroup 2>/dev/null || true
    nginx -t && systemctl reload nginx
    mkdir -p "$APP_DIR/dist/.well-known/acme-challenge"
    if command -v certbot >/dev/null 2>&1; then
      certbot certonly --webroot -w "$APP_DIR/dist" -d AiDoktor.fargana.uz -d AiDoktorai.fargana.uz -d AiDoktorapi.fargana.uz \
        --non-interactive --agree-tos -m admin@fargana.uz --no-eff-email --expand 2>/dev/null || true
    else
      echo "  certbot o'rnatilmagan: apt install certbot -y"
    fi
  fi

  if [ -f "$CERT_PATH" ]; then
    cp "$APP_DIR/deploy/nginx-cdcgroup.conf" /etc/nginx/sites-available/AiDoktorai-cdcgroup
    ln -sf /etc/nginx/sites-available/AiDoktorai-cdcgroup /etc/nginx/sites-enabled/AiDoktorai-cdcgroup 2>/dev/null || true
    nginx -t && systemctl reload nginx
    echo "  HTTPS (443) yoqildi."
  else
    echo "  HTTPS uchun certbot qayta ishlatib sertifikat oling, keyin deployni takrorlang."
  fi
else
  echo "Nginx sites-available yo'q."
fi

echo "=== 7. Tekshirish ==="
sleep 2
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8001/health/ && echo " Backend 8001 OK" || echo " Backend 8001 javob bermadi"
systemctl is-active --quiet AiDoktorai-backend-8001.service && echo "AiDoktorai-backend-8001: active" || echo "AiDoktorai-backend-8001: FAIL"
# AiDoktorapi.fargana.uz Host bilan 8001 ga so'rov — DisallowedHost bo'lmasa 200
HTTP_API_HOST=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: AiDoktorapi.fargana.uz" http://127.0.0.1:8001/ 2>/dev/null || echo "000")
echo "  AiDoktorapi.fargana.uz (8001 ga): HTTP $HTTP_API_HOST (200 bo'lishi kerak; 400 bo'lsa wsgi.py patch yuklanmagan)"
# AiDoktor.fargana.uz localda 200 qaytarsa — nginx to'g'ri
HTTP_FRONT=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: AiDoktor.fargana.uz" http://127.0.0.1/)
echo "  AiDoktor.fargana.uz (local): HTTP $HTTP_FRONT (200 bo'lishi kerak; 404 bo'lsa DNS boshqa serverga yo'naltirilgan bo'lishi mumkin)"

echo ""
echo "Tugadi. Bitta domen: https://AiDoktor.fargana.uz (frontend + /api/ + /health/). Brauzerda Ctrl+Shift+R bilan yangilang."
echo ""
# 400 chiqsa: DNS tekshirish (AiDoktor.fargana.uz -> 167.71.53.238 bo'lishi kerak)
PUBLIC_HEALTH=$(curl -sk -o /dev/null -w "%{http_code}" --connect-timeout 5 "https://AiDoktor.fargana.uz/health/" 2>/dev/null || echo "err")
echo "  Public https://AiDoktor.fargana.uz/health/ (servernan): HTTP $PUBLIC_HEALTH (200 bo'lishi kerak; 400/err bo'lsa: deploy/TROUBLESHOOT_400.md)"
-NoNewline
