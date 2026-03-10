# medoraai.cdcgroup.uz – ERR_CONNECTION_REFUSED tuzatish

## Sabab

`medoraai.cdcgroup.uz` **boshqa server IP**ga yo‘naltirilgan:

- **Hozir:** `medoraai.cdcgroup.uz` → **185.183.243.161**
- **Kerak:** `medoraai.cdcgroup.uz` → **167.71.53.238** (backend va frontend joylashgan server)

Shuning uchun brauzer `/health/` va `/api/auth/login/` so‘rovlarini 185.183.243.161 ga yuboradi va u yerda ilova yo‘q – **ERR_CONNECTION_REFUSED**.

## Yechim

**cdcgroup.uz** domeni boshqariladigan joyda (Cloudflare, reg.ru, yoki boshqa DNS provayder) **medoraai.cdcgroup.uz** uchun **A** yozuvini quyidagicha o‘zgartiring:

| Type | Name / Host | Value / Points to | TTL |
|------|-------------|-------------------|-----|
| A    | medoraai    | **167.71.53.238** | 300 yoki 3600 |

- **Name:** `medoraai` yoki `medoraai.cdcgroup.uz` (provayderga qarab)
- **Value:** **167.71.53.238** (medora.cdcgroup.uz bilan bir xil server)

O‘zgarish tarqalishi 5–60 daqiqa (TTL ga qarab) davom etadi. Keyin:

- `https://medoraai.cdcgroup.uz/health/` – 200
- `https://medoraai.cdcgroup.uz/api/auth/login/` – backend javob beradi

## Tekshirish

DNS yangilangach:

```bash
nslookup medoraai.cdcgroup.uz
# Address bo‘lishi kerak: 167.71.53.238
```

Brauzerda yoki `curl` bilan:

```bash
curl -sI https://medoraai.cdcgroup.uz/health/
# HTTP/2 200 ko‘rinishi kerak
```
