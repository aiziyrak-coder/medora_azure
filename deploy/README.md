# Server deploy (167.71.53.238)

Loyiha: `/root/AiDoktorai`. Backend port **8001** (8000 da boshqa loyiha – advokat).

## Bir marta ishga tushirish

Serverga SSH orqali kiring, keyin:

```bash
cd /root/AiDoktorai
git pull origin main
sudo bash deploy/server-deploy.sh
```

Yoki skriptni o‘zingiz copy-paste qilmasdan, faqat repo yangilab skriptni ishga tushiring:

```bash
cd /root/AiDoktorai && git pull origin main && sudo bash deploy/server-deploy.sh
```

## Skript nima qiladi

1. `git pull origin main`
2. Backend: venv, `pip install`, `migrate`, `collectstatic`
3. Frontend: `npm install`, `npm run build` → `/root/AiDoktorai/dist`
4. Gateway uchun dependencylar (backend venv da)
5. Systemd: `AiDoktorai-backend-8001.service` ni o‘rnatadi va ishga tushiradi (port 8001)
6. Nginx: `nginx-AiDoktorai-ip.conf` ni `sites-available` ga qo‘yadi, `sites-enabled` ga link, `nginx -t` va `reload`

## Parol

Skriptda parol yo‘q. SSH kirishda o‘zingiz ishlatasiz: `ssh root@167.71.53.238`.

## Xatolik bo‘lsa

- **Backend ishlamasa:** `sudo systemctl status AiDoktorai-backend-8001` va `journalctl -u AiDoktorai-backend-8001 -n 50`
- **Nginx xato:** `sudo nginx -t` va `/etc/nginx/sites-enabled/` ostidagi konfliktlarni tekshiring
- **Frontend 404:** Build chiqish joyi ` /root/AiDoktorai/dist`; Nginx `root` shu papkaga qarashi kerak
-NoNewline
