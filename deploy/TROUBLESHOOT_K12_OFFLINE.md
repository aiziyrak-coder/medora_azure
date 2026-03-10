# K12 offline — ma'lumot kelmayapti

Qurilma platformada (masalan **K12_001**, IP/Port bo'sh), lekin **offline** qolsa, quyidagilarni tekshiring.

**Eslatma:** Bitta qurilma bo'lsa platforma avtomatik uni default qiladi — serverda .env (GATEWAY_HL7_DEFAULT_DEVICE_ID) kerak emas. K12 ekranida "Connected" / "HL7 connected" yozuvi bo'lmasligi mumkin; muhimi — K12 da **Server IP** va **Port** to'g'ri bo'lsin.

## 1. Port 6006 ochiqmi?

K12 **serverga** 167.71.53.238:**6006** orqali ulanadi. Bu port serverda ochiq bo'lishi kerak.

**Serverda:**
```bash
# Port tinglanayotganini tekshirish
ss -tlnp | grep 6006
```
Gateway ishlasa `0.0.0.0:6006` ko'rinadi.

**Firewall (ufw):**
```bash
sudo ufw allow 6006/tcp
sudo ufw status
```

**Cloud firewall (DigitalOcean, AWS, va h.k.):**  
Panelda **Inbound** rule qo'shing: **TCP**, port **6006**, manba 0.0.0.0/0 (yoki K12 joylashgan tarmoq).

---

## 2. K12 haqiqatan serverga ulanayaptimi?

Gateway logida **"HL7 client connected"** chiqishi kerak (K12 ulanganda).

**Serverda real vaqtda log:**
```bash
journalctl -u medoraai-gateway-9000 -f
```
K12 ni yoqing / tarmoq sozlamasini saqlang. Bir necha soniya ichida quyidagiga o'xshash satr chiqishi kerak:
```
HL7 client connected from ('...', ...)
```
Agar bu satr **hech chiqmasa** — K12 serverga ulana olmayapti (tarmoq, firewall, yoki K12 da Server IP/Port noto'g'ri).

**K12 da tekshirish:**
- Sozlamalar → Tarmoq (yoki Network / HL7): **Server IP** = **167.71.53.238**, **Port** = **6006**
- Ba'zi modellarda "HL7 Server", "Remote host", "Destination" deb yoziladi — shu joyga server manzilini kiriting
- Saqlang va (kerak bo'lsa) qurilmani qayta ishga tushiring. Ekranda "Connected" yozuvi bo'lmasligi mumkin; logda "HL7 client connected" chiqishi muhim

---

## 3. Boshqa kompyuterdan 6006 portini tekshirish

K12 dan boshqa (masalan, ish stolidagi PC) serverning 6006 porti ochiq-yo'qligini tekshirish:

```bash
# Linux/Mac
nc -zv 167.71.53.238 6006

# Windows PowerShell
Test-NetConnection -ComputerName 167.71.53.238 -Port 6006
```
Agar **ulandi** (succeeded / TcpTestSucceeded) — port ochiq. Agar timeout/refused — firewall yoki cloud firewall 6006 ni bloklayapti.

---

## 4. Qisqacha tekshiruv

| Qadam | Qayerda | Nima qilish |
|-------|---------|-------------|
| 1 | Server | `ss -tlnp \| grep 6006` — 6006 tinglanayapti |
| 2 | Server | `ufw allow 6006/tcp` (ufw ishlasa) |
| 3 | Cloud panel | Inbound TCP 6006 ochiq |
| 4 | K12 | Server IP = 167.71.53.238, Port = 6006 |
| 5 | Server | `journalctl -u medoraai-gateway-9000 -f` — "HL7 client connected" chiqishi |

"HL7 client connected" chiqsa va K12 ma'lumot yuborsa, platformada qurilma 1–2 daqiqada **online** bo'lishi kerak.
