# Qurilmadagi ma'lumotlarni platformada chiqarish

Platformada (Monitoring dashboard) qurilma ma'lumotlari (HR, SpO2, NIBP, temp va boshqalar) chiqishi uchun quyidagi zanjir kerak.

## 1. Demo ma'lumot (darhol ko'rinishi uchun)

Deploy paytida avtomatik ishlatiladi:

```bash
python manage.py create_monitoring_demo_data
```

Bu bitta **qanot**, **xona**, **qurilma** (seriya `K12_01`), **bemor monitori** va **demo vitals** yaratadi. Dashboardda bitta kartochka ko'rinadi (demo qiymatlar bilan). Haqiqiy qurilma ulangach, shu qurilma (serial `K12_01`) orqali kelgan ma'lumotlar ham shu kartochkada yangilanadi.

## 2. Haqiqiy qurilma ma'lumotlarini platformaga olib kelish

### 2.1 Backend da qurilma va bemor ro'yxatda bo'lishi kerak

- **Boshqaruv** → Qanot, Xona, Qurilma, Bemor qo'shing.
- Qurilma **seriya raqami** (masalan `K12_01`) keyinchalik gateway dan keladigan `device_id` bilan **bir xil** bo'lishi kerak.
- Bemor monitori: qurilmani palata va kravatga birikting.

### 2.2 Gateway ishlashi kerak

Gateway (TCP/HL7 dan o'qiydi va backend ga POST qiladi):

- **Ishga tushirish:** `uvicorn monitoring_gateway.main:app --host 0.0.0.0 --port 9000`
- **Sozlama (env):**
  - `GATEWAY_BACKEND_URL=https://medora.cdcgroup.uz/api` (yoki backend manzilingiz)
  - `GATEWAY_INGEST_API_KEY=<backend dagi MONITORING_INGEST_API_KEY bilan bir xil>`
  - HL7 qurilmalar uchun: `GATEWAY_HL7_DEFAULT_DEVICE_ID=K12_01` (backend dagi qurilma seriyasi bilan mos)
  - TCP qurilmalar uchun: `GATEWAY_MONITORS=device_id:ip:port,...`

### 2.3 Oqim

1. Qurilma (K12 yoki boshqa) → TCP/HL7 orqali **Gateway** ga yuboradi (yoki Gateway qurilmaga TCP ulanadi).
2. Gateway ma'lumotni parse qilib `POST /api/monitoring/ingest/` ga yuboradi (X-API-Key bilan).
3. Backend `device_id` bo'yicha **Device** topadi, **PatientMonitor** orqali **VitalReading** yozadi.
4. Platforma (frontend) **Dashboard** ni har N sekundda yangilab, **last_vital** ni ko'rsatadi. Ixtiyoriy: WebSocket (gateway dan) orqali real-time ham mumkin (`VITE_MONITORING_WS_URL`).

## 3. Tekshirish

- Dashboardda kartochka ko'rinadi, lekin vitals bo'sh: Gateway ishlamayapti yoki `device_id` backend dagi qurilma seriyasi bilan mos emas.
- Ingest 404: Backend da shu `device_id` (serial_number) li **Device** va unga biriktirilgan **PatientMonitor** yo'q.
- Ingest 200/201: Ma'lumot yozildi; bir necha soniyadan keyin dashboard yangilanishi kerak (polling).
