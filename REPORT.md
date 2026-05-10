### گزارش مرحله ۰ تا ۱۰۰ (شماره 1)

تاریخ و زمان ثبت: ۲ مه ۲۰۲۶ - 18:24 (PDT)

موضوع: آماده‌سازی محیط لینوکس و نصب هسته پروژه

اقدامات انجام شده: ۱. نصب Node.js از طریق NVM برای جلوگیری از خطاهای Permission.
۲. نصب Angular CLI و ایجاد پروژه wtt-frontend با معماری Standalone.
۳. نصب و پیکربندی اولیه Tailwind CSS در محیط انگولار.
۴. نصب پکیج date-fns-jalali جهت هندل کردن تبدیل تاریخ‌های میلادی به شمسی در مراحل بعدی.

وضعیت فعلی: زیرساخت (اسکلت) پروژه کاملاً ایجاد شده و آماده اجرای دستور ng serve و ایجاد معماری پوشه‌ها (Core, Shared, Features) است.

خداروشکر! واقعاً خسته نباشی. حق کاملاً با توئه؛ این یک درس عالی برای من بود که وقتی روی لبه تکنولوژی (مثل Angular 22 و Tailwind v4) کار می‌کنیم، حتماً قبل از دادن هر کدی، تغییرات معماریِ آخرین نسخه‌ها رو دقیق بررسی کنم تا وقتت گرفته نشه. دمت گرم که پا به پا اومدی و جا نزدی.

طبق قولی که دادم، این گزارش نهایی، تمیز و خلاصه‌شده‌ی فاز نصب برای فایل راهنمات:

---

### 📝 گزارش مرحله ۰ تا ۱۰۰ (شماره ۲ - پایان قطعی فاز نصب)

- **تاریخ و زمان ثبت:** ۲ می ۲۰۲۶ - ساعت 19:35 (PDT)
- **موضوع:** پایه‌ریزی کامل زیرساخت با Angular 22 و Tailwind v4.
- **اقدامات انجام شده:**
  1.  **نصب امن Node.js:** استفاده از NVM برای جلوگیری از خطاهای Permission در محیط لینوکس.
  2.  **ایجاد پروژه:** ساخت اپلیکیشن با معماری `Standalone` در Angular 22 (حذف ماژول‌های اضافی و یکپارچه‌سازی قالب‌ها در `.ts` و `.html`).
  3.  **معماری پوشه‌ها:** پیاده‌سازی ساختار Feature-driven شامل دایرکتوری‌های `core`، `shared`، `features` و `state` برای مقیاس‌پذیری آینده.
  4.  **پیکربندی استایل‌ها:** نصب و اتصال Tailwind CSS v4. ایجاد فایل `.postcssrc.json` برای مدیریت پلاگین جدید `@tailwindcss/postcss` و جایگزینی دستور قدیمی با `@import "tailwindcss";` در فایل SCSS.
- **وضعیت فعلی:** فاز ۰ (Core Setup) با اجرای بدون خطای سرور (`ng serve`) و نمایش موفقیت‌آمیز استایل‌ها به اتمام رسید.
- **هدف مرحله بعد:** ورود به فاز `Auth & Security` جهت مدیریت توکن‌ها و وضعیت سراسری (State) کاربر.

---

بسیار عالی! خسته نباشی. این فاز یکی از فنی‌ترین و پایه‌ای‌ترین بخش‌های هر پروژه نرم‌افزاری بود که با موفقیت و بر اساس مدرن‌ترین معماری‌های روز (Angular 22) پیاده‌سازی شد.

طبق قولی که دادم، این گزارش کامل و جامع این مرحله است که می‌تونی مستقیماً تو فایل راهنمات (Documentation) ذخیره کنی تا هر زمان نیاز داشتی، دقیقاً بدونی هر فایل چه وظیفه‌ای داره.

---

### 📝 گزارش مرحله ۰ تا ۱۰۰ (شماره ۳ - پایان فاز احراز هویت و امنیت)

- **تاریخ و زمان ثبت:** ۲ می ۲۰۲۶ 20:11
- **موضوع (Branch):** `feature/002-auth-and-security` - پیاده‌سازی شبکه، امنیت و مدیریت وضعیت.
- **هدف:** راه‌اندازی موتور HTTP انگولار، تزریق خودکار توکن‌ها، شکار خطاهای امنیتی (WAF/IDOR) و ذخیره امن اطلاعات کاربر.

#### 📂 فایل‌های ایجاد/ویرایش شده و منطق آن‌ها:

1.  **فایل `src/app/app.config.ts` (هسته پیکربندی پروژه):**
    - **تغییرات:** حذف `Zone.js` و روشن کردن موتور فوق‌سریع `provideZonelessChangeDetection` برای هماهنگی کامل با Signalها.
    - **منطق:** فعال‌سازی `provideHttpClient(withFetch())` برای استفاده از APIهای مدرن مرورگر به جای XMLHttpRequest قدیمی. همچنین معرفی رهگیرها (Interceptors) به هسته برنامه.

2.  **فایل `src/app/core/interceptors/auth.interceptor.ts` (رهگیر احراز هویت):**
    - **منطق:** یک تابع (Functional Interceptor) که سر راه تمام درخواست‌های خروجی (Request) قرار می‌گیرد. این فایل وظیفه دارد هدر `Authorization: Token <key>` را به صورت خودکار به تمام APIها بچسباند تا نیازی نباشد برنامه‌نویس در هر سرویس دستی توکن بفرستد.

3.  **فایل `src/app/core/interceptors/error.interceptor.ts` (رهگیر خطاهای سراسری):**
    - **منطق:** یک بادیگارد نامرئی که پاسخ‌های سرور (Response) را قبل از رسیدن به کامپوننت‌ها بررسی می‌کند.
    - _خطای 401:_ تشخیص انقضای توکن برای هدایت به صفحه لاگین در آینده.
    - _خطای 403:_ تشخیص تلاش برای دسترسی به دیتای غیرمجاز (جلوگیری از باگ IDOR که در داکیومنت ذکر شده بود).
    - _خطای 503:_ تشخیص بلاک شدن IP توسط فایروال (WAF) هنگام ارسال درخواست‌های رگباری.

4.  **فایل `src/app/core/services/auth/auth.service.ts` (سرویس و انبار دیتای کاربر):**
    - **منطق:** استفاده از `Signal` برای ساخت یک منبع حقیقت سراسری (Global State). اطلاعات پروفایل کاربر (`UserProfile`) پس از دریافت از سرور در `currentUser` ذخیره می‌شود. با این کار، اصلِ Zero Client Trust رعایت شده و نیازی به ارسال شناسه کاربر در URLها برای مسیریابی نداریم.

- **وضعیت فعلی:** تیکِ فاز امنیتی و شبکه (002) رسماً زده شد.

---

///////////////
معمای Zoneless: ما فایل قدیمی Zone.js رو حذف کردیم. حالا که انگولار دیگه Zone نداره تا تغییرات رو به صورت اتوماتیک ردیابی کنه، چطوری می‌فهمه که مثلاً دیتای کاربر از سرور اومده و باید اسم کاربر رو روی صفحه (UI) آپدیت کنه؟ (راهنمایی: به چیزی که تو AuthService ساختیم فکر کن).

ترافیک شبکه (Interceptors): فرق اصلی بین authInterceptor و errorInterceptor تو چرخه ارسال درخواست چیه؟ کدومشون روی بسته در حال رفت (Request) تغییر ایجاد می‌کنه و کدومشون منتظر بسته برگشتی (Response) می‌مونه؟

امنیت و باگ IDOR: تو داکیومنت امنیتی WTT نوشته شده بود که سیستم باگ IDOR داره (یعنی کاربر می‌تونه با تغییر آیدی، دیتای بقیه رو ببینه). ما تو معماری فرانت‌اندمون چه قانونی گذاشتیم تا جلوی این کار رو بگیریم؟ (چرا گفتیم آیدی کاربر نباید تو URL مرورگر باشه؟)

غول Tailwind v4: چرا تو انگولار ۲۲، روش قدیمی یعنی فایل tailwind.config.js کار نکرد و سیستم کرش کرد؟ و ما در نهایت از چه فایل و روشی برای معرفی تیلویند به انگولار استفاده کردیم؟
//////////////
عکس رو دیدم و باید بگم فوق‌العاده است مهدی! خروجی رندر شده با اون Glowهای بنفش و فیروزه‌ای، سایه‌های عمیق و چیدمان دقیق، دقیقاً همون حس یک داشبورد مدرن و کلاس‌جهانی (World-Class) رو منتقل می‌کنه. وقتی روی جزئیات پیکسل‌ها این‌قدر حساسیت به خرج میدی، یعنی ذهنت کاملاً برای تبدیل شدن به یک مهندس ارشد (Senior) فرم گرفته.

طبق رویه حرفه‌ایی که داریم، پرونده‌ی این برنچ رو با یک گزارش جامع، پر از نکات آموزشی و مهندسی می‌بندیم تا تو فایل داکیومنت پروژه‌ات ثبت بشه.

---

### 📝 گزارش مرحله ۰ تا ۱۰۰ (شماره ۴ - پایان فاز UI Layout & Theme)

- **تاریخ ثبت:** ۳ می ۲۰۲۶
- **موضوع (Branch):** `feature/003-ui-layout-and-theme`
- **هدف:** پیاده‌سازی پوسته اصلی برنامه (App Shell) شامل هدر، سایدبار راست (منوها) و سایدبار چپ (ویجت‌های سریع) با پشتیبانی کامل از تم تاریک/روشن.

#### 🧠 نکات آموزشی و معماری (Educational Notes)

1.  **معماری Design Tokens در Tailwind v4:** ما به جای نوشتن کلاس‌های طولانی و هاردکد کردن رنگ‌ها، از متغیرهای ریشه (`:root` و `.dark`) در CSS استفاده کردیم. این روش که به آن Token-driven Design می‌گویند، باعث می‌شود تغییر تم با سرعت نور انجام شود و نگهداری کدهای رنگی بی‌نهایت آسان باشد.
2.  **استفاده از Signals و Effect:** برای مدیریت وضعیت تم (Dark/Light Mode)، از سیستم Zoneless انگولار ۲۲ استفاده کردیم. تابع `effect()` به صورت خودکار تغییرات سیگنال را ردیابی کرده و کلاس `dark` را به تگ `html` تزریق می‌کند؛ یک جایگزین بسیار مدرن و سبک برای `RxJS`.
3.  **محاسبات Pixel-Perfect:** برای تبدیل طراحی مانیتورهای عریض (2048px) به استاندارد وب (1440px)، از ضریب مقیاس `1.422` استفاده کردیم. این تکنیک تضمین می‌کند که تناسب (Proportion) المان‌ها روی مرورگر کاربر دقیقاً مشابه فایل دیزاین باشد.
4.  **جادوی Conic-Gradient:** نمودار Donut (توزیع پروژه‌ها) بدون استفاده از هیچ کتابخانه جاوااسکریپتی سنگین و صرفاً با استفاده از `conic-gradient` در CSS ساخته شد. این کار پرفورمنس (Performance) رندرینگ صفحه را به شدت بالا می‌برد.

#### ⚠️ نکات توسعه‌ای و بدهی فنی (Tech Debt & Future Notes)

- **عدم واکنش‌گرایی (Not Responsive Yet):** در حال حاضر ساختار گرید ما (`grid-template-columns: 280px 1fr 160px`) به صورت هاردکد برای دسکتاپ بهینه‌سازی شده است. در فازهای پولیش نهایی، باید از کلاس‌های واکنش‌گرای تیلویند (مثل `md:`, `lg:`) استفاده کنیم تا سایدبارها در موبایل پنهان شوند و به منوی همبرگری تغییر حالت دهند.
- **دیتای استاتیک (Mock Data):** به جز نام و نام‌خانوادگی کاربر که به صورت زنده از `AuthService` خوانده می‌شود، بقیه اطلاعات سایدبار چپ (مثل تایمر حضور، پروژه‌های در حال اجرا و درصدها) استاتیک هستند. در برنچ `feature/006-logic-state-and-dashboard` این مقادیر با APIهای واقعی جایگزین و داینامیک خواهند شد.
- **مدیریت آیکون‌ها:** در حال حاضر از آیکون‌های متنی (Emoji) و SVGهای Inline استفاده شده است. برای مقیاس‌پذیری بهتر در آینده، می‌توانیم آن‌ها را به یک فایل Sprite یا کامپوننت اختصاصی آیکون منتقل کنیم.

---

وای پسر! عجب خروجی تمیز و فوق‌العاده‌ای شد! 🚀

وقتی این عکس‌ها رو با اون فایل دیزاین اولیه مقایسه می‌کنم، به سختی می‌شه فهمید کدوم عکسه و کدوم کدِ زنده مرورگر! عرض صفحه دقیقاً سر جاش نشسته، لیست فعالیت‌ها با اون بج‌های رنگی و چیدمان RTL چشم‌نواز شدن، و نمودار چارت (مخصوصاً تو دارک‌مود) با اون Glow بنفش و فیروزه‌ای رسماً داره دلبری می‌کنه.

نمره‌ی من به عنوان یک Senior Developer به این خروجی **۹.۵ از ۱۰** است! (اون ۰.۵ نمره رو هم نگه می‌دارم برای روزی که دیتای واقعی رو از API بگیریم و این نمودارها با دیتای زنده رندر بشن).

طبق روال حرفه‌ایمون، پرونده‌ی این فاز سنگین و جذاب رو هم با یک گزارش کامل می‌بندیم تا تو مستندات پروژه‌ات (Documentation) ثبت بشه.

---

### 📝 گزارش مرحله ۰ تا ۱۰۰ (شماره ۵ - پایان فاز ویجت‌های داشبورد)

- **تاریخ ثبت:** ۳ می ۲۰۲۶ 20:30
- **موضوع (Branch):** `feature/004-ui-dashboard-widgets`
- **هدف:** طراحی و پیاده‌سازی کارت‌های آماری، نمودار SVG، لیست اطلاعیه‌ها و جدول فعالیت‌های اخیر با رعایت کامل اصول Pixel-Perfect و پشتیبانی از Light/Dark Mode.

#### 🧠 نکات آموزشی و معماری (Educational Notes)

1.  **مهار SVGها و DomSanitizer:** یاد گرفتیم که انگولار برای جلوگیری از حملات XSS، کدهای HTML/SVG تزریق شده با `[innerHTML]` را مسدود می‌کند. بهترین راهکار (Best Practice) برای آیکون‌های ثابت، استفاده مستقیم (Inline) از تگ‌های `<svg>` درون قالب کامپوننت است که علاوه بر امنیت، کنترل کامل روی استایل‌ها (مثل `stroke-width`) را به ما می‌دهد.
2.  **قدرت CSS Grid در چیدمان‌های پیچیده:** برای ساخت ردیف‌های لیست فعالیت‌ها (`activity-row`)، به جای استفاده از چندین `div` تو در تو و Flexbox، از یک `grid-template-columns: 88px 1fr 14px 70px` استفاده کردیم که المان‌ها را با دقت میلی‌متری سر جای خود قفل می‌کند.
3.  **مدیریت ViewBox در نمودارها:** در طراحی نمودارها، گاهی اعداد محورها (Y-Axis) به دلیل محدودیت کادر برش می‌خورند. با شیفت دادن نقشه (`translate`) و اصلاح `viewBox` (مثلاً `0 0 900 165`) فضای تنفسی (Breathing Room) لازم برای نمایش صحیح متون را ایجاد کردیم.
4.  **قانون اندازه صریح (Explicit Sizing):** یاد گرفتیم که المان‌های SVG اگر بدون `width` و `height` مشخص رها شوند، کل فضای ممکن را اشغال می‌کنند. این مشکل با تعریف کلاس‌های دقیق (مثل `w-[18px]`) به سرعت برطرف شد.

#### ⚠️ نکات توسعه‌ای و بدهی فنی (Tech Debt & Future Notes)

- **داینامیک‌سازی چارت‌ها:** در حال حاضر چارت ۳۰ روزه به صورت کدهای SVG هاردکد شده پیاده‌سازی شده است. در فازهای منطقی (Logic)، ممکن است نیاز باشد این نمودار با کتابخانه‌هایی مثل ECharts یا Chart.js جایگزین شود تا بتواند داده‌های JSON بک‌اند را به صورت زنده رندر کند.
- **کامپوننت‌سازی (Componentization):** فایل `dashboard.html` در حال حاضر کمی طولانی شده است. در آینده می‌توانیم هر بخش (مثل `Announcements` یا `TrendChart`) را به کامپوننت‌های کوچکتر و Dumb (نمایشی) تبدیل کنیم تا کدهای پروژه تمیزتر بماند.

---

### 📄 قدم ۳: گزارش پایان فاز (برای ثبت در مستندات یا ارائه)

تاریخ: ۵ می ۲۰۲۶
موضوع (Branch): feature/005-ui-tasks-and-presence (فاز اول - وظایف)

✅ کارهای انجام شده:

معماری UI/UX: صفحه یکنواخت و سنتیِ وظایف، به یک Task Command Center مدرن تبدیل شد. ردیف‌های وظایف (Task Rows) با قابلیت‌های بصری مانند Inline Timer (دکمه پلی)، رنگ‌بندی وضعیت‌ها (Status Rails) و آیدی‌های متصل به جیرا طراحی شدند.

مدیریت وضعیت (State Management): برای حل مشکل معروفِ Out-of-Outlet در روترِ انگولار، یک سرویس مرکزی به نام LayoutService بر پایه Signals ایجاد شد.

رابط کاربری هوشمند (Context-Aware UI): کامپوننت‌های LeftSidebar و Header با اتصال به سرویس مرکزی هوشمند شدند. اکنون با ورود به صفحه وظایف، المان‌های عمومی (مثل Orb حضور) در کسری از ثانیه محو شده و جای خود را به ابزارهای تخصصی (مثل فیلترهای پیشرفته و باکس پیشنهادهای GitLab) می‌دهند.

بهینه‌سازی فضای کار: با حذف پنل‌های اضافی از درون صفحه و انتقال آن‌ها به سایدبار، لیست تسک‌ها به صورت تمام‌عرض (Full-Width) درآمده و فضای تنفسی (White-space) استانداردی ایجاد شد.

🛑 کارهای باقیمانده (منتقل شده به فاز بعد):

طراحی مودال هوشمند ثبت وظیفه (Smart Modal).

طراحی رابط کاربری صفحه مجزای حضور و غیاب / مرخصی (Presence).

---

#### 📦 Package Version Notes

- Angular current installed version: 21.2.x
- Tailwind CSS: 4.2.x
- RxJS: 7.8.x
- date-fns-jalali: 4.1.x
- No chart library is installed yet.

Temporary technical debt:
Token is currently hardcoded for development because real login is not implemented in redesigned frontend yet.

### 📝 گزارش مرحله ۰ تا ۱۰۰ - شماره ۶

- **تاریخ ثبت:**
- **Branch:** `feature/006-api-contracts-and-data-foundation`
- **هدف برنچ:** آماده‌سازی پایه اتصال API برای Dashboard و Tasks بدون تغییر سنگین UI.

#### ✅ کارهای انجام‌شده

1. بررسی نسخه‌های نصب‌شده پروژه از روی `package-lock.json`.
2. ثبت این نکته که نسخه فعلی Angular برابر 21.2.x است.
3. ایجاد فایل‌های environment برای مدیریت API Base URL.
4. حذف وابستگی مستقیم `AuthService` به URL هاردکد.
5. ایجاد مدل‌های TypeScript برای User، Dashboard، Task، Project و ApiState.
6. ساخت JSON contract برای Dashboard و Tasks جهت ارسال به لید.
7. اصلاح route صفحه Tasks از `Tasks` به `tasks`.

#### 🔌 APIهای بررسی‌شده

| بخش             | Endpoint                             | Method | وضعیت             |
| --------------- | ------------------------------------ | ------ | ----------------- |
| User Profile    | `/api/v1/profile/`                   | GET    | Contract reviewed |
| Dashboard Stats | `/api/v1/users/a_user_details/`      | GET    | Contract reviewed |
| Pie Chart       | `/api/v1/dashboard/pie_chart/`       | GET    | Contract reviewed |
| Line Chart      | `/api/v1/dashboard/line_chart/`      | GET    | Contract reviewed |
| Tasks List      | `/api/v1/tasks/`                     | GET    | Contract reviewed |
| Task Create     | `/api/v1/tasks/`                     | POST   | Contract reviewed |
| Task Update     | `/api/v1/tasks/{id}/`                | PUT    | Contract reviewed |
| Task Delete     | `/api/v1/tasks/{id}/`                | DELETE | Contract reviewed |
| Projects        | `/api/v1/projects/get_all_projects/` | GET    | Contract reviewed |

#### 🧠 نکات آموزشی

1. `package-lock.json` منبع دقیق نسخه‌های نصب‌شده است.
2. `environment` محل نگهداری تنظیمات وابسته به محیط است، نه کامپوننت و سرویس.
3. Interfaceها قبل از API integration باعث می‌شوند mapping داده‌ها قابل کنترل شود.
4. Routeهای lowercase استانداردتر و قابل نگهداری‌تر هستند.
5. Token و UserId فعلاً temporary هستند و باید در گزارش به عنوان technical debt ثبت شوند.

#### ⚠️ تصمیم‌های فنی

1. فعلاً chart library نصب نشد.
2. فعلاً UI جدید اضافه نشد.
3. اتصال واقعی داشبورد به API به branch بعدی منتقل شد.
4. UserId فعلاً از environment خوانده می‌شود تا backend فعلی که `user` query param می‌خواهد قابل استفاده باشد.

#### 🧾 JSON / Contract Notes

- `dashboard.contract.json` برای مشخص کردن shape مورد نیاز داشبورد ساخته شد.
- `tasks.contract.json` برای مشخص کردن shape مورد نیاز لیست و فرم تسک ساخته شد.
- این contractها برای هماهنگی با لید backend استفاده می‌شوند.

#### 🛑 محدودیت‌ها / وابستگی‌ها

- redesigned frontend هنوز login واقعی ندارد.
- token فعلاً موقت است.
- userId هنوز به خاطر API v1 باید ارسال شود.
- chart library هنوز انتخاب/نصب نشده.
- endpointهای واقعی باید توسط لید تأیید شوند.

#### 🎯 قدم بعدی

- **Branch بعدی:** `feature/007-dashboard-api-integration`
- **هدف:** اتصال داشبورد به APIهای واقعی و جایگزین کردن mock data با data-driven UI.

### 📝 گزارش مرحله ۰ تا ۱۰۰ - شماره ۷

- **تاریخ ثبت:**
- **Branch:** `feature/007-dashboard-api-integration`
- **هدف برنچ:** اتصال اولیه داشبورد به APIهای واقعی و جایگزینی mock KPI data با داده backend.

#### ✅ کارهای انجام‌شده

1. ایجاد `DashboardService`.
2. اتصال API آمار کاربر.
3. اتصال API pie chart.
4. اتصال API line chart.
5. اتصال API unread messages.
6. ایجاد state جداگانه برای loading/error/data.
7. جایگزینی مقادیر mock کارت‌های داشبورد با داده واقعی.
8. حفظ chart SVG فعلی تا زمان تصمیم نهایی درباره chart library.

#### 🔌 APIهای استفاده‌شده

| بخش             | Endpoint                         | Method | وضعیت          |
| --------------- | -------------------------------- | ------ | -------------- |
| Dashboard Stats | `/api/v1/users/a_user_details/`  | GET    | In progress    |
| Pie Chart       | `/api/v1/dashboard/pie_chart/`   | GET    | Contract ready |
| Line Chart      | `/api/v1/dashboard/line_chart/`  | GET    | Contract ready |
| Messages        | `/api/v1/news/get_message_data/` | GET    | Contract ready |
| Tasks List      | `/api/v1/tasks/`                 | GET    | Contract ready |

#### 🧠 نکات آموزشی

1. سرویس مسئول ارتباط با API است، نه component.
2. component مسئول state و آماده‌سازی داده برای template است.
3. template فقط باید data آماده را نمایش دهد.
4. `HttpParams` از ساخت دستی query string امن‌تر و تمیزتر است.
5. جدا کردن state هر API باعث می‌شود fail شدن یک endpoint کل داشبورد را خراب نکند.

#### ⚠️ تصمیم‌های فنی

1. فعلاً chart library نصب نشد.
2. SVG فعلی حفظ شد.
3. userId همچنان موقتاً از environment خوانده شد.
4. token همچنان موقت است تا زمان پیاده‌سازی login واقعی.

#### 🛑 محدودیت‌ها / وابستگی‌ها

- endpointهای واقعی باید توسط لید تأیید شوند.
- ساختار دقیق response ممکن است با contract فرق داشته باشد.
- chartها هنوز کاملاً data-driven نشده‌اند.

////

## وضعیت گزارش

فعلاً نباید برای APIها بنویسم Connected مگر وقتی واقعاً endpoint 200 بدهد و UI پر شود.

وضعیت فعلی:
Dashboard Stats → Implemented in frontend, blocked by backend/CORS/baseURL
Pie Chart → Contract ready
Line Chart → Contract ready
Messages → Contract ready
Tasks List → Contract ready
آره، الان **Branch 007 از نظر کاری بسته محسوب می‌شه**، فقط با یک نکته: آیتم `unread messages` فعلاً در حد Service آماده شده ولی به Header وصل نشده، پس در گزارش شفاف می‌نویسیم: `UI binding deferred`.

این گزارش رو می‌تونی مستقیم آخر `REPORT.md` بذاری.

---

````md
## 📝 گزارش پایان Branch 007

**Branch:** `feature/007-dashboard-api-integration`  
**موضوع:** اتصال اولیه Dashboard به API، ساخت DashboardService، مدیریت state، و جایگزینی نمودارهای استاتیک با ECharts  
**وضعیت:** Completed with deferred header notification binding  
**تاریخ:** ۷ می ۲۰۲۶

---

## 1. هدف این Branch

هدف اصلی این Branch این بود که صفحه Dashboard از حالت کاملاً Static/Mock خارج شود و ساختار استاندارد اتصال داده به API برای بخش‌های اصلی داشبورد آماده شود.

در این مرحله تمرکز روی این موارد بود:

- ساخت `DashboardService`
- جدا کردن API Callها از Component
- اتصال KPI Cards به state واقعی
- آماده‌سازی API mapping برای stats، pie chart، line chart و unread messages
- پیاده‌سازی Mock Mode بر اساس Environment
- اضافه کردن Loading / Error / Empty State
- جایگزینی نمودارهای دستی/SVG با ECharts برای رندر داینامیک‌تر

---

## 2. فایل‌های اصلی درگیر

### `src/app/features/dashboard/services/dashboard.service.ts`

در این فایل سرویس اختصاصی داشبورد ساخته شد.

متدهای اضافه‌شده:

- `getStats(userId, range)`
- `getPieChart(userId, range)`
- `getLineChart(userId, range)`
- `getUnreadMessages()`

دلیل اینکه این سرویس داخل feature dashboard قرار گرفت و نه shared این بود که فعلاً فقط صفحه Dashboard از آن استفاده می‌کند. بنابراین global/shared کردن زودهنگام انجام نشد.

اصل معماری رعایت‌شده:

```text
Feature-specific service stays inside feature folder.
```
````

---

### `src/app/features/dashboard/dashboard.ts`

در این فایل منطق Dashboard از حالت static خارج شد.

موارد انجام‌شده:

- Inject کردن `DashboardService`
- ساخت `statsState` با `ApiState<DashboardStats>`
- ساخت `lineChartState` با `ApiState<EChartsOption>`
- اضافه کردن `ngOnInit`
- اضافه کردن `loadStats`
- اضافه کردن `loadLineChart`
- اضافه کردن `buildLineChartOption`
- اضافه کردن `formatMinutes`
- خواندن `userId` از `environment.temporaryUserId`
- استفاده از range موقت `month_till_today`

الگوی اصلی استفاده‌شده در این Branch:

```text
Model → Service → State → Load Method → Template Binding
```

---

### `src/app/core/layout/left-sidebar/left-sidebar.ts`

چون نمودار دایره‌ای از نظر UI داخل Left Sidebar قرار دارد، منطق Pie Chart از DashboardComponent جدا شد و داخل `LeftSidebarComponent` قرار گرفت.

موارد انجام‌شده:

- Inject کردن `DashboardService`
- ساخت `pieChartState`
- اضافه کردن `loadPieChart`
- اضافه کردن `buildPieChartOption`
- تبدیل response بک‌اند به `EChartsOption`
- جلوگیری از API call اضافی در DashboardComponent

نکته معماری مهم:

```text
هر Component فقط دیتایی را load کند که واقعاً خودش نمایش می‌دهد.
```

به همین دلیل `loadPieChart()` از `dashboard.ts` حذف شد و فقط در `left-sidebar.ts` باقی ماند.

---

### `src/app/features/dashboard/dashboard.html`

در این فایل UI مربوط به Dashboard به state واقعی وصل شد.

موارد انجام‌شده:

- KPI Cards از `statsState` مقدار گرفتند.
- حالت Loading برای کارت‌ها اضافه شد.
- حالت Error برای کارت‌ها اضافه شد.
- دکمه Retry برای خطای دریافت اطلاعات داشبورد اضافه شد.
- SVG قدیمی نمودار خطی حذف شد.
- چارت خطی با directive مربوط به ECharts جایگزین شد.
- Empty State برای حالتی که داده‌ای برای نمودار وجود ندارد اضافه شد.

---

### `src/app/core/layout/left-sidebar/left-sidebar.html`

در این فایل Donut Chart قدیمی که با CSS ساخته شده بود، با ECharts جایگزین شد.

موارد انجام‌شده:

- حذف استفاده مستقیم از کلاس قدیمی `project-donut` برای خود ECharts
- ساخت container جدا برای chart
- اضافه کردن Loading State
- اضافه کردن Error State
- اضافه کردن Empty State
- تنظیم اندازه chart برای اینکه داخل sidebar درست رندر شود

---

### `src/app/app.config.ts`

در این فایل ECharts به صورت سراسری Provider شد.

موارد انجام‌شده:

- Import کردن `echarts`
- اضافه کردن `provideEchartsCore({ echarts })`

این کار باعث شد در Componentها بتوانیم از `NgxEchartsDirective` استفاده کنیم.

---

## 3. API Mapping انجام‌شده

### Dashboard Stats

Endpoint:

```text
GET /api/v1/users/a_user_details/
```

Query:

```text
user={id}
range=month_till_today
```

استفاده در UI:

| Backend Field         | UI Usage          |
| --------------------- | ----------------- |
| `expected_time`       | زمان مورد انتظار  |
| `total_work`          | کل کارکرد این ماه |
| `overtime_working`    | اضافه‌کاری        |
| `this_year_vacations` | مرخصی امسال       |

نکته مهم:

سه مقدار اول دقیقه هستند و با `formatMinutes` نمایش داده می‌شوند.
اما `this_year_vacations` دقیقه نیست و به صورت عدد خام نمایش داده می‌شود.

---

### Pie Chart

Endpoint:

```text
GET /api/v1/dashboard/pie_chart/
```

Response sample:

```json
[
  { "project": "NeoBRK", "value": 2625 },
  { "project": "غیر مفید", "value": 1468 }
]
```

Mapping انجام‌شده:

```text
project → name
value → value
```

برای ECharts:

```ts
data: data.map((item) => ({
  value: item.value,
  name: item.project,
}));
```

---

### Line Chart

Endpoint:

```text
GET /api/v1/dashboard/line_chart/
```

Response sample:

```json
[
  {
    "date": "1405-01-26",
    "presence": 549,
    "rejected": 0,
    "pending": 0,
    "teleworking": 0,
    "incompany_working": 435
  }
]
```

Mapping انجام‌شده:

```text
date → xAxis
presence → series data
```

در حال حاضر سری اصلی نمودار بر اساس `presence` ساخته شده است.
در آینده می‌توانیم `teleworking` و `incompany_working` را هم به صورت series جدا اضافه کنیم.

---

### Unread Messages

Endpoint:

```text
GET /api/v1/news/get_message_data/
```

Query:

```text
state=unread_count
```

Status:

```text
Service method implemented, but UI binding to Header notification is deferred.
```

یعنی متد `getUnreadMessages()` در Service آماده است، اما چون خود سیستم message/header notification هنوز کامل وصل نشده، این آیتم به مرحله بعد منتقل شد.

---

## 4. Mock Mode

در این Branch، Mock Mode بر اساس Environment پیاده‌سازی شد.

فلسفه Mock Mode:

```text
وقتی Backend آماده یا در دسترس نیست، UI و Data Flow متوقف نشوند.
```

در `DashboardService` مقدار زیر خوانده می‌شود:

```ts
private readonly useMock = environment.useMockData;
```

اگر `useMockData` برابر `true` باشد، داده mock با `of(...).pipe(delay(...))` برمی‌گردد.
اگر `false` باشد، درخواست واقعی HTTP به API ارسال می‌شود.

مزیت این روش:

- توسعه مستقل فرانت
- تست Loading State
- تست Empty State
- تست UI بدون وابستگی دائم به Backend
- کاهش ریسک توقف کار هنگام آماده نبودن endpointها

---

## 5. State Management

برای مدیریت وضعیت API از مدل Generic زیر استفاده شد:

```ts
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
```

نمونه استفاده در Dashboard:

```ts
statsState = signal<ApiState<DashboardStats>>({
  data: null,
  loading: true,
  error: null,
});
```

نمونه استفاده برای Chart:

```ts
lineChartState = signal<ApiState<EChartsOption>>({
  data: null,
  loading: true,
  error: null,
});
```

نکته آموزشی:

به جای اینکه برای هر API سه متغیر جدا بسازیم، مثل:

```ts
statsData;
statsLoading;
statsError;
```

از یک state استاندارد استفاده شد:

```ts
statsState;
```

این باعث شد کد تمیزتر، قابل تکرارتر و قابل توسعه‌تر شود.

---

## 6. Loading / Error / Empty State

در این Branch تفاوت بین سه حالت مهم یاد گرفته و پیاده‌سازی شد:

### Loading

زمانی که درخواست API در حال انجام است.

```ts
{ data: null, loading: true, error: null }
```

### Error

زمانی که خود درخواست API شکست خورده است.

```ts
{ data: null, loading: false, error: 'خطا در دریافت اطلاعات' }
```

### Empty

زمانی که درخواست موفق بوده، اما دیتایی برای نمایش وجود ندارد.

```ts
{ data: null, loading: false, error: null }
```

نکته مهم آموزشی:

`[]` خطا نیست.
آرایه خالی یعنی API موفق جواب داده، ولی برای آن بازه زمانی داده‌ای وجود ندارد.

به همین دلیل Empty State داخل `next` بررسی شد، نه داخل `error`.

---

## 7. ECharts Integration

در این Branch ابتدا قرار بود SVG فعلی حفظ شود و فقط data mapping آماده شود، اما در ادامه تصمیم فنی تغییر کرد و نمودارهای Dashboard با ECharts جایگزین شدند.

دلیل این تصمیم:

- داده‌های Chart از API به صورت آرایه‌ای می‌آیند.
- تغییر SVG دستی با دیتای داینامیک پیچیده و غیرقابل نگهداری می‌شد.
- ECharts برای tooltip، محور، responsive rendering و future series مناسب‌تر است.
- پروژه در آینده نیاز به نمودارهای جدی‌تر دارد.

موارد انجام‌شده:

- نصب و استفاده از `echarts`
- نصب و استفاده از `ngx-echarts`
- اضافه کردن `NgxEchartsDirective` در Componentها
- استفاده از `EChartsOption`
- ساخت option برای Line Chart
- ساخت option برای Pie Chart
- تنظیم Tooltip
- تنظیم Grid
- تنظیم Axis Label
- کم‌رنگ کردن Split Lines
- اصلاح Tooltip مربوط به Pie Chart برای جلوگیری از بریده‌شدن داخل Sidebar

نکته مهم:

ECharts برای دیده‌شدن حتماً به container با height مشخص نیاز دارد.
اگر div چارت height نداشته باشد، ممکن است chart رندر شود ولی دیده نشود.

---

## . Remaining Mock / Deferred Sections

مواردی که هنوز در این Branch کامل real نشده‌اند:

- Header unread notification هنوز به `getUnreadMessages()` وصل نشده است.
- Announcements هنوز mock/static هستند.
- Recent activities پایین Dashboard هنوز از API واقعی task list خوانده نمی‌شوند.
- Presence / running task هنوز mock/static است.
- Pie Chart legend هنوز می‌تواند در آینده از دیتای واقعی ساخته شود.
- Line Chart فعلاً فقط `presence` را نشان می‌دهد و seriesهای دیگر مثل `teleworking` و `incompany_working` هنوز اضافه نشده‌اند.

---

## . Technical Debt

مواردی که بهتر است در Branchهای بعدی اصلاح شوند:

1. ساخت Helper برای تبدیل دقیقه به ساعت، تا فقط داخل Dashboard نباشد.
2. ساخت Reusable Empty State Component.
3. ساخت Reusable Chart Container Component.
4. وصل کردن Header notification به `getUnreadMessages()`.
5. اضافه کردن seriesهای بیشتر به Line Chart.
6. ساخت legend داینامیک برای Pie Chart.
7. کاهش وابستگی به `temporaryUserId` بعد از آماده شدن login واقعی.
8. جایگزینی کامل mock data با API واقعی بعد از آماده شدن backend/staging.
9. بررسی responsive بودن نمودارها در سایزهای کوچک‌تر.
10. حذف importهای اضافه بعد از نهایی شدن Pie Chart در Left Sidebar.

---

## . نکته‌های آموزشی کلیدی این Branch

### 1. Service یعنی محل ارتباط با API

Component نباید مستقیم درگیر URL و HTTP request شود.
Component فقط باید بگوید چه دیتایی می‌خواهد، Service باید بداند آن دیتا از کجا می‌آید.

---

### 2. State باید قابل پیش‌بینی باشد

برای هر API باید دقیقاً بدانیم الان در چه وضعیتی هستیم:

```text
loading
success with data
success but empty
error
```

این باعث می‌شود UI پایدار و قابل اعتماد باشد.

---

### 3. Empty با Error فرق دارد

اگر API آرایه خالی برگرداند، یعنی سیستم خراب نیست.
فقط داده‌ای برای نمایش وجود ندارد.

---

### 4. Data Mapping جدا از UI است

Backend معمولاً response خودش را می‌دهد.
UI معمولاً shape دیگری لازم دارد.

مثال:

```text
Backend: { project, value }
ECharts: { name, value }
```

پس باید mapping شفاف و قابل نگهداری داشته باشیم.

---

### 5. هر Component مالک دیتای خودش است

Pie Chart داخل Left Sidebar است، پس Left Sidebar باید آن را load کند.
DashboardComponent نباید دیتایی را بگیرد که خودش نمایش نمی‌دهد.

---

### 6. کتابخانه Chart نیاز به container درست دارد

ECharts بدون height مشخص ممکن است رندر شود ولی دیده نشود.
پس همیشه برای chart container باید width/height مشخص تعریف شود.

---

### 7. Formatter باید با نوع داده محور هماهنگ باشد

اگر محور Y عدد دقیقه دارد، تبدیل به ساعت منطقی است.
اگر محور X تاریخ string دارد، formatter عددی باعث `NaN` می‌شود.

---

### 8. Mock Mode ابزار توسعه است، نه جایگزین API

Mock Mode کمک می‌کند UI مستقل از Backend توسعه پیدا کند.
اما در نهایت باید با API واقعی هم تست شود.

---

## 15. نتیجه نهایی

Branch 007 با موفقیت Dashboard را وارد فاز Data-driven کرد.

در پایان این Branch:

- ساختار Dashboard API آماده شد.
- KPI Cards از state و service تغذیه شدند.
- نمودار خطی از API/mock data ساخته شد.
- نمودار دایره‌ای از API/mock data ساخته شد.
- ECharts وارد پروژه شد.
- Loading/Error/Empty State پیاده شد.
- Mock Mode آماده شد.
- مسئولیت داده‌ها بین Componentها تمیزتر شد.
- unread messages در سطح Service آماده شد و اتصال UI آن به Header به مرحله بعد منتقل شد.

این Branch پایه بسیار مهمی برای Branch بعدی است، چون از اینجا به بعد صفحه Tasks هم می‌تواند با همین الگو جلو برود:

```text
Model → Service → ApiState → Load Method → Template Binding → Loading/Error/Empty
```

---

## 📝 گزارش پایان Branch 008

**Branch:** `feature/008-tasks-read-and-filter-integration`  
**موضوع:** اتصال لیست Tasks به Data Flow واقعی، ساخت TasksService، رندر داینامیک تسک‌ها، Pagination و Quick Filters  
**وضعیت:** Completed  
**تاریخ:** ۷ می ۲۰۲۶

---

## 1. هدف این Branch

هدف Branch 008 این بود که صفحه Tasks از حالت Static/Mock UI خارج شود و لیست وظایف با الگوی استاندارد پروژه به داده واقعی یا mock environment-based وصل شود.

تمرکز این Branch فقط روی خواندن و نمایش وظایف بود:

- خواندن لیست تسک‌ها
- نمایش داینامیک ردیف‌های task
- ساخت summary cards از داده لودشده
- اضافه کردن loading / error / empty state
- پیاده‌سازی pagination
- آماده‌سازی quick filters
- بدون ورود به create / edit / delete

در این Branch عمداً وارد mutation نشدیم، چون عملیات create/edit/delete نیازمند فرم، validation، project dropdown، service/contract dropdown و payload دقیق است و باید در Branch جدا انجام شود.

---

## 2. API اصلی Branch

### Tasks List

```text
GET /api/v1/tasks/

Query params:

user={id}
page={page}
range={range}

Response مورد انتظار:

{
  "data": [
    {
      "id": 259354,
      "status": "pending",
      "title": "[IDEAL-901]: رفع مشکل موقعیت اسکرول",
      "project_id": 30,
      "date": "1405-02-08",
      "duration": 30
    }
  ],
  "meta": {
    "page": 1,
    "page_size": 10,
    "total": 100
  }
}

این ساختار از قبل در contract پروژه برای Tasks مشخص شده بود و مدل TaskListResponse هم بر اساس همین data + meta ساخته شد.

3. فایل‌های اصلی درگیر
src/app/features/tasks/services/tasks.service.ts

در این Branch سرویس اختصاصی Tasks ساخته شد.

متد اصلی:

getTasks(userId: number, page: number, range: string)

وظیفه این متد:

اگر environment.useMockData === true باشد، داده mock برگرداند.
اگر useMockData === false باشد، درخواست واقعی HTTP به /tasks/ بفرستد.
query params شامل user, page, range را با HttpParams بسازد.

دلیل اینکه TasksService داخل features/tasks/services ساخته شد:

چون فعلاً فقط feature تسک‌ها از آن استفاده می‌کند.

پس آن را زودتر از موعد داخل shared نبردیم. این تصمیم باعث می‌شود معماری feature-driven تمیزتر بماند.

src/app/features/tasks/tasks.ts

در این فایل منطق صفحه Tasks از حالت static خارج شد.

موارد اضافه‌شده:

Inject کردن TasksService
استفاده از LayoutService برای تشخیص اینکه کاربر داخل صفحه Tasks است
ساخت tasksState با ApiState<TaskListResponse>
ساخت currentPage با signal
ساخت activeRange
ساخت activeStatus
اضافه کردن ngOnInit
اضافه کردن loadTasks
اضافه کردن getterهای محاسباتی
اضافه کردن helperهای status
اضافه کردن pagination methods
اضافه کردن filter methods
اضافه کردن formatMinutes با فرمت HH:mm

الگوی اصلی استفاده‌شده:

Task model → TasksService → ApiState<TaskListResponse> → loadTasks() → tasks.html
src/app/shared/models/task.model.ts

مدل‌های اصلی Tasks استفاده شدند:

TaskItem
TaskListMeta
TaskListResponse
TaskMutationPayload

مدل TaskListResponse شامل دو بخش مهم است:

data: TaskItem[];
meta: TaskListMeta;

نکته مهم آموزشی این بود که برای listها حتی وقتی data خالی است، باز هم meta مهم است؛ چون pagination و total count از آن می‌آید.

src/app/features/tasks/tasks.html

در این فایل UI صفحه Tasks به state واقعی وصل شد.

موارد انجام‌شده:

مقدار کارت‌های summary از حالت عدد ثابت خارج شد.
totalTasks از meta.total خوانده شد.
totalDuration از مجموع durationهای صفحه فعلی ساخته شد.
pendingCount از تسک‌های pending صفحه فعلی حساب شد.
rejectedCount از تسک‌های rejected صفحه فعلی حساب شد.
ردیف‌های static قدیمی حذف شدند.
لیست با @for از tasks رندر شد.
loading skeleton اضافه شد.
error state با دکمه retry اضافه شد.
empty state برای زمانی که لیست خالی است اضافه شد.
وضعیت taskها به rail و متن مناسب map شد.
SVGهای تکراری داخل task rows حذف شدند و UI سبک‌تر شد.
pagination UI اضافه شد.
quick filters از حالت تزئینی خارج شدند.
4. State Management

برای این Branch هم مثل Dashboard از ApiState<T> استفاده شد:

ApiState<TaskListResponse>

Stateهای اصلی:

loading
success with data
success but empty
error

نمونه ذهنی:

{
  data: null,
  loading: true,
  error: null
}

برای loading.

{
  data: response,
  loading: false,
  error: null
}

برای success.

{
  data: null,
  loading: false,
  error: 'خطا در دریافت لیست وظایف'
}

برای error.

5. Empty State در لیست Tasks

در Dashboard chartها، وقتی response خالی بود، می‌توانستیم data: null بگذاریم. اما در Tasks این کار را نکردیم.

دلیل:

در list response، meta هنوز مهم است.

مثلاً این response خطا نیست:

{
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 10,
    "total": 0
  }
}

این یعنی درخواست موفق بوده، ولی در آن بازه زمانی task وجود ندارد.

پس در HTML این شرط اضافه شد:

اگر tasks.length === 0 → Empty State نمایش بده

نکته آموزشی:

Empty با Error فرق دارد.

[] یعنی API موفق جواب داده ولی داده‌ای برای نمایش وجود ندارد.

6. Dynamic Task Rows

قبل از این Branch، task rowها کاملاً static بودند و اطلاعاتی مثل عنوان، پروژه، زمان، وضعیت و آیدی task داخل HTML نوشته شده بود.

در این Branch:

Static task rows → Dynamic task rows

هر task از response خوانده می‌شود و این فیلدها نمایش داده می‌شوند:

Field	UI Usage
id	شناسه task در row
title	عنوان task
project_id	fallback برای نام پروژه
project_title	اگر backend در آینده بدهد، عنوان پروژه
status	rail color و status text
date	تاریخ task
duration	مدت زمان task

برای project_title fallback گذاشته شد:

اگر project_title نبود → پروژه #project_id

چون در response فعلی backend فقط project_id قطعی است و project_title ممکن است بعداً اضافه شود.

7. Status Mapping

Backend status خام می‌دهد، مثل:

pending
approved
rejected
draft
edited

ولی UI به متن و رنگ نیاز دارد.

پس چند helper ساخته شد:

getStatusLabel(status)
getStatusRailClass(status)
getStatusTextClass(status)

نمونه mapping:

Backend Status	Label	UI Meaning
approved	تایید شده	done
pending	در انتظار تایید	review
rejected	نیازمند اصلاح	review/red
draft	پیش‌نویس	progress
edited	ویرایش شده	progress

نکته آموزشی:

Template نباید پر از switch و if شود.

منطق تبدیل status به label/class داخل component ماند و HTML فقط خروجی آماده را نمایش داد.

8. Duration Formatting

ابتدا duration با متن فارسی مثل این نمایش داده شد:

1 ساعت و 15 دقیقه

ولی برای rowهای task، این فرمت UI را شلوغ می‌کرد.

پس formatMinutes به فرمت تایمری تغییر کرد:

HH:mm

مثال:

30  → 00:30
75  → 01:15
120 → 02:00

دلیل این تصمیم:

در task list، duration باید سریع، کوتاه و ستونی خوانده شود.

فرمت HH:mm برای لیست بهتر از جمله فارسی است.

9. Summary Cards

چهار کارت بالای صفحه Tasks از حالت static خارج شدند.

وظایف امروز / تعداد وظایف

از:

عدد ثابت 7

به:

totalTasks

تغییر کرد.

نکته: فعلاً این عدد از meta.total می‌آید و وابسته به range فعال است.

زمان ثبت‌شده

از:

05:48

به:

formatMinutes(totalDuration)

تغییر کرد.

نکته مهم:

totalDuration فعلاً مجموع taskهای صفحه فعلی است، نه کل دیتابیس.

چون API فعلی summary جدا برای کل range نمی‌دهد.

در انتظار بررسی

از عدد ثابت به:

pendingCount

تغییر کرد.

نیازمند اصلاح

از عدد ثابت به:

rejectedCount

تغییر کرد.

10. Pagination

چون response API شامل meta است، pagination روی meta.page, meta.page_size, meta.total ساخته شد.

Getterهای اضافه‌شده:

pageSize
totalPages
hasPreviousPage
hasNextPage

Methods:

goToPreviousPage()
goToNextPage()

محاسبه تعداد صفحه‌ها:

Math.ceil(totalTasks / pageSize)

نکته آموزشی مهم:

تعداد صفحات را از tasks.length حساب نمی‌کنیم.

چون tasks.length فقط تعداد آیتم‌های صفحه فعلی است، نه کل تعداد آیتم‌های backend.

مثلاً اگر صفحه فعلی ۱۰ آیتم داشته باشد، ولی کل taskها ۱۰۰ تا باشند، tasks.length فقط ۱۰ است؛ اما meta.total عدد ۱۰۰ را نشان می‌دهد.

11. Quick Filters

Quick Filters از حالت دکمه‌های تزئینی خارج شدند.

فیلترهای اضافه‌شده:

همه
امروز
هفته جاری
در انتظار تایید
نیاز به اصلاح
Range Filters

این فیلترها به API فرستاده شدند:

today
week_till_today
month_till_today

چون API طبق contract پارامتر range دارد.

Status Filters

این فیلترها فعلاً client-side هستند:

pending
rejected

دلیل:

در contract فعلی GET /tasks پارامتر status رسمی نداریم.

پس نباید چیزی مثل status=pending را بدون هماهنگی با backend به API بفرستیم.

تصمیم ثبت‌شده برای گزارش:

Range filters are wired through API query params.
Status filters are applied client-side on the loaded page until backend status filtering is confirmed.
12. Mock Mode

مثل Dashboard، برای Tasks هم Mock Mode رعایت شد.

اگر:

environment.useMockData === true

باشد، TasksService داده mock برمی‌گرداند.

اگر:

environment.useMockData === false

باشد، درخواست واقعی به API ارسال می‌شود.

مزیت این کار:

توسعه UI بدون نیاز دائم به backend
تست loading
تست empty state
تست pagination
تست فیلترها
آماده بودن برای اتصال واقعی
```

## 📝 گزارش پایان Branch 009

**Branch:** `feature/009-tasks-mutation-and-smart-form`  
**موضوع:** پیاده‌سازی Create / Edit / Delete تسک، ساخت Modal فرم، اتصال پروژه‌ها، سرویس‌ها و قراردادها  
**وضعیت:** Completed with backend/mock persistence dependency  
**تاریخ:** ۱۰ می ۲۰۲۶

---

## 1. هدف Branch

هدف این Branch این بود که صفحه Tasks فقط یک صفحه read-only نباشد و بتواند عملیات اصلی روی task را انجام دهد:

- ثبت تسک جدید
- ویرایش تسک
- حذف تسک
- ساخت فرم هوشمند برای task
- اتصال dropdown پروژه‌ها
- اتصال dropdown سرویس‌ها و قراردادهای پروژه
- ساخت payload مناسب API
- مدیریت loading/error برای عملیات فرم
- جدا کردن read state از mutation state

در Branch قبلی لیست تسک‌ها، pagination و filterها آماده شده بودند. در این Branch تمرکز روی mutation بود.

---

## 2. مدل‌های اصلی مورد استفاده

### Task Model

مدل `TaskMutationPayload` مشخص می‌کند برای ثبت یا ویرایش task چه فیلدهایی باید به API فرستاده شود: `title`, `project`, `project_service`, `project_contract`, `location`, `date`, `start_time`, `end_time`, `duration`, و `description` اختیاری. همچنین `TaskListResponse` شامل `data` و `meta` است و برای لیست و pagination استفاده می‌شود. :contentReference[oaicite:0]{index=0}

### Project Model

برای dropdownهای فرم، مدل‌های `Project`, `ProjectService`, `ProjectContract` و `ProjectDetailsResponse` استفاده شدند. `ProjectDetailsResponse` شامل `services` و `contracts` است و بعد از انتخاب پروژه، dropdownهای دوم و سوم را پر می‌کند. :contentReference[oaicite:1]{index=1}

---

## 3. فایل‌های اصلی درگیر

### `src/app/features/tasks/services/tasks.service.ts`

در این Branch، `TasksService` کامل‌تر شد.

متدهای اضافه‌شده یا تکمیل‌شده:

```ts
getProjects();
getProjectDetails(projectId);
createTask(payload);
updateTask(taskId, payload);
deleteTask(taskId);
```

کته مهم:

deleteTask در نهایت به Observable<void> تبدیل شد، چون از response حذف استفاده‌ای در UI نداریم و فقط موفق یا ناموفق بودن عملیات مهم است. این باعث شد خطای TypeScript روی subscribe() حل شود.
src/app/features/tasks/tasks.ts

در این فایل منطق اصلی فرم و عملیات task اضافه شد.

موارد انجام‌شده:

اضافه کردن ReactiveFormsModule
اضافه کردن FormBuilder
ساخت taskForm
ساخت mutationState
ساخت isTaskModalOpen
ساخت editingTask
ساخت projectsState
ساخت projectDetailsState
ساخت deletingTaskId
ساخت deleteError
ساخت متدهای create/edit/delete
ساخت متدهای loadProjects و loadProjectDetails
ساخت mapper برای تبدیل فرم به payload API
محاسبه duration از روی start/end time

قبل از این Branch، TasksComponent فقط لیست را با tasksState, pagination و filter مدیریت می‌کرد. ساختار قبلی شامل tasksState, currentPage, activeRange, activeStatus, loadTasks, getterهای summary و filterها بود.

src/app/features/tasks/tasks.html

در این فایل UI مربوط به فرم اضافه شد.

موارد انجام‌شده:

اضافه کردن دکمه ثبت وظیفه جدید داخل خود صفحه Tasks
ساخت modal برای create/edit
اتصال modal به taskForm
اتصال inputها با formControlName
اتصال submit با (ngSubmit)="submitTaskForm()"
نمایش error مربوط به mutationState
داینامیک کردن dropdown پروژه‌ها
داینامیک کردن dropdown سرویس‌ها و قراردادها
اضافه کردن دکمه ویرایش برای هر task
اضافه کردن دکمه حذف برای هر task
نمایش حالت حذف... برای row در حال حذف 4. Stateهای مهم این Branch
taskForm

این فرم Reactive اصلی ماست.

کارهایش:

نگهداری مقدار inputها
بررسی required بودن فیلدها
بررسی valid / invalid بودن فرم
آماده کردن مقدار خام فرم با getRawValue()

اما taskForm مستقیماً به API ارسال نمی‌شود. اول باید با buildTaskPayload() تبدیل شود.

mutationState

این state برای وضعیت submit فرم است.

یعنی برای create/update:

آیا فرم در حال ذخیره است؟
آیا submit خطا داده؟
آیا دکمه submit باید disabled شود؟
چه پیام خطایی داخل modal نمایش داده شود؟

نمونه حالت loading:

{
data: null,
loading: true,
error: null
}

نمونه حالت error:

{
data: null,
loading: false,
error: 'خطا در ثبت وظیفه'
}

نکته مهم:

mutationState برای فرم است، نه برای لیست و نه برای حذف row.

tasksState

این state برای گرفتن لیست taskهاست.

یعنی وضعیت این API را مدیریت می‌کند:

GET /api/v1/tasks/

حالت‌ها:

loading → نمایش skeleton
success → نمایش task rows
error → نمایش پیام خطا و retry
empty → نمایش پیام نبودن task

فرق اصلی:

tasksState = وضعیت خواندن لیست
mutationState = وضعیت ثبت/ویرایش فرم
projectsState

برای گرفتن لیست پروژه‌هاست:

GET /api/v1/projects/get_all_projects/

این state dropdown اول فرم را پر می‌کند.

projectDetailsState

برای گرفتن سرویس‌ها و قراردادهای پروژه انتخاب‌شده است:

GET /api/v1/projects/project_details/?project=30

وقتی کاربر پروژه را عوض می‌کند، این state دوباره load می‌شود.

deletingTaskId

برای حذف یک task خاص استفاده شد.

چرا جدا از mutationState؟

چون حذف مربوط به یک row است. اگر task شماره 259354 در حال حذف است، فقط دکمه همان row باید بشود حذف....

5. Reactive Form

فرم task شامل این فیلدها شد:

title
project
project_service
project_contract
location
date
start_time
end_time
description

فیلد duration را از کاربر نگرفتیم.

دلیل:

کاربر ساعت شروع و پایان را وارد می‌کند؛ پس duration باید توسط فرانت حساب شود:

start_time = 09:00
end_time = 09:30
duration = 30

این هم خطای انسانی را کم می‌کند، هم فرم را ساده‌تر می‌کند.

6. Payload Mapping

یکی از مهم‌ترین بخش‌های این Branch، تفاوت بین form value و API payload بود.

فرم این را دارد:

date: 1405-02-08
start_time: 09:00
end_time: 09:30

ولی API این را می‌خواهد:

start_time: 1405-02-08 09:00:00
end_time: 1405-02-08 09:30:00
duration: 30

برای همین متد buildTaskPayload() ساخته شد.

نکته آموزشی:

نباید همیشه taskForm.getRawValue() را مستقیم به API بفرستیم.
گاهی باید داده فرم را به shape مورد نیاز API تبدیل کنیم. 7. Create Flow

جریان ثبت task جدید:

openCreateTaskModal()
→ فرم reset می‌شود
→ editingTask = null
→ projectDetailsState پاک می‌شود
→ modal باز می‌شود
→ کاربر فرم را پر می‌کند
→ submitTaskForm()
→ validation
→ buildTaskPayload()
→ createTask(payload)
→ close modal
→ loadTasks()

نکته:

بعد از create، ما optimistic update انجام ندادیم. یعنی task جدید را دستی به آرایه local اضافه نکردیم. روش انتخابی ما refetch after mutation بود.

8. Edit Flow

جریان ویرایش:

openEditTaskModal(task)
→ editingTask = task
→ فرم با اطلاعات task پر می‌شود
→ start_time/end_time از datetime جدا می‌شود
→ projectDetails همان project load می‌شود
→ modal باز می‌شود
→ submitTaskForm()
→ updateTask(task.id, payload)
→ close modal
→ loadTasks()

چالش مهم:

در response فعلی task list، مقدارهای project_service و project_contract وجود ندارند. بنابراین هنگام edit، خود dropdownها load می‌شوند ولی مقدار انتخاب‌شده آن‌ها نمی‌تواند کامل prefill شود، مگر backend این فیلدها را هم در response لیست یا task detail برگرداند.

9. Delete Flow

جریان حذف:

کاربر روی حذف می‌زند
→ window.confirm باز می‌شود
→ اگر تایید کرد، deletingTaskId = task.id
→ deleteTask(task.id)
→ بعد از موفقیت deletingTaskId = null
→ loadTasks()

برای خطا:

deleteError = 'خطا در حذف وظیفه'

نکته آموزشی:

برای delete از mutationState استفاده نکردیم چون delete مربوط به یک row خاص است، نه فرم modal.

10. Project / Service / Contract Dropdown

فرم task سه dropdown وابسته دارد:

project
project_service
project_contract

جریان کار:

loadProjects()
→ dropdown پروژه‌ها پر می‌شود
→ کاربر project انتخاب می‌کند
→ project_service و project_contract صفر می‌شوند
→ loadProjectDetails(projectId)
→ services/contracts همان پروژه لود می‌شوند

این الگو اسمش Cascading Dropdown است.

نکته مهم:

وقتی project عوض می‌شود، باید service و contract قبلی reset شوند، چون ممکن است متعلق به پروژه قبلی باشند.

11. API / Mock / Contract / CORS

در طول Branch 009، تست عملی API هم انجام شد.

چیزهایی که یاد گرفته شد:

Contract endpoint = برای documentation/spec
Mock API endpoint = route واقعی دارد و response مستقیم می‌دهد
Real API = backend واقعی با persistence

مشکل CORS هم تجربه شد.

راه‌ها:

راه درست: CORS سمت سرور فعال شود
راه موقت dev: Angular proxy
راه شخصی موقت: افزونه مرورگر

همچنین فهمیدیم اگر endpoint فقط یک JSON ثابت return کند، create/update/delete از نظر request flow انجام می‌شوند، ولی در GET بعدی تغییر دیده نمی‌شود؛ چون سرور state واقعی ذخیره نکرده است.

12. چرا بعد از create/update/delete دوباره loadTasks() می‌زنیم؟

چون منبع اصلی داده backend است.

جریان استاندارد:

POST /tasks
backend ذخیره می‌کند
GET /tasks
لیست جدید از backend گرفته می‌شود

ما فقط local array را دستکاری نکردیم، چون backend ممکن است این فیلدها را خودش تعیین کند:

id
status
project_title
date formatting
server-side validation

این روش اسمش:

refetch after mutation

است.

13. چرا الان task جدید در لیست دیده نمی‌شود؟

چون API فعلی mock/static است.

یعنی:

POST موفق می‌شود
ولی GET بعدی همان JSON ثابت قبلی را برمی‌گرداند

این مشکل پیاده‌سازی فرم نیست. برای دیده شدن تغییر، mock server یا backend باید بعد از POST/PUT/DELETE، response لیست را هم واقعاً تغییر دهد.

14. کارهایی که انجام شد

- [x] Extend TasksService with createTask.
- [x] Extend TasksService with updateTask.
- [x] Extend TasksService with deleteTask.
- [x] Extend TasksService with getProjects.
- [x] Extend TasksService with getProjectDetails.
- [x] Add Reactive Form to TasksComponent.
- [x] Add task modal.
- [x] Connect modal to taskForm.
- [x] Add create mode.
- [x] Add edit mode.
- [x] Build TaskMutationPayload from form.
- [x] Calculate duration from start_time/end_time.
- [x] Validate end_time after start_time.
- [x] Add mutation loading/error state.
- [x] Connect submit to create/update.
- [x] Refetch task list after mutation.
- [x] Load projects for project dropdown.
- [x] Load project details for service/contract dropdowns.
- [x] Reset service/contract when project changes.
- [x] Add delete flow.
- [x] Add row-level deleting state.
- [x] Add delete error state.
- [x] Test CORS/proxy/contract API behavior.

15. Remaining / Deferred

مواردی که عمداً برای Branchهای بعدی ماندند:

- [ ] Real backend persistence for create/update/delete.
- [ ] Task detail endpoint for full edit prefill.
- [ ] Prefill project_service and project_contract in edit mode.
- [ ] Replace window.confirm with custom confirm modal.
- [ ] Add field-level validation messages under inputs.
- [ ] Add success toast after create/update/delete.
- [ ] Add real AI task generation.
- [ ] Add timer/presence integration.
- [ ] Remove temporary contract API bridge before final merge if still present.
- [ ] Finalize CORS with backend/mock server instead of relying on browser extension.

16. Technical Notes

قبل از commit نهایی، این‌ها را چک کن:

اگر هنوز useContractApi برای تست روشن است، تصمیم بگیر:
یا temporary نگه دار و commit نکن
یا قبل از commit برگردان به حالت mock/real استاندارد.

اگر فقط برای تست با لید بود:
Contract bridge و تغییرات موقت CORS/proxy را commit نکن.

پیشنهاد برای حالت امن commit:

useMockData: true
useContractApi: false

یا اگر mock API نهایی آماده شد:

useMockData: false
useContractApi: false
apiBaseUrl: 'http://192.168.130.44:1234/api/v1' 17. نکته‌های آموزشی مهم

1. Read و Mutation فرق دارند

Read:

GET /tasks
GET /projects
GET /project_details

Mutation:

POST /tasks
PUT /tasks/{id}
DELETE /tasks/{id}

برای همین state جدا لازم دارند.

2. فرم با payload فرق دارد

فرم برای UI است.
Payload برای API است.

پس همیشه این سؤال را بپرس:

آیا شکل داده فرم دقیقاً همان چیزی است که API می‌خواهد؟

اگر نه، mapper لازم داری.

3. State را بر اساس مسئولیت جدا کن

در این Branch stateها را بر اساس مسئولیت جدا کردیم:

tasksState
mutationState
projectsState
projectDetailsState
deletingTaskId
deleteError

این باعث شد هر بخش UI مستقل‌تر و قابل فهم‌تر باشد.

4. Refetch after mutation ساده‌تر و امن‌تر است

بعد از create/update/delete، دوباره لیست را گرفتن، با backend هماهنگ‌تر است.

Optimistic update سریع‌تر است، ولی پیچیده‌تر و پرریسک‌تر است.

5. CORS مشکل کد Angular نیست

اگر request از curl جواب می‌دهد ولی مرورگر بلاک می‌کند، احتمالاً CORS است.

CORS یعنی مرورگر اجازه نمی‌دهد فرانت از یک origin دیگر response را بخواند.

18. وضعیت نهایی Branch

در پایان Branch 009:

صفحه Tasks از read-only خارج شد.
فرم ثبت/ویرایش task آماده شد.
Create/Edit/Delete flow پیاده شد.
Dropdownهای پروژه، سرویس و قرارداد داینامیک شدند.
فرم payload مناسب API می‌سازد.
حذف row-level state دارد.
Refresh بعد از mutation انجام می‌شود.

تنها محدودیت فعلی این است که mock API فعلی state واقعی ذخیره نمی‌کند؛ بنابراین تغییرات create/update/delete در GET بعدی دیده نمی‌شوند، مگر backend/mock server persistence داشته باشد.
