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

#### 🎯 قدم بعدی

- **Branch بعدی:** `feature/008-tasks-read-and-filter-integration`
- **هدف:** اتصال لیست تسک‌ها، pagination، filterها و summary cardهای صفحه Tasks.

////
////
////
////
////
////
باشه. این متن رو کامل کپی کن و فردا تو چت جدید اول کار بفرست تا دقیقاً از همین نقطه ادامه بدیم.

```md
سلام. این خلاصه کامل پروژه WTT و وضعیت فعلی منه. لطفاً از همین نقطه ادامه بده و مثل قبل قدم‌به‌قدم، آموزشی، با توضیح قبل و بعد از انجام، و با سؤال‌های آموزشی جلو برو.

## نقش من

من کارآموز شرکت برنامه‌نویسی هستم و دارم پروژه WTT را ریدیزاین می‌کنم. می‌خوام اصولی یاد بگیرم، نه فقط کد آماده بگیرم. لطفاً بیشتر راهنمایی کن تا خودم انجام بدم، ولی وقتی لازم شد اسکلت کد درست بده.

## هدف محصول WTT

WTT جدید قرار نیست فقط Timesheet باشد. طبق بیزینس مدل، هدف اینه که تبدیل بشه به یک سیستم هوشمند بین Developer، GitLab، Jira، Team Lead، HR و مدیر شرکت.

هدف بلندمدت:

- Smart Worklog
- Human Confirmation
- Evidence Pack
- Confidence Score
- Approval Flow
- HR Payroll Support
- Engineering Intelligence
- AI Report

ولی فعلاً MVP فرانت اینه:

- دو صفحه فعلی Dashboard و Tasks از حالت mock خارج شوند.
- API contract آماده شود.
- shape JSONها به لید داده شود تا endpoint یا response مناسب بدهد.
- فعلاً فقط role کاربر developer است.
- فرانت redesigned فعلاً login واقعی ندارد.
- token و userId فعلاً temporary هستند.

## وضعیت پروژه

پروژه Angular است ولی طبق package-lock نسخه واقعی فعلی Angular 21.2.x است، نه Angular 22.
Tailwind v4 استفاده شده.
date-fns-jalali نصب شده.
Chart library هنوز نصب نشده.
فعلاً نباید ECharts/Chart.js نصب کنیم تا اول data flow درست شود.

## مسیر فعلی پروژه

.angular
.vscode
node_modules
src
src/app
src/app/core
src/app/core/guards
src/app/core/interceptors
src/app/core/interceptors/auth.interceptor.ts
src/app/core/interceptors/error.interceptor.ts
src/app/core/layout
src/app/core/layout/header
src/app/core/layout/header/header.html
src/app/core/layout/header/header.scss
src/app/core/layout/header/header.ts
src/app/core/layout/left-sidebar
src/app/core/layout/left-sidebar/left-sidebar.html
src/app/core/layout/left-sidebar/left-sidebar.scss
src/app/core/layout/left-sidebar/left-sidebar.ts
src/app/core/layout/sidebar
src/app/core/layout/sidebar/sidebar.html
src/app/core/layout/sidebar/sidebar.scss
src/app/core/layout/sidebar/sidebar.ts
src/app/core/services
src/app/core/services/auth
src/app/core/services/auth/auth.service.ts
src/app/core/services/layout
src/app/core/services/layout/layout.service.ts
src/app/core/services/theme
src/app/core/services/theme/theme.ts
src/app/features
src/app/features/auth
src/app/features/dashboard
src/app/features/dashboard/dashboard.html
src/app/features/dashboard/dashboard.scss
src/app/features/dashboard/dashboard.ts
src/app/features/dashboard/services/dashboard.service.ts
src/app/features/presence
src/app/features/tasks
src/app/features/tasks/tasks.html
src/app/features/tasks/tasks.scss
src/app/features/tasks/tasks.ts
src/app/shared
src/app/shared/components
src/app/shared/directives
src/app/shared/models
src/app/shared/models/api-state.model.ts
src/app/shared/models/dashboard.model.ts
src/app/shared/models/project.model.ts
src/app/shared/models/task.model.ts
src/app/shared/models/user.model.ts
src/app/shared/pipes
src/app/shared/utils
src/app/state
src/app/app.config.ts
src/app/app.html
src/app/app.routes.ts
src/app/app.scss
src/app/app.spec.ts
src/app/app.ts
src/assets/contracts
src/assets/contracts/dashboard.contract.json
src/assets/contracts/tasks.contract.json
src/environments
src/environments/environment.development.ts
src/environments/environment.ts
src/index.html
src/main.ts
src/styles.scss
README.md
REPORT.md
TODO.md
package.json
package-lock.json

## Branchهای انجام‌شده

feature/001-workspace-and-core
feature/002-auth-and-security
feature/003-ui-layout-and-theme
feature/004-ui-dashboard-widgets
feature/005-ui-tasks-and-presence
feature/006-api-contracts-and-data-foundation

## Branch فعلی

feature/007-dashboard-api-integration

هدف branch فعلی:
داشبورد را از حالت static خارج کنیم و اول فقط KPI cards را به API واقعی وصل کنیم.
فعلاً chartها و announcementها و recent activities هنوز mock می‌مانند.

## کارهایی که تا الان در branch 006 انجام شده

- environment ساخته شده:
  - src/environments/environment.ts
  - src/environments/environment.development.ts
- shared models ساخته شده:
  - api-state.model.ts
  - dashboard.model.ts
  - project.model.ts
  - task.model.ts
  - user.model.ts
- contracts ساخته شده:
  - src/assets/contracts/dashboard.contract.json
  - src/assets/contracts/tasks.contract.json
- route صفحه Tasks از `Tasks` به `tasks` اصلاح شده.
- TODO و REPORT آپدیت شده.
- گزارش branch 006 ثبت شده.

## مدل‌های مهم

### ApiState

export interface ApiState<T> {
data: T | null;
loading: boolean;
error: string | null;
}

فلسفه ApiState:
برای جلوگیری از تکرار loading/error/data در همه جا generic ساختیم.
مثلاً:
ApiState<DashboardStats>
ApiState<TaskListResponse>
ApiState<Project[]>

### User model پیشنهادی درست

export type UserRole = 'developer' | string;

export interface UserProfile {
id: number;
username: string;
role: UserRole;
first_name: string;
last_name: string;
workflow?: UserWorkflow;
}

export interface UserWorkflow {
manager: UserManager;
}

export interface UserManager {
id: number;
first_name: string;
}

نکته:
stats داخل User نباید باشد چون از endpoint جداگانه Dashboard می‌آید.

### Dashboard model پیشنهادی

export interface DashboardStatsResponse {
data: DashboardStats;
}

export interface DashboardStats {
first_name: string;
last_name: string;
expected_time: number;
total_work: number;
overtime_working: number;
this_year_vacations: number;
}

export interface DashboardPieItem {
project: string;
value: number;
}

export interface DashboardLinePoint {
date: string;
presence: number;
rejected: number;
pending: number;
teleworking: number;
incompany_working: number;
}

export interface MessageCountResponse {
private: number;
public: number;
regulations: number;
}

### Project model پیشنهادی

export interface Project {
id: number;
title: string;
description?: string;
}

export interface ProjectService {
id: number;
service: string;
}

export interface ProjectContract {
id: number;
contract: string;
}

export interface ProjectDetailsResponse {
services: ProjectService[];
contracts: ProjectContract[];
}

### Task model پیشنهادی

export type TaskStatus =
| 'pending'
| 'approved'
| 'rejected'
| 'draft'
| 'edited'
| string;

export type WorkLocation =
| 'teleworking'
| 'incompany_working'
| string;

export interface TaskItem {
id: number;
status: TaskStatus;
title: string;
project_id: number;
project_title?: string;
date: string;
duration: number;
location?: WorkLocation;
start_time?: string;
end_time?: string;
}

export interface TaskListMeta {
page: number;
page_size: number;
total: number;
}

export interface TaskListResponse {
data: TaskItem[];
meta: TaskListMeta;
}

export interface TaskMutationPayload {
title: string;
project: number;
project_service: number;
project_contract: number;
location: WorkLocation;
date: string;
start_time: string;
end_time: string;
duration: number;
description?: string;
}

## وضعیت dashboard.html

چهار کارت بالا اصلاح شده‌اند و از statsState استفاده می‌کنند:

- زمان مورد انتظار → expected_time
- کل کارکرد این ماه → total_work
- اضافه‌کاری → overtime_working
- مرخصی امسال → this_year_vacations

برای سه مقدار اول از formatMinutes استفاده می‌شود.
برای this_year_vacations از formatMinutes استفاده نمی‌شود چون دقیقه نیست.

## وضعیت dashboard.ts

در branch 007 این موارد اضافه شده:

- DashboardService inject شده.
- statsState ساخته شده.
- ngOnInit اضافه شده.
- loadStats اضافه شده.
- formatMinutes وجود دارد.
- userId فعلاً از environment.temporaryUserId خوانده می‌شود.
- range فعلاً month_till_today است.

الگوی مورد استفاده:
model → service → state → load method → template binding

## DashboardService

در مسیر زیر ساخته شده:
src/app/features/dashboard/services/dashboard.service.ts

چرا داخل feature است نه shared؟
چون فعلاً فقط برای Dashboard استفاده می‌شود. نباید زودتر از موعد چیزی را global/shared کنیم.

متدهای مورد نیاز:

- getStats(userId, range)
- getPieChart(userId, range)
- getLineChart(userId, range)
- getUnreadMessages()

فعلاً فقط getStats عملیاتی شده یا باید اولویت اول باشد.

## APIهای فعلی طبق API Reference

### User Profile

GET /api/v1/profile/
Query:
user={id}, range, page

Response sample:
{
"id": 273,
"username": "mehdikarimifa",
"role": "developer",
"first_name": "مهدی",
"last_name": "کریمی",
"workflow": {
"manager": {
"id": 56,
"first_name": "حمیدرضا"
}
}
}

### Dashboard Stats

GET /api/v1/users/a_user_details/
Query:
user={id}, range

Response sample:
{
"data": {
"first_name": "حمیدرضا",
"last_name": "شاهمرادی",
"expected_time": 6336,
"total_work": 6824,
"overtime_working": 488,
"this_year_vacations": 2
}
}

### Pie Chart

GET /api/v1/dashboard/pie_chart/
Query:
user={id}, range

Response sample:
[
{ "project": "NeoBRK", "value": 2625 },
{ "project": "غیر مفید", "value": 1468 }
]

### Line Chart

GET /api/v1/dashboard/line_chart/
Query:
user={id}, range

Response sample:
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

### Messages

GET /api/v1/news/get_message_data/

Expected response:
{
"private": 0,
"public": 82,
"regulations": 0
}

### Tasks List

GET /api/v1/tasks/
Query:
user={id}, page, range

Current documented response:
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

### Task Mutation

POST /api/v1/tasks/
PUT /api/v1/tasks/{id}/
DELETE /api/v1/tasks/{id}/

Payload:
{
"title": "string",
"project": 30,
"project_service": 12,
"project_contract": 5,
"location": "teleworking",
"date": "1405-02-08",
"start_time": "1405-02-08 09:00:00",
"end_time": "1405-02-08 09:30:00",
"duration": 30,
"description": "optional string"
}

### Projects

GET /api/v1/projects/get_all_projects/

Response:
[
{
"id": 30,
"title": "NeoBRK",
"description": "NeoBRK"
}
]

### Project Details

GET /api/v1/projects/project_details/
Expected:
{
"services": [
{
"id": 1,
"service": "Frontend Development"
}
],
"contracts": [
{
"id": 1,
"contract": "Main Contract"
}
]
}

### Presence

POST /api/v1/presence/
Payload:
{
"start_time": "YYYY-MM-DD HH:MM:SS"
}

PUT /api/v1/presence/{id}/
Payload:
{
"start_time": "YYYY-MM-DD HH:MM:SS",
"end_time": "YYYY-MM-DD HH:MM:SS"
}

## JSON shapeهایی که باید برای لید بفرستم

### dashboard.contract.json

{
"stats": {
"endpoint": "/api/v1/users/a_user_details/",
"method": "GET",
"query": {
"user": 273,
"range": "month_till_today"
},
"response": {
"data": {
"first_name": "مهدی",
"last_name": "کریمی",
"expected_time": 6336,
"total_work": 6824,
"overtime_working": 488,
"this_year_vacations": 2
}
},
"ui_usage": {
"expected_time": "Dashboard KPI - زمان مورد انتظار",
"total_work": "Dashboard KPI - کل کارکرد این ماه",
"overtime_working": "Dashboard KPI - اضافه‌کاری",
"this_year_vacations": "Dashboard KPI - مرخصی امسال"
}
},
"pie_chart": {
"endpoint": "/api/v1/dashboard/pie_chart/",
"method": "GET",
"query": {
"user": 273,
"range": "month_till_today"
},
"response": [
{
"project": "NeoBRK",
"value": 2625
},
{
"project": "غیر مفید",
"value": 1468
}
],
"ui_usage": {
"project": "Project label",
"value": "Minutes spent on project"
}
},
"line_chart": {
"endpoint": "/api/v1/dashboard/line_chart/",
"method": "GET",
"query": {
"user": 273,
"range": "month_till_today"
},
"response": [
{
"date": "1405-01-26",
"presence": 549,
"rejected": 0,
"pending": 0,
"teleworking": 0,
"incompany_working": 435
}
],
"ui_usage": {
"date": "X axis date",
"presence": "Total presence minutes",
"teleworking": "Remote work minutes",
"incompany_working": "Office work minutes",
"pending": "Pending worklog minutes/count depending on backend definition",
"rejected": "Rejected worklog minutes/count depending on backend definition"
}
},
"messages": {
"endpoint": "/api/v1/news/get_message_data/",
"method": "GET",
"response": {
"private": 0,
"public": 82,
"regulations": 0
},
"ui_usage": {
"private": "Personal announcements count",
"public": "Public announcements count",
"regulations": "Regulation announcements count"
}
}
}

### tasks.contract.json

{
"tasks_list": {
"endpoint": "/api/v1/tasks/",
"method": "GET",
"query": {
"user": 273,
"page": 1,
"range": "month_till_today"
},
"current_documented_response": {
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
},
"requested_ui_response": {
"data": [
{
"id": 259354,
"status": "pending",
"title": "[IDEAL-901]: رفع مشکل موقعیت اسکرول",
"project_id": 30,
"project_title": "NeoBRK",
"date": "1405-02-08",
"duration": 30,
"location": "teleworking",
"start_time": "1405-02-08 09:00:00",
"end_time": "1405-02-08 09:30:00"
}
],
"meta": {
"page": 1,
"page_size": 10,
"total": 100
}
},
"question_for_backend_lead": "Can GET /api/v1/tasks/ include project_title, location, start_time and end_time for list UI? If not, should the frontend fetch task details separately?"
},
"task_create": {
"endpoint": "/api/v1/tasks/",
"method": "POST",
"payload": {
"title": "[IDEAL-901]: رفع مشکل موقعیت اسکرول",
"project": 30,
"project_service": 12,
"project_contract": 5,
"location": "teleworking",
"date": "1405-02-08",
"start_time": "1405-02-08 09:00:00",
"end_time": "1405-02-08 09:30:00",
"duration": 30,
"description": "توضیحات اختیاری"
}
},
"task_update": {
"endpoint": "/api/v1/tasks/{id}/",
"method": "PUT",
"payload": {
"title": "[IDEAL-901]: رفع مشکل موقعیت اسکرول",
"project": 30,
"project_service": 12,
"project_contract": 5,
"location": "teleworking",
"date": "1405-02-08",
"start_time": "1405-02-08 09:00:00",
"end_time": "1405-02-08 09:30:00",
"duration": 30,
"description": "توضیحات اختیاری"
}
},
"task_delete": {
"endpoint": "/api/v1/tasks/{id}/",
"method": "DELETE"
},
"projects": {
"endpoint": "/api/v1/projects/get_all_projects/",
"method": "GET",
"response": [
{
"id": 30,
"title": "NeoBRK",
"description": "NeoBRK"
}
]
},
"project_details": {
"endpoint": "/api/v1/projects/project_details/",
"method": "GET",
"query": {
"project": 30
},
"response": {
"services": [
{
"id": 12,
"service": "Frontend Development"
}
],
"contracts": [
{
"id": 5,
"contract": "Main Contract"
}
]
}
}
}

## پیام آماده برای لید

سلام، من برای اتصال Dashboard و Tasks در فرانت redesigned این JSON shapeها رو آماده کردم. بعضی endpointها طبق داکیومنت v1 موجودند، ولی برای نمایش کامل UI چند فیلد در لیست تسک‌ها هم لازم دارم، مثل:

- project_title
- location
- start_time
- end_time

لطفاً بفرمایید:

1. همین endpointهای v1 را با همین response استفاده کنم؟
2. برای فیلدهای اضافه، backend response لیست تسک‌ها را کامل‌تر می‌کند؟
3. یا باید در فرانت از چند endpoint مختلف map کنم؟
4. برای CORS در لوکال، origin زیر allow می‌شود؟
   http://localhost:4200
5. آدرس base URL واقعی dev/staging و token تستی چیست؟

## ارور فعلی

وقتی loadStats اجرا شده، request به این URL رفته:
http://api.your-backend.com/api/v1/users/a_user_details/?user=273&range=month_till_today

ارور:
Access to fetch has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present.

و status در Angular شده:
Http failure response ... status 0 undefined

تحلیل:
این خطا فعلاً طبیعی است چون base URL هنوز placeholder است و backend واقعی/CORS هنوز هماهنگ نشده. کد loadStats اجرا شده ولی request به دلیل CORS/base URL fail شده. این خطا به معنی خراب بودن HTML یا state نیست.

## وضعیت گزارش

فعلاً نباید برای APIها بنویسم Connected مگر وقتی واقعاً endpoint 200 بدهد و UI پر شود.

وضعیت فعلی:
Dashboard Stats → Implemented in frontend, blocked by backend/CORS/baseURL
Pie Chart → Contract ready
Line Chart → Contract ready
Messages → Contract ready
Tasks List → Contract ready

## قدم بعدی بعد از گرفتن جواب لید

اگر لید base URL و token داد:

1. environment.apiBaseUrl را با base URL واقعی جایگزین کنیم.
2. auth.interceptor.ts را با token تستی درست کنیم.
3. CORS را تست کنیم.
4. در Network بررسی کنیم stats endpoint 200 می‌دهد.
5. اگر response مطابق model بود، Dashboard Stats را Connected کنیم.
6. بعد سراغ pie chart و line chart برویم.
7. بعد برنچ بعدی برای Tasks Read & Filter.

اگر لید گفت فیلدهای اضافه task list را نمی‌دهد:

- باید یا UI را با فیلدهای موجود ساده‌تر کنیم.
- یا endpoint detail برای هر task بگیریم، ولی این برای لیست بد است چون N+1 request ایجاد می‌کند.
- راه بهتر این است backend لیست تسک‌ها را برای UI کامل‌تر کند.

## سؤال آموزشی که قبلاً جواب دادم

چرا DashboardService داخل shared/services نیست؟
چون فعلاً فقط در داشبورد استفاده می‌شود. چیزی که فقط برای یک feature است نباید زود global/shared شود.
```

---

## درباره اروری که فرستادی

این ارور کاملاً قابل انتظار است. request واقعاً زده شده، ولی مرورگر جلویش را گرفته چون response هدر CORS ندارد: `No 'Access-Control-Allow-Origin' header is present`. ضمن اینکه URL هنوز placeholder است: `http://api.your-backend.com/...`، پس تا وقتی base URL واقعی و CORS سمت backend تنظیم نشده، این endpoint از localhost جواب قابل استفاده نمی‌دهد.

پس فردا به لیدت این ۳ چیز را همزمان بگو:

1. **Base URL واقعی dev/staging را بدهد.**
2. **Token تستی developer بدهد.**
3. **CORS برای `http://localhost:4200` فعال شود.**

متن کوتاه:

```txt
الان request فرانت تا مرحله ارسال می‌ره، ولی به خاطر CORS و placeholder بودن base URL fail می‌شه. برای تست واقعی، لطفاً dev/staging base URL، token تستی developer، و allow شدن origin `http://localhost:4200` رو بدید.
```

---

## به احتمال زیاد لیدت چی می‌گه؟

چند سناریو محتمل داری:

### سناریو ۱: می‌گه «همین APIهای v1 رو استفاده کن»

در این حالت تو فقط `apiBaseUrl` و token رو می‌گیری و وصل می‌کنی.
اگر responseها دقیقاً مثل داکیومنت باشند، کارت راحت است.

### سناریو ۲: می‌گه «فیلدهای اضافه task list رو نداریم»

یعنی `project_title`, `location`, `start_time`, `end_time` را در `GET /tasks` نمی‌دهد.

جواب حرفه‌ای تو:

```txt
برای UI لیست، اگر این فیلدها داخل همان response نیاید، مجبور می‌شم یا UI را ناقص‌تر نمایش بدم یا برای هر task درخواست جدا بزنم که باعث N+1 request می‌شه. اگر ممکنه response لیست تسک‌ها برای view کامل‌تر بشه بهتره.
```

### سناریو ۳: می‌گه «از چند API مختلف map کن»

اینجا باید بپرسی:

```txt
آیا تعداد taskها در هر صفحه کم و ثابت است؟ چون اگر برای هر task detail جدا بزنیم، performance بد می‌شود. ترجیح من این است که list endpoint داده‌های لازم برای نمایش لیست را مستقیم برگرداند.
```

### سناریو ۴: می‌گه «فعلاً mock کن تا API آماده بشه»

در این حالت ما یک `MockDashboardService` نمی‌سازیم مگر لازم شود. ساده‌ترش این است:

```txt
contract JSONها را نگه می‌داریم و داخل dashboard.service فعلاً فقط endpoint واقعی را آماده می‌گذاریم، ولی UI را تا زمان آماده شدن API با mock contract تست می‌کنیم.
```

### سناریو ۵: می‌گه «CORS به تو ربطی نداره، از proxy استفاده کن»

این هم راه درست فرانت‌اندی است. اگر گفت proxy بزن، فردا می‌ریم سراغ:

```txt
proxy.conf.json
```

و به جای request مستقیم به backend، از مسیر local مثل این استفاده می‌کنیم:

```txt
/api/v1/users/a_user_details/
```

تا Angular dev server request را به backend proxy کند.

---

## چیزی که فردا اول باید بپرسی

به ترتیب اهمیت:

```txt
1. Dev/Staging base URL چیه؟
2. Token تستی developer چیه؟
3. CORS برای localhost:4200 فعال می‌شه یا proxy بزنم؟
4. آیا responseهای Dashboard دقیقاً مثل contract هستند؟
5. آیا GET /tasks می‌تونه project_title, location, start_time, end_time بده؟
6. project_details دقیقاً چه query paramی می‌خواد؟ project یا project_id؟
7. statusهای معتبر task دقیقاً چی هستند؟
8. rangeهای معتبر چی هستند؟ month_till_today، today، week، custom؟
```

تو الان جای درستی ایستادی:
**فرانت data flow اولیه را دارد، contractها آماده‌اند، و blocker واقعی backend/CORS/baseURL است، نه کد UI.**
///
