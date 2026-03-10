# Server deploy (167.71.53.238)

Loyiha: `/root/medoraai`. Backend port **8001** (8000 da boshqa loyiha – advokat).

## Bir marta ishga tushirish

Serverga SSH orqali kiring, keyin:

```bash
cd /root/medoraai
git pull origin main
sudo bash deploy/server-deploy.sh
```

Yoki skriptni o‘zingiz copy-paste qilmasdan, faqat repo yangilab skriptni ishga tushiring:

```bash
cd /root/medoraai && git pull origin main && sudo bash deploy/server-deploy.sh
```

## Skript nima qiladi

1. `git pull origin main`
2. Backend: venv, `pip install`, `migrate`, `collectstatic`
3. Frontend: `npm install`, `npm run build` → `/root/medoraai/dist`
4. Gateway uchun dependencylar (backend venv da)
5. Systemd: `medoraai-backend-8001.service` ni o‘rnatadi va ishga tushiradi (port 8001)
6. Nginx: `nginx-medoraai-ip.conf` ni `sites-available` ga qo‘yadi, `sites-enabled` ga link, `nginx -t` va `reload`

## Parol

Skriptda parol yo‘q. SSH kirishda o‘zingiz ishlatasiz: `ssh root@167.71.53.238`.

## Xatolik bo‘lsa

- **Backend ishlamasa:** `sudo systemctl status medoraai-backend-8001` va `journalctl -u medoraai-backend-8001 -n 50`
- **Nginx xato:** `sudo nginx -t` va `/etc/nginx/sites-enabled/` ostidagi konfliktlarni tekshiring
- **Frontend 404:** Build chiqish joyi ` /root/medoraai/dist`; Nginx `root` shu papkaga qarashi kerak
