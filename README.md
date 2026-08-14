# ORACLE FORGE

منصة SaaS لإنشاء وإدارة نسخ Lite من بوتات واتساب المبنية على قالب ORACLE V3
(إطار DRAKON). المستخدم بيسجل دخول، يدخل بيانات بوته عبر Wizard من 7 خطوات،
ومحرك البناء بينسخ القالب، يطبّق الإعدادات فعليًا، ويطلعله ZIP جاهز للتحميل.

---

## 1) هيكل المشروع

```
forge/
├── app/
│   ├── page.jsx                  صفحة الهبوط (Landing)
│   ├── layout.jsx                Layout رئيسي + الخطوط
│   ├── globals.css               نظام الألوان والأنماط العامة
│   ├── login/page.jsx
│   ├── register/page.jsx
│   ├── (app)/                    كل صفحات الداشبورد (محمية بتسجيل الدخول)
│   │   ├── layout.jsx            Sidebar + Topbar + حماية الدخول
│   │   ├── dashboard/page.jsx
│   │   ├── bots/page.jsx
│   │   ├── bots/BotRow.jsx
│   │   ├── bots/create/page.jsx  الـ Wizard الكامل (7 خطوات)
│   │   ├── bots/[id]/page.jsx
│   │   ├── bots/[id]/BotDetailClient.jsx
│   │   ├── builds/page.jsx
│   │   ├── developer/page.jsx
│   │   ├── about/page.jsx
│   │   └── settings/page.jsx
│   └── api/
│       ├── auth/{register,login,logout,me}/route.js
│       ├── bots/route.js                  (GET list / POST create)
│       ├── bots/[id]/route.js             (GET / PATCH / DELETE)
│       ├── bots/[id]/build/route.js       (POST يبدأ البناء)
│       ├── builds/route.js                (GET سجل كل عمليات البناء)
│       ├── builds/[id]/route.js           (GET حالة بناء محدد - polling)
│       ├── builds/[id]/download/route.js  (GET تحميل الـ ZIP)
│       └── settings/route.js              (PATCH / DELETE إعدادات الحساب)
├── components/                   Sidebar, Topbar, UI kit, Wizard rail, BuildProgress...
├── lib/
│   ├── db.js            إعداد SQLite + الجداول
│   ├── auth.js          تشفير كلمات المرور + جلسات JWT عبر Cookie
│   └── buildEngine.js   محرك البناء الحقيقي (نسخ + تعديل + ZIP)
├── template/oracle-lite/  نسخة ORACLE V3 Lite الأصلية (القالب المصدري - لا يُعدَّل أبدًا)
├── storage/
│   ├── builds/           مجلدات عمل مؤقتة أثناء البناء (بتتنضف تلقائيًا)
│   └── downloads/        ملفات الـ ZIP النهائية
└── data/                  قاعدة بيانات SQLite
```

## 2) اللي اتعمل من الأول (Created)

كل الملفات في `app/`, `components/`, `lib/`, وملفات الإعداد (`package.json`,
`tailwind.config.js`, `postcss.config.js`, `next.config.mjs`, `.env.example`)
اتعملت من الصفر لأن المشروع كان مفيش فيه منصة ويب قبل كده.

## 3) اللي اتعدّل من مشروع البوت (Modified)

**حاجة واحدة بس، ومؤقتة وقت البناء:** محرك البناء (`lib/buildEngine.js`) بينسخ
`template/oracle-lite` لمجلد مؤقت جوه `storage/builds/{buildId}`، ويعدّل فيه:

- `index.js` → `phoneNumber` و `owners` (أرقام/أسماء المطورين)
- `libs/auto-join-channel.js` → إضافة رابط القناة لو موجود
- `package.json` → اسم/نسخة النسخة المبنية
- ملف جديد `bot.meta.json` و `channel.config.json` بمعلومات البناء

**القالب الأصلي جوه `template/oracle-lite` نفسه ميتلمسش أبدًا** — كل تعديل
بيحصل على نسخة مؤقتة، وبعد ما يتعمل الـ ZIP المجلد المؤقت بيتحذف.

> ملاحظة: اسم البوت (`botName`) بيتخزن كـ metadata (`bot.meta.json`) وبيتسجل
> في `package.json`، لكن مبيغيّرش النصوص المزخرفة (يونيكود) اللي مكتوبة يدويًا
> جوه عشرات البلجنز كـ"ORACLE" — ده قرار مقصود عشان منكسرش تنسيقات الشكل
> اللي بنيتها بنفسك. لو عايز البوت يستخدم `bot.meta.json` لعرض اسمه ديناميكيًا
> في مكان معيّن، قولي أضيفه.

## 4) تشغيل المشروع

```bash
cd forge
cp .env.example .env
# افتح .env وحط قيمة عشوائية طويلة لـ JWT_SECRET

npm install
npm run dev
```

الموقع هيشتغل على `http://localhost:3000`.

للإنتاج:
```bash
npm run build
npm start
```

## 5) Environment Variables

| المتغير | الوصف | مثال |
|---|---|---|
| `JWT_SECRET` | مفتاح تشفير جلسات الدخول — لازم يكون طويل وعشوائي | `openssl rand -hex 32` |
| `DB_PATH` | مسار ملف قاعدة بيانات SQLite | `./data/forge.sqlite` |
| `STORAGE_PATH` | مجلد تخزين ملفات البناء والتحميل | `./storage` |
| `TEMPLATE_PATH` | مسار قالب ORACLE Lite المصدري | `./template/oracle-lite` |

## 6) قاعدة البيانات

SQLite عن طريق `better-sqlite3` — بتتنشئ تلقائيًا أول ما السيرفر يشتغل
(مفيش خطوة migration منفصلة مطلوبة). الجداول: `users`, `bots`, `builds`.

## 7) محرك البناء (Build Engine)

كل عملية بناء بتتسجل في جدول `builds` بحالة `queued` وبعدين `processing` وهي
بتنفّذ فعليًا خطوة بخطوة (نسخ → تعديل → ضغط)، والـ progress bar والخطوات
اللي بتظهر في الواجهة بتعكس التقدم الحقيقي (مش تايمر وهمي) عن طريق
polling لـ `/api/builds/[id]` كل ثانية.

## 8) إنشاء أول بوت

1. `/register` → اعمل حساب.
2. من الداشبورد اضغط **Create Bot**.
3. امشي في الـ 7 خطوات (اسم، رقم، أرقام المطورين، أسماء المطورين، القناة، مراجعة).
4. اضغط **Build Bot** — هتشوف تقدم البناء لحظة بلحظة.
5. لما يخلص، زرار **Download Bot** هيدّيك ملف ZIP فيه نسخة ORACLE Lite
   بإعداداتك مطبّقة عليها.

## 9) تحميل ملف الـ ZIP لاحقًا

من `/bots/[id]` أو `/builds` — كل بناء ناجح له رابط "Download" بيودّي على
`/api/builds/[id]/download`، وده بيتحقق إن البناء ده فعلاً بتاع المستخدم
المسجّل دخوله قبل ما يديله الملف.

## 10) الأمان

- كل الـ Validation بيتعمل تاني في الـ Backend (مش بس Frontend).
- كل API endpoint بيتأكد من الجلسة (`getSessionUser`) وإن البوت/البناء
  بتاع نفس المستخدم قبل أي عملية.
- كلمات المرور متخزنة مشفّرة (`bcrypt`)، والجلسة عبارة عن JWT في
  httpOnly cookie — مش متاحة لـ JavaScript في المتصفح.
- مفيش أي secrets أو مسارات سيرفر داخلية متسربة للـ Frontend.
- محرك البناء بيشتغل على نسخة مؤقتة من القالب فقط، وميستخدمش أي user input
  في تنفيذ أوامر shell.

## 11) قيد مهم (Sandbox limitation)

اتكتب المشروع كامل هنا، لكن بيئة العمل اللي بشتغل فيها معندهاش اتصال
إنترنت، يعني قدرت أتحقق من الـ syntax لكل ملفات JS/JSX (باستخدام
`node --check` و `esbuild`) وأختبر منطق محرك البناء فعليًا على ملفات
القالب الحقيقية، لكن مقدرتش أعمل `npm install` ولا أشغّل `npm run dev`
فعليًا هنا. جرّبها عندك زي ما هو موضح فوق، ولو طلع أي error ابعتلي نصه
وأصلحه فورًا.
