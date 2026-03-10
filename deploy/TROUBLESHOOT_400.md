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
