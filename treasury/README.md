تشغيل محلي

1) إعداد:
- انسخ البيئة: `cp .env.example .env`
- ثبّت: `npm i`

2) قاعدة البيانات:
- استخدم PostgreSQL محليًا أو Docker (مثال docker مذكور في الوصف)
- حدث `DATABASE_URL` إذا لزم

3) تهيئة:
- `npm run prisma:migrate`
- `npm run prisma:seed`
- `npm run dev`

روابط مفيدة:
- `/` لوحة التحكم
- `/projects`, `/cashboxes`, `/invoices`, `/partners`, `/partners/settlement`, `/clients`, `/suppliers`, `/backup`
- `/api/tests/acceptance` لاختبار توازن القيود

Treasure

