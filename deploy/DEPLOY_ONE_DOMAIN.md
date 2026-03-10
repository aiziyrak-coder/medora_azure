# Bitta domen: medora.cdcgroup.uz

Endi **faqat medora.cdcgroup.uz** kerak. API va health ham shu domen orqali ishlaydi; **medoraai.cdcgroup.uz** DNS sozlash shart emas.

- **Frontend:** https://medora.cdcgroup.uz  
- **API:** https://medora.cdcgroup.uz/api/  
- **Health:** https://medora.cdcgroup.uz/health/  

## "Kirmayabdi" / ERR_NAME_NOT_RESOLVED bo‘lsa

Brauzer **medoraai.cdcgroup.uz** ga so‘rov yuborayotgan bo‘lsa, serverda **eski build** ishlayapti. Yangi buildni deploy qilish kerak.

### Qadamlar (ketma-ket)

1. **Lokal o‘zgarishlarni repoga yuboring:**
   ```bash
   git add -A && git status
   git commit -m "Bitta domen: medora.cdcgroup.uz, PWA icon tuzatish"
   git push origin main
   ```

2. **Serverni yangilang va deploy qiling:**
   ```bash
   # Variant A: Lokal mashinadan (Python + paramiko)
   cd E:\medoraai
   python deploy/deploy_remote.py
   ```
   yoki **Variant B** — serverga SSH orqali kirib:
   ```bash
   cd /root/medoraai && git pull origin main && sudo bash deploy/server-deploy.sh
   ```

3. Deploy tugagach, brauzerda **qattiq yangilash**: **Ctrl+Shift+R** (yoki Cmd+Shift+R).  
   Shundan keyin so‘rovlar medoraai.cdcgroup.uz emas, medora.cdcgroup.uz ga ketadi va login ishlashi kerak.

## 400 Bad Request bo‘lsa

Serverda backend Host sarlavhasini qabul qilishi kerak. Tekshirish (SSH orqali):

```bash
curl -s -o /dev/null -w "%{http_code}" -H "Host: medora.cdcgroup.uz" http://127.0.0.1:8001/health/
# 200 chiqishi kerak; 400 bo‘lsa backend yangilanmagan yoki ALLOWED_HOSTS muammo
```

Keyin backendni qayta ishga tushiring: `sudo systemctl restart medoraai-backend-8001.service`

## Demo kirish

Login: **+998907000001**  
Parol: **monitoring_demo**  

Batafsil: [MONITORING_DEMO_LOGIN.md](./MONITORING_DEMO_LOGIN.md)
