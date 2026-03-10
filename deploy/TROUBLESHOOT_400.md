# 400 Bad Request — sabab va yechim

Brauzerda `GET https://medora.cdcgroup.uz/health/` va `POST .../api/auth/login/` **400** qaytarsa, odatda so‘rov **boshqa server**ga boradi (bizning backend 167.71.53.238 emas).

## 1. DNS tekshirish (eng muhim)

Sizning kompyuteringizda (yoki mobil tarmoqda):

```bash
nslookup medora.cdcgroup.uz
```

**Kerakli natija:** `Address: 167.71.53.238`  
**Agar boshqa IP** (masalan 185.x.x.x yoki 104.x.x.x) chiqsa — domen **boshqa server**ga yo‘naltirilgan, shu sabab 400.  
**Yechim:** Domen boshqaruvida (Cloudflare, reg.ru, hosting panel) **medora.cdcgroup.uz** uchun **A** yozuvini **167.71.53.238** qiling. 5–60 daqiqadan keyin qayta tekshiring.

## 2. Serverni o‘zida tekshirish (SSH)

Serverda (167.71.53.238):

```bash
# Backend to'g'ridan-to'g'ri javob bermasdami?
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8001/health/
# 200 chiqishi kerak

# Nginx orqali (Host: medora.cdcgroup.uz)
curl -s -o /dev/null -w "%{http_code}" -H "Host: medora.cdcgroup.uz" http://127.0.0.1/health/
# 200 chiqishi kerak
```

Agar **ikkalasi ham 200** bo‘lsa — **bizning server ishlayapti**. 400 brauzerda chiqyotgan bo‘lsa, brauzer so‘rovi **boshqa IP**ga borayapti (DNS muammo).

## 3. Brauzerda tekshirish

- **Chrome DevTools** → Network → `/health/` yoki `/api/auth/login/` so‘rovini tanlang → **Headers** → **Remote Address**.  
  Bu yerda **167.71.53.238:443** ko‘rinishi kerak. Boshqa IP bo‘lsa — DNS yoki proxy muammo.
- Yoki **incognito** oyna + yangi sessionda `https://medora.cdcgroup.uz` ni ochib qayta urinib ko‘ring.

## 4. Xulosa

| Tekshiruv              | Natija | Demak                          |
|------------------------|--------|---------------------------------|
| nslookup → 167.71.53.238 | Ha     | DNS to‘g‘ri, keyingi qadamlar   |
| nslookup → boshqa IP   | Ha     | **DNS ni 167.71.53.238 ga o‘zgartiring** |
| Serverda curl 127.0.0.1:8001/health/ → 200 | Ha | Backend ishlayapti              |
| Serverda curl 127.0.0.1/health/ (Host: medora…) → 200 | Ha | Nginx ishlayapti        |
| Brauzerda 400          | —      | Brauzer boshqa IPga ulanmoqda (DNS/proxy) |

**Eng tez-tez sabab:** domen hali **167.71.53.238** ga yo‘naltirilmagan yoki CDN/proxy boshqa serverga yo‘naltiradi. DNS ni to‘g‘rilang.

## 5. DisallowedHost (Invalid HTTP_HOST: medoraapi.cdcgroup.uz)

Agar Django **"Invalid HTTP_HOST header: 'medoraapi.cdcgroup.uz'. You may need to add 'medoraapi.cdcgroup.uz' to ALLOWED_HOSTS"** deb 400 qaytarsa:

1. **Serverni `.env` faylida** `ALLOWED_HOSTS` ni tekshiring. Unda `medoraapi.cdcgroup.uz` bo‘lishi kerak:
   ```bash
   # Masalan:
   ALLOWED_HOSTS=medoraapi.cdcgroup.uz,medora.cdcgroup.uz,medoraai.cdcgroup.uz,localhost,127.0.0.1
   ```
2. **Yoki** `.env` dan `ALLOWED_HOSTS` qatorini butunlay o‘chirib qo‘ying — unda settings dagi default (barcha domenlar) ishlatiladi.
3. O‘zgarishlardan keyin backend ni qayta ishga tushiring:
   ```bash
   sudo systemctl restart medoraai-backend-8001.service
   ```

## 6. Backend ishlamasa (502, frontga kira olmaslik)

Agar **medoraapi.cdcgroup.uz** yoki **medoraai.cdcgroup.uz** ochilmasa yoki frontend API ga ulanmasa:

1. **DNS:** `medoraapi.cdcgroup.uz` va `medoraai.cdcgroup.uz` uchun **A** yozuv **167.71.53.238** bo‘lishi kerak (medora.cdcgroup.uz bilan bir xil server).
2. **Backend (Django) ishlayaptimi:** serverda:
   ```bash
   sudo systemctl status medoraai-backend-8001.service
   curl -s http://127.0.0.1:8001/health/
   ```
   Agar 200 kelmasa: `sudo journalctl -u medoraai-backend-8001.service -n 50 --no-pager` — xatolikni ko‘ring. Keyin `sudo systemctl restart medoraai-backend-8001.service`.
3. **Ishlatish:** Frontend **https://medora.cdcgroup.uz** da ochiladi; API avtomatik **https://medora.cdcgroup.uz/api/** ga boradi. Alohida API domeni kerak bo‘lsa: **https://medoraapi.cdcgroup.uz** yoki **https://medoraai.cdcgroup.uz** (ikkalasi ham 127.0.0.1:8001 ga proxy). **medoraapi.cdcgroup.uz** dan kirish uchun `ALLOWED_HOSTS` da bu domen bo‘lishi shart (yoki ALLOWED_HOSTS ni .env da bermaslik).
