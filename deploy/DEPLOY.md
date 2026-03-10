# MedoraAI — mukammal deploy (build, push, pull, migrate, restart)

Bitta buyruq bilan: lokal o‘zgarishlarni commit/push qilish + serverda pull, migrate, frontend build, backend restart.

## Windows (PowerShell)

```powershell
cd E:\medoraai
.\deploy\full_deploy.ps1
```

Bu skript:
1. **Git:** `git add -A`, agar o‘zgarish bo‘lsa `commit`, so‘ng `git push origin main`
2. **Server:** SSH orqali `git pull origin main` va `sudo bash deploy/server-deploy.sh`

Serverda `server-deploy.sh` bajariladi:
- **Pull** — yangi kod
- **Backend:** venv, `pip install`, `migrate --noinput`, remove_monitoring_demo_user, demo monitoring data, collectstatic, **restart backend**
- **Frontend:** `npm install`, `npm run build` (VITE_API_BASE_URL=https://medora.cdcgroup.uz/api)
- **Systemd:** backend service **restart**
- **Nginx:** config nusxalash va **reload**

## Serverda qo‘lda (SSH)

```bash
cd /root/medoraai
git pull origin main
sudo bash deploy/server-deploy.sh
```

## Lokal: faqat push, keyin serverda qo‘lda deploy

```powershell
cd E:\medoraai
git add -A
git commit -m "Deploy"
git push origin main
# Serverga kirib: cd /root/medoraai && git pull && sudo bash deploy/server-deploy.sh
```

Yoki lokal mashinadan serverda deployni ishga tushirish (Python + paramiko):

```powershell
python deploy/deploy_remote.py
```

---

**Deploydan keyin:** brauzerda https://medora.cdcgroup.uz ni **Ctrl+Shift+R** bilan yangilang.
