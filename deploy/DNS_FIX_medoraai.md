# AiDoktorai.fargana.uz – ERR_CONNECTION_REFUSED tuzatish

## Sabab

`AiDoktorai.fargana.uz` **boshqa server IP**ga yo‘naltirilgan:

- **Hozir:** `AiDoktorai.fargana.uz` → **185.183.243.161**
- **Kerak:** `AiDoktorai.fargana.uz` → **167.71.53.238** (backend va frontend joylashgan server)

Shuning uchun brauzer `/health/` va `/api/auth/login/` so‘rovlarini 185.183.243.161 ga yuboradi va u yerda ilova yo‘q – **ERR_CONNECTION_REFUSED**.

## Yechim

**fargana.uz** domeni boshqariladigan joyda (Cloudflare, reg.ru, yoki boshqa DNS provayder) **AiDoktorai.fargana.uz** uchun **A** yozuvini quyidagicha o‘zgartiring:

| Type | Name / Host | Value / Points to | TTL |
|------|-------------|-------------------|-----|
| A    | AiDoktorai    | **167.71.53.238** | 300 yoki 3600 |

- **Name:** `AiDoktorai` yoki `AiDoktorai.fargana.uz` (provayderga qarab)
- **Value:** **167.71.53.238** (AiDoktor.fargana.uz bilan bir xil server)

O‘zgarish tarqalishi 5–60 daqiqa (TTL ga qarab) davom etadi. Keyin:

- `https://AiDoktorai.fargana.uz/health/` – 200
- `https://AiDoktorai.fargana.uz/api/auth/login/` – backend javob beradi

## Tekshirish

DNS yangilangach:

```bash
nslookup AiDoktorai.fargana.uz
# Address bo‘lishi kerak: 167.71.53.238
```

Brauzerda yoki `curl` bilan:

```bash
curl -sI https://AiDoktorai.fargana.uz/health/
# HTTP/2 200 ko‘rinishi kerak
```
-NoNewline
