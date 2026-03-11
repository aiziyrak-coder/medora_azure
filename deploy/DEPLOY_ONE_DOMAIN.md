# Bitta domen: AiDoktor.fargana.uz

Endi **faqat AiDoktor.fargana.uz** kerak. API va health ham shu domen orqali ishlaydi; **AiDoktorai.fargana.uz** DNS sozlash shart emas.

- **Frontend:** https://AiDoktor.fargana.uz  
- **API:** https://AiDoktor.fargana.uz/api/  
- **Health:** https://AiDoktor.fargana.uz/health/  

## "Kirmayabdi" / ERR_NAME_NOT_RESOLVED bo‘lsa

Brauzer **AiDoktorai.fargana.uz** ga so‘rov yuborayotgan bo‘lsa, serverda **eski build** ishlayapti. Yangi buildni deploy qilish kerak.

### Qadamlar (ketma-ket)

1. **Lokal o‘zgarishlarni repoga yuboring:**
   ```bash
   git add -A && git status
   git commit -m "Bitta domen: AiDoktor.fargana.uz, PWA icon tuzatish"
   git push origin main
   ```

2. **Serverni yangilang va deploy qiling:**
   ```bash
   # Variant A: Lokal mashinadan (Python + paramiko)
   cd E:\AiDoktorai
   python deploy/deploy_remote.py
   ```
   yoki **Variant B** — serverga SSH orqali kirib:
   ```bash
   cd /root/AiDoktorai && git pull origin main && sudo bash deploy/server-deploy.sh
   ```

3. Deploy tugagach, brauzerda **qattiq yangilash**: **Ctrl+Shift+R** (yoki Cmd+Shift+R).  
   Shundan keyin so‘rovlar AiDoktorai.fargana.uz emas, AiDoktor.fargana.uz ga ketadi va login ishlashi kerak.

## 400 Bad Request bo‘lsa

Serverda backend Host sarlavhasini qabul qilishi kerak. Tekshirish (SSH orqali):

```bash
curl -s -o /dev/null -w "%{http_code}" -H "Host: AiDoktor.fargana.uz" http://127.0.0.1:8001/health/
# 200 chiqishi kerak; 400 bo‘lsa backend yangilanmagan yoki ALLOWED_HOSTS muammo
```

Keyin backendni qayta ishga tushiring: `sudo systemctl restart AiDoktorai-backend-8001.service`

## Monitoring kirish

Bemor monitoring uchun auth sahifada **Bemor monitoring** → **Ro'yxatdan o'tish** orqali hisob yarating, keyin **Kirish**. Batafsil: [MONITORING_DEMO_LOGIN.md](./MONITORING_DEMO_LOGIN.md)
-NoNewline
