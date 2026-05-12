# گزارش جامع، حرفه‌ای و به‌روز پروژه WTT Frontend

> **فایل مرجع ادامه پروژه**  
> این گزارش برای ثبت تاریخچه فنی، تصمیم‌های معماری، نکات آموزشی، وضعیت فعلی، بدهی‌های فنی، مسیر آینده و پرامپت شروع چت جدید آماده شده است.  
> نسخه حاضر بر اساس وضعیت پروژه بعد از Branchهای `001` تا `009` تنظیم شده و جایگزین گزارش‌های پراکنده قبلی می‌شود.

---

## فهرست

1. [خلاصه اجرایی](#1-خلاصه-اجرایی)
2. [وضعیت فعلی پروژه در یک نگاه](#2-وضعیت-فعلی-پروژه-در-یک-نگاه)
3. [هدف محصول WTT](#3-هدف-محصول-wtt)
4. [استک فنی و نسخه‌ها](#4-استک-فنی-و-نسخهها)
5. [معماری کلی پروژه](#5-معماری-کلی-پروژه)
6. [الگوهای اصلی استفاده‌شده](#6-الگوهای-اصلی-استفادهشده)
7. [گزارش کامل Branchها](#7-گزارش-کامل-branchها)
8. [وضعیت Dashboard](#8-وضعیت-dashboard)
9. [وضعیت Tasks](#9-وضعیت-tasks)
10. [قرارداد APIها و وضعیت اتصال](#10-قرارداد-apiها-و-وضعیت-اتصال)
11. [مدل‌های TypeScript](#11-مدلهای-typescript)
12. [Mock Mode، Contract API، Mock API واقعی و CORS](#12-mock-mode-contract-api-mock-api-واقعی-و-cors)
13. [تصمیم‌های مهم فنی](#13-تصمیمهای-مهم-فنی)
14. [بدهی‌های فنی و ریسک‌ها](#14-بدهیهای-فنی-و-ریسکها)
15. [مسیر دقیق ادامه پروژه](#15-مسیر-دقیق-ادامه-پروژه)
16. [Branch بعدی پیشنهادی با جزئیات اجرایی](#16-branch-بعدی-پیشنهادی-با-جزئیات-اجرایی)
17. [اگر مسیر طبق برنامه پیش نرفت چه کنیم؟](#17-اگر-مسیر-طبق-برنامه-پیش-نرفت-چه-کنیم)
18. [چک‌لیست قبل از Commit و Demo](#18-چکلیست-قبل-از-commit-و-demo)
19. [مرور آموزشی مفاهیم کلیدی](#19-مرور-آموزشی-مفاهیم-کلیدی)
20. [سوال‌های آموزشی برای تثبیت یادگیری](#20-سوالهای-آموزشی-برای-تثبیت-یادگیری)
21. [پرامپت کامل برای شروع چت جدید](#21-پرامپت-کامل-برای-شروع-چت-جدید)
22. [جمع‌بندی نهایی](#22-جمعبندی-نهایی)

---

## 1. خلاصه اجرایی

پروژه `wtt-frontend` بازطراحی فرانت‌اند سامانه WTT است. هدف فعلی این است که دو صفحه اصلی، یعنی `Dashboard` و `Tasks`، از حالت کاملاً static/mock خارج شوند و به ساختار استاندارد و قابل اتصال به API برسند.

تا این نقطه، کارهای مهم زیر انجام شده‌اند:

- معماری پایه Angular با Standalone Components آماده شده است.
- Theme، Layout، Header، Sidebar و Left Sidebar ساخته شده‌اند.
- Dashboard UI ساخته شده و بخش‌های اصلی آن با `DashboardService`، `ApiState` و ECharts data-driven شده‌اند.
- صفحه Tasks از static خارج شده و list، pagination، filter، create، edit، delete و smart form دارد.
- `TasksService` و `DashboardService` ساخته شده‌اند.
- Mock Mode بر اساس environment پیاده‌سازی شده است.
- Contract API، Mock API قابل مصرف، مشکل response shape، CORS، proxy و browser extension عملاً تست و تحلیل شده‌اند.
- برای لید backend فایل‌های JSON جدا برای هر route آماده و ارسال شده‌اند تا هر endpoint دقیقاً response مستقیم خودش را برگرداند.

وضعیت مهم فعلی:

```txt
Dashboard frontend flow: آماده
Tasks read/list/filter: آماده
Tasks create/edit/delete frontend flow: آماده
Mock/Internal data: آماده برای توسعه مستقل
Real/mock-consumable API: در انتظار routeهای درست و CORS/backend persistence
Login واقعی: هنوز انجام نشده
Presence/timer واقعی: branch بعدی یا بعد از تثبیت API
```

---

## 2. وضعیت فعلی پروژه در یک نگاه

| بخش                  | وضعیت فعلی                    | توضیح                                                                                   |
| -------------------- | ----------------------------- | --------------------------------------------------------------------------------------- |
| Workspace/Core       | انجام شده                     | پروژه Angular، ساختار پوشه‌ها و ابزارها آماده‌اند.                                      |
| Auth/Security پایه   | انجام شده                     | interceptorها و ساختار Auth آماده‌اند، ولی login واقعی هنوز نیست.                       |
| Layout/Theme         | انجام شده                     | Header، Sidebar، Left Sidebar، Light/Dark Mode آماده‌اند.                               |
| Dashboard UI         | انجام شده                     | UI و chartها آماده‌اند.                                                                 |
| Dashboard API Flow   | انجام شده                     | service/state/mapping آماده؛ اتصال واقعی نیازمند endpoint مستقیم و CORS است.            |
| Tasks List           | انجام شده                     | dynamic rendering، pagination، filters، loading/error/empty آماده‌اند.                  |
| Tasks Mutation       | انجام شده                     | create/edit/delete modal، Reactive Form، payload mapping، project dropdownها آماده‌اند. |
| Mock Mode            | انجام شده                     | `useMockData` برای توسعه مستقل فعال است.                                                |
| Contract Bridge موقت | تست شده                       | `/taskscontract/` با map تست شد، ولی راه نهایی نیست.                                    |
| CORS                 | تحلیل و تست شده               | proxy و extension تست شد؛ راه درست، تنظیم سرور است.                                     |
| API persistence      | وابسته به backend/mock server | API فیک فعلی اگر JSON ثابت بدهد، create/delete در GET بعدی دیده نمی‌شود.                |
| Presence/Timer       | آینده                         | باید بعد از تثبیت API شروع شود.                                                         |
| Demo آماده برای لید  | نزدیک                         | بعد از routeهای درست و پاکسازی نهایی آماده دمو می‌شود.                                  |

---

## 3. هدف محصول WTT

WTT جدید فقط یک سیستم ثبت ساعت نیست. هدف محصول این است که به یک لایه هوشمند بین developer، task، حضور، GitLab/Jira، team lead، HR و مدیریت تبدیل شود.

### 3.1 نقش‌ها و ارزش محصول

| نقش/بخش     | ارزش مورد انتظار                                                   |
| ----------- | ------------------------------------------------------------------ |
| Developer   | ثبت ساده‌تر worklog، کاهش کار اداری، تایید سریع‌تر                 |
| Team Lead   | بررسی سریع‌تر تسک‌ها، دیدن وضعیت pending/rejected، تصمیم‌گیری بهتر |
| HR          | داده قابل حسابرسی برای حضور/غیاب و حقوق                            |
| Management  | گزارش‌های خلاصه و قابل تصمیم‌گیری                                  |
| GitLab/Jira | منبع شواهد فنی، commit، branch، ticket و worklog                   |

### 3.2 چشم‌انداز بلندمدت

قابلیت‌های بلندمدت محصول:

- Smart Worklog
- AI Task Suggestion
- Evidence Pack
- Confidence Score
- Approval Flow
- Presence/Timer Integration
- HR Payroll Support
- Engineering Intelligence
- AI Report Generator

### 3.3 هدف MVP فعلی

MVP فعلی فقط روی دو صفحه اصلی تمرکز دارد:

```txt
Dashboard → نمایش وضعیت کلی عملکرد، KPIها، نمودارها، پیام‌ها
Tasks → مشاهده، فیلتر، صفحه‌بندی، ثبت، ویرایش و حذف تسک
```

---

## 4. استک فنی و نسخه‌ها

| مورد             | وضعیت                                       |
| ---------------- | ------------------------------------------- |
| Framework        | Angular 21.2.x                              |
| Architecture     | Standalone Components                       |
| Change Detection | Zoneless + Signals                          |
| Styling          | Tailwind CSS 4.2.x + SCSS                   |
| Date Library     | date-fns-jalali 4.1.x                       |
| HTTP             | provideHttpClient(withFetch())              |
| Charts           | echarts + ngx-echarts                       |
| State Pattern    | signal<ApiState<T>>                         |
| Forms            | Reactive Forms برای Task Modal              |
| Environment      | environment.ts و environment.development.ts |

### 4.1 اصلاح تاریخی درباره Angular

در گزارش‌های اولیه چند بار عبارت Angular 22 آمده بود. وضعیت واقعی پروژه طبق نصب فعلی Angular `21.2.x` است. بنابراین در مستندات نهایی باید Angular 21.2.x نوشته شود.

### 4.2 اصلاح تاریخی درباره Chart Library

در مراحل اولیه گفته شده بود chart library نصب نشده است، اما در وضعیت فعلی:

- `echarts` نصب شده است.
- `ngx-echarts` نصب شده است.
- `provideEchartsCore({ echarts })` در `app.config.ts` ثبت شده است.

---

## 5. معماری کلی پروژه

### 5.1 ساختار پوشه‌ای مهم

```txt
src/app
├── core
│   ├── interceptors
│   │   ├── auth.interceptor.ts
│   │   └── error.interceptor.ts
│   ├── layout
│   │   ├── header
│   │   ├── left-sidebar
│   │   └── sidebar
│   └── services
│       ├── auth
│       ├── layout
│       └── theme
├── features
│   ├── auth
│   ├── dashboard
│   │   ├── dashboard.ts
│   │   ├── dashboard.html
│   │   └── services/dashboard.service.ts
│   ├── presence
│   └── tasks
│       ├── tasks.ts
│       ├── tasks.html
│       └── services/tasks.service.ts
├── shared
│   ├── models
│   │   ├── api-state.model.ts
│   │   ├── dashboard.model.ts
│   │   ├── project.model.ts
│   │   ├── task.model.ts
│   │   └── user.model.ts
├── app.config.ts
├── app.routes.ts
└── app.ts
```

### 5.2 قانون Feature-first

هر service یا logic که فقط برای یک feature استفاده می‌شود، داخل همان feature می‌ماند.

مثال:

```txt
DashboardService → داخل features/dashboard/services
TasksService → داخل features/tasks/services
```

این تصمیم باعث می‌شود کد زودتر از موعد global/shared نشود و coupling غیرضروری ایجاد نکند.

---

## 6. الگوهای اصلی استفاده‌شده

### 6.1 الگوی Data Flow

الگوی اصلی پروژه:

```txt
Model → Service → State → Load Method → Template Binding
```

توضیح:

1. مدل TypeScript shape داده را مشخص می‌کند.
2. Service مسئول ارتباط با API است.
3. Component state را نگه می‌دارد.
4. متد load، service را صدا می‌زند و state را آپدیت می‌کند.
5. Template فقط state آماده را نمایش می‌دهد.

### 6.2 ApiState

مدل عمومی state:

```ts
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
```

کاربرد:

```ts
ApiState<DashboardStats>;
ApiState<TaskListResponse>;
ApiState<Project[]>;
ApiState<ProjectDetailsResponse>;
```

### 6.3 Read State و Mutation State

Read یعنی داده فقط خوانده می‌شود:

```txt
GET /tasks
GET /projects
GET /dashboard/line_chart
```

Mutation یعنی داده تغییر می‌کند:

```txt
POST /tasks
PUT /tasks/{id}
DELETE /tasks/{id}
```

در پروژه:

```txt
tasksState → وضعیت GET لیست تسک‌ها
mutationState → وضعیت submit فرم create/update
deletingTaskId → وضعیت حذف یک row خاص
```

### 6.4 Reactive Form

برای Task Modal از Reactive Forms استفاده شد، چون فرم create/edit فیلدهای زیاد، validation، disabled state و payload mapping دارد.

فرم مقدار خام UI را نگه می‌دارد، ولی payload نهایی با `buildTaskPayload()` ساخته می‌شود.

---

## 7. گزارش کامل Branchها

## 7.1 Branch 001 — `feature/001-workspace-and-core`

### هدف

ساخت workspace، نصب ابزارها و آماده‌سازی پایه پروژه.

### کارهای انجام‌شده

- نصب امن Node.js با NVM.
- نصب Angular CLI.
- ساخت پروژه Angular با معماری Standalone.
- نصب و پیکربندی Tailwind CSS v4.
- نصب `date-fns-jalali`.
- آماده‌سازی ساختار `core`, `shared`, `features`, `state`.

### نکات آموزشی

- NVM مشکل permission در Linux را کم می‌کند.
- Standalone Components ساختار را ساده‌تر و feature-orientedتر می‌کنند.
- Tailwind v4 flow متفاوتی نسبت به نسخه‌های قدیمی دارد.

### وضعیت

انجام شده.

---

## 7.2 Branch 002 — `feature/002-auth-and-security`

### هدف

آماده‌سازی زیرساخت HTTP، token، error handling و امنیت پایه.

### کارهای انجام‌شده

- فعال‌سازی `provideHttpClient(withFetch())`.
- فعال‌سازی zoneless + signals.
- ساخت `authInterceptor` برای اضافه کردن `Authorization`.
- ساخت `errorInterceptor` برای مدیریت 401/403/503.
- ساخت AuthService و نگهداری user state.
- حذف userId از URL برای کاهش ریسک IDOR.

### نکات آموزشی

- Interceptor درخواست خروجی را قبل از ارسال تغییر می‌دهد.
- Error interceptor خطاهای برگشتی را مدیریت می‌کند.
- فرانت امنیت backend را تضمین نمی‌کند، ولی نباید userId قابل تغییر در URL داشته باشد.

### وضعیت

انجام شده، اما login واقعی هنوز آینده است.

---

## 7.3 Branch 003 — `feature/003-ui-layout-and-theme`

### هدف

ساخت پوسته اصلی برنامه.

### کارهای انجام‌شده

- Header
- Sidebar
- Left Sidebar
- Theme Toggle
- Light/Dark Mode
- CSS variables / design tokens
- استفاده از LayoutService برای context-aware UI

### نکات آموزشی

- Design Token تغییر تم را ساده‌تر می‌کند.
- Signals برای تغییرات UI مثل theme مناسب هستند.
- Header و Sidebar بیرون از router-outlet هستند و برای فهمیدن صفحه فعلی به LayoutService نیاز دارند.

### وضعیت

انجام شده، ولی responsive کامل هنوز نیاز به polish دارد.

---

## 7.4 Branch 004 — `feature/004-ui-dashboard-widgets`

### هدف

ساخت UI اولیه Dashboard با mock/static data.

### کارهای انجام‌شده

- KPI Cards
- نمودار line اولیه
- نمودار pie/donut اولیه
- اطلاعیه‌ها
- فعالیت‌های اخیر
- استفاده از SVG inline در بخشی از UI

### نکات آموزشی

- SVG inline برای کنترل دقیق UI خوب است، ولی اگر زیاد شود HTML را شلوغ می‌کند.
- برای نمودارهای data-driven، کتابخانه chart مثل ECharts مناسب‌تر است.

### وضعیت

انجام شده. بعدها ECharts جایگزین بخش‌های chart شد.

---

## 7.5 Branch 005 — `feature/005-ui-tasks-and-presence`

### هدف

ساخت ظاهر Task Command Center و آماده‌سازی presence/timer.

### کارهای انجام‌شده

- UI صفحه Tasks
- task rowها
- status railها
- smart filters اولیه
- context-aware Header/Left Sidebar
- آماده‌سازی جایگاه presence/timer

### نکات آموزشی

- context-aware layout باعث می‌شود header/sidebar نسبت به صفحه فعلی واکنش نشان دهند.
- task actions بهتر است داخل خود صفحه Tasks باشد، نه Header عمومی.

### وضعیت

انجام شده. Presence واقعی به branch آینده منتقل شد.

---

## 7.6 Branch 006 — `feature/006-api-contracts-and-data-foundation`

### هدف

آماده‌سازی مدل‌ها، environment و قرارداد API قبل از اتصال واقعی.

### کارهای انجام‌شده

- ساخت environment files.
- ساخت مدل‌های TypeScript:
  - User
  - Dashboard
  - Task
  - Project
  - ApiState
- ساخت contract JSON برای هماهنگی با لید.
- تصمیم‌گیری درباره temporaryUserId.
- تصمیم‌گیری درباره temporary token.

### نکات آموزشی

- مدل‌ها قبل از service باعث می‌شوند shape داده شفاف باشد.
- environment مانع hardcode شدن URL و config در service می‌شود.
- contract JSON برای هماهنگی frontend/backend مفید است، اما نباید خودش API مصرفی برنامه شود.

### وضعیت

انجام شده.

---

## 7.7 Branch 007 — `feature/007-dashboard-api-integration`

### هدف

خارج کردن Dashboard از حالت static و اتصال آن به service/state.

### کارهای انجام‌شده

- ساخت `DashboardService`.
- افزودن متدهای:
  - `getStats`
  - `getPieChart`
  - `getLineChart`
  - `getUnreadMessages`
- ساخت stateهای:
  - `statsState`
  - `lineChartState`
  - `pieChartState`
- اتصال KPI cards به state.
- جایگزینی chart static/SVG با ECharts.
- اضافه شدن loading/error/empty state.
- اضافه شدن Mock Mode بر اساس environment.

### نکات آموزشی مهم

- Empty state با error فرق دارد.
- `[]` یعنی API موفق بوده ولی دیتایی وجود ندارد.
- ECharts container باید height مشخص داشته باشد.
- formatter محور باید با نوع داده محور هماهنگ باشد.
- هر component فقط دیتای خودش را load کند؛ pie chart داخل left-sidebar است، پس همانجا load شد.

### وضعیت

از نظر frontend کامل است. اتصال واقعی نیازمند endpoint مستقیم، CORS درست و response مطابق contract است.

---

## 7.8 Branch 008 — `feature/008-tasks-read-and-filter-integration`

### هدف

اتصال لیست Tasks به service، state، pagination و filters.

### کارهای انجام‌شده

- ساخت `TasksService`.
- اتصال `GET /api/v1/tasks/`.
- ساخت `tasksState`.
- dynamic کردن task rows.
- اضافه کردن loading skeleton.
- اضافه کردن error state و retry.
- اضافه کردن empty state.
- پیاده‌سازی pagination با `meta.page`, `meta.page_size`, `meta.total`.
- اضافه کردن quick filters.
- range filters به API query وصل شدند.
- status filters فعلاً client-side روی صفحه فعلی اعمال شدند.
- summary cards از داده load شده ساخته شدند.

### نکات آموزشی مهم

- در listها حتی اگر `data` خالی باشد، `meta` مهم است.
- pagination باید از `meta.total / meta.page_size` حساب شود، نه از `tasks.length`.
- اگر backend پارامتر status ندارد، نباید بدون contract آن را به API فرستاد.

### وضعیت

انجام شده.

---

## 7.9 Branch 009 — `feature/009-tasks-mutation-and-smart-form`

### هدف

عملیاتی کردن صفحه Tasks با create/edit/delete و smart form.

### کارهای انجام‌شده

- تکمیل `TasksService`:
  - `createTask`
  - `updateTask`
  - `deleteTask`
  - `getProjects`
  - `getProjectDetails`
- اضافه کردن Reactive Form.
- ساخت task modal.
- create mode.
- edit mode.
- submit flow.
- build کردن `TaskMutationPayload` از فرم.
- محاسبه duration از start/end time.
- validation ساعت پایان بعد از ساعت شروع.
- mutation loading/error.
- refetch بعد از mutation.
- dynamic project dropdown.
- cascading service/contract dropdown.
- reset service/contract هنگام تغییر project.
- delete flow.
- row-level deleting state.
- delete error state.
- تست contract API، CORS، proxy و browser extension.

### نکات آموزشی مهم

- `taskForm` مسئول مقدار و validation فیلدهای فرم است.
- `mutationState` مسئول وضعیت submit فرم است.
- `tasksState` مسئول GET لیست taskهاست.
- delete چون مربوط به یک row است، `deletingTaskId` جدا دارد.
- `taskForm.getRawValue()` همیشه مستقیماً برای API مناسب نیست.
- برای API باید `buildTaskPayload()` داشته باشیم.
- بعد از mutation بهتر است `loadTasks()` بزنیم تا backend منبع اصلی داده بماند.
- اگر API فیک static باشد، create/delete در GET بعدی دیده نمی‌شود.

### وضعیت

Frontend flow کامل است. مشاهده تغییر واقعی در لیست وابسته به backend/mock API با persistence است.

---

## 8. وضعیت Dashboard

### 8.1 بخش‌های آماده

| بخش                 | وضعیت                   |
| ------------------- | ----------------------- |
| KPI Cards           | state/service آماده     |
| Stats API mapping   | آماده                   |
| Pie Chart           | ECharts + service آماده |
| Line Chart          | ECharts + service آماده |
| Loading/Error/Empty | اضافه شده               |
| Mock Mode           | آماده                   |

### 8.2 بخش‌های نیمه‌کامل یا deferred

| بخش                           | وضعیت                                    |
| ----------------------------- | ---------------------------------------- |
| Header unread message binding | service آماده، UI نهایی deferred         |
| Announcements list            | هنوز کامل API-driven نشده                |
| Active presence widget        | نیازمند branch Presence                  |
| Today sidebar stats           | نیازمند endpoint جدا یا mock route نهایی |

### 8.3 شرط Connected واقعی

نباید بنویسیم Dashboard connected است مگر اینکه:

```txt
endpoint واقعی یا mock-consumable route داشته باشد
response مستقیم و درست بدهد
CORS حل شده باشد
Network 200 OK باشد
UI با داده همان response پر شود
```

---

## 9. وضعیت Tasks

### 9.1 Read/List

آماده است:

- `TasksService.getTasks`
- `tasksState`
- dynamic rows
- pagination
- filters
- loading/error/empty

### 9.2 Mutation

آماده است:

- create
- update
- delete
- modal
- Reactive Form
- payload mapping
- project dropdownها
- service/contract dropdownها

### 9.3 محدودیت فعلی

اگر mock API فقط JSON ثابت بدهد، بعد از POST/PUT/DELETE، GET بعدی تغییر را نشان نمی‌دهد. این مشکل frontend نیست؛ مشکل نبود persistence در mock server است.

### 9.4 برای edit کامل چه لازم داریم؟

برای prefill کامل edit، یکی از این دو لازم است:

```txt
GET /api/v1/tasks/ در هر item فیلدهای project_service و project_contract هم بدهد
یا
GET /api/v1/tasks/{id}/ detail کامل task را بدهد
```

فعلاً فرم edit title/project/location/date/start/end را prefill می‌کند، ولی service/contract چون در لیست موجود نیستند، باید دوباره انتخاب شوند.

---

## 10. قرارداد APIها و وضعیت اتصال

## 10.1 Dashboard Stats

```http
GET /api/v1/users/a_user_details/?user=273&range=month_till_today
```

Expected response:

```json
{
  "data": {
    "first_name": "مهدی",
    "last_name": "کریمی",
    "expected_time": 6336,
    "total_work": 6824,
    "overtime_working": 488,
    "this_year_vacations": 2
  }
}
```

## 10.2 Dashboard Pie Chart

```http
GET /api/v1/dashboard/pie_chart/?user=273&range=month_till_today
```

Expected response:

```json
[
  { "project": "NeoBRK", "value": 2625 },
  { "project": "غیر مفید", "value": 1468 }
]
```

## 10.3 Dashboard Line Chart

```http
GET /api/v1/dashboard/line_chart/?user=273&range=month_till_today
```

Expected response:

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

برای نمایش بهتر line chart، بهتر است چند date مختلف برگردد.

## 10.4 Unread Messages

```http
GET /api/v1/news/get_message_data/?state=unread_count
```

Expected response:

```json
{
  "private": 0,
  "public": 82,
  "regulations": 0
}
```

## 10.5 Tasks List

```http
GET /api/v1/tasks/?user=273&page=1&range=month_till_today
```

Expected response:

```json
{
  "data": [
    {
      "id": 259354,
      "status": "pending",
      "title": "[IDEAL-901]: رفع مشکل موقعیت اسکرول",
      "project_id": 30,
      "project_title": "مگاپروژه > للویاینک",
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
}
```

## 10.6 Tasks Summary

```http
GET /api/v1/tasks/summary/?user=273&range=today
```

Expected response:

```json
{
  "today_tasks_count": 7,
  "logged_time_minutes": 348,
  "pending_review_count": 3,
  "needs_fix_count": 1
}
```

این endpoint هنوز در frontend نهایی مصرف نشده و برای دقیق‌تر کردن summary cards پیشنهاد شده است.

## 10.7 Projects List

```http
GET /api/v1/projects/get_all_projects/
```

Expected response:

```json
[
  { "id": 30, "title": "مگاپروژه > للویاینک", "description": "NeoBRK main project" },
  { "id": 90, "title": "WTT", "description": "Work Time Tracker" }
]
```

## 10.8 Project Details

```http
GET /api/v1/projects/project_details/?project=30
```

Expected response:

```json
{
  "services": [
    { "id": 154, "service": "Frontend Development" },
    { "id": 155, "service": "Bug Fixing" }
  ],
  "contracts": [
    { "id": 23, "contract": "Main Contract" },
    { "id": 24, "contract": "Support Contract" }
  ]
}
```

تصمیم فعلی: query param را `project` می‌گیریم.

## 10.9 Task Mutation

### Create

```http
POST /api/v1/tasks/
```

Payload:

```json
{
  "title": "رفع مشکل احراز هویت کاربران",
  "project": 30,
  "project_service": 154,
  "project_contract": 23,
  "location": "teleworking",
  "date": "1405-02-08",
  "start_time": "1405-02-08 09:00:00",
  "end_time": "1405-02-08 09:30:00",
  "duration": 30,
  "description": "optional string"
}
```

### Update

```http
PUT /api/v1/tasks/{id}/
```

همان payload create.

### Delete

```http
DELETE /api/v1/tasks/{id}/
```

Expected response:

```json
{ "success": true }
```

یا `204 No Content`.

---

## 11. مدل‌های TypeScript

## 11.1 ApiState

```ts
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
```

## 11.2 Dashboard Models

```ts
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
```

## 11.3 Task Models

```ts
export type TaskStatus = 'pending' | 'approved' | 'rejected' | 'draft' | 'edited' | string;
export type WorkLocation = 'teleworking' | 'incompany_working' | string;

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
```

## 11.4 Project Models

```ts
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
```

---

## 12. Mock Mode، Contract API، Mock API واقعی و CORS

### 12.1 Mock داخلی Frontend

Mock داخلی یعنی service خودش با `of(mockData).pipe(delay(...))` داده برمی‌گرداند.

مزیت:

- توسعه مستقل از backend.
- تست loading/empty/error.
- ادامه کار حتی اگر سرور در دسترس نباشد.

محدودیت:

- داده واقعی نیست.
- persistence ندارد مگر خودمان state محلی بسازیم.

### 12.2 Contract Endpoint

Contract endpoint مثل `/taskscontract/` یعنی endpointی که فقط مستندات/shape را نشان می‌دهد.

مشکل:

```txt
response مستقیم UI نیست
داخل wrapper مثل tasks_list.requested_ui_response است
برای مصرف مستقیم باید map بزنیم
```

این برای تست موقت خوب است، ولی راه نهایی نیست.

### 12.3 Mock API قابل مصرف

Mock API قابل مصرف یعنی route نهایی دارد و response مستقیم می‌دهد.

مثال درست:

```txt
GET /api/v1/tasks/
→ مستقیم { data, meta }
```

نه:

```txt
GET /api/v1/tasks/
→ کل فایل requirements یا wrapper شامل dashboard/tasks/endpoints
```

### 12.4 CORS

CORS یعنی مرورگر اجازه نمی‌دهد از origin دیگری response خوانده شود، مگر سرور اجازه بدهد.

راه‌ها:

| راه               | کاربرد            | وضعیت                                 |
| ----------------- | ----------------- | ------------------------------------- |
| CORS سمت سرور     | راه درست          | باید لید فعال کند                     |
| Angular Proxy     | راه dev استاندارد | تست شد و کار کرد                      |
| Browser Extension | راه شخصی موقت     | تست شد، ولی قابل اتکا برای پروژه نیست |

### 12.5 نتیجه تجربه عملی

ما یاد گرفتیم:

```txt
wrong response shape ≠ CORS
CORS ≠ خراب بودن Angular
Contract endpoint ≠ API مصرفی برنامه
Proxy فقط وقتی کار می‌کند که URL relative باشد
environment.ts و environment.development.ts باید هماهنگ باشند
```

---

## 13. تصمیم‌های مهم فنی

### 13.1 Task جدید را بعد از create دستی به لیست اضافه نکردیم

چون روش انتخابی ما `refetch after mutation` است. بعد از create/update/delete، backend باید منبع اصلی حقیقت باشد و `GET /tasks` لیست جدید را بدهد.

اگر mock server state ذخیره نکند، task جدید دیده نمی‌شود؛ این محدودیت mock است.

### 13.2 Status filter فعلاً client-side است

چون contract فعلی `GET /tasks` فقط `user`, `page`, `range` را دارد. تا وقتی backend `status` را رسمی نکند، نباید query نامعتبر به API بفرستیم.

### 13.3 Summary cards دقیق Tasks بهتر است endpoint جدا داشته باشند

الان summary از صفحه فعلی محاسبه می‌شود. برای summary دقیق کل range، endpoint زیر پیشنهاد شده:

```txt
GET /api/v1/tasks/summary/?user=273&range=today
```

### 13.4 Project details با query `project` گرفته می‌شود

تصمیم فعلی:

```txt
GET /api/v1/projects/project_details/?project=30
```

### 13.5 Header باید سرچ عمومی داشته باشد

دکمه‌های Tasks مثل ثبت وظیفه جدید بهتر است داخل خود صفحه Tasks باشند، نه Header سراسری.

---

## 14. بدهی‌های فنی و ریسک‌ها

### 14.1 Backend/API

- routeهای mock API نهایی باید مستقیم response بدهند.
- CORS باید سمت سرور فعال شود.
- mock server باید برای create/update/delete persistence داشته باشد یا صریحاً فقط demo static باشد.
- `project_service` و `project_contract` برای edit کامل باید در response بیاید.
- statusهای رسمی task باید قطعی شوند.
- rangeهای رسمی باید قطعی شوند.

### 14.2 Frontend

- Contract bridge موقت نباید وارد commit نهایی شود مگر با اسم و توضیح واضح.
- browser extension CORS نباید راه‌حل پروژه‌ای حساب شود.
- console logهای موقت باید حذف شوند.
- error messageها باید user-friendlyتر شوند.
- field-level validation messageها زیر inputها اضافه شوند.
- success toast برای create/update/delete اضافه شود.
- confirm حذف بهتر است custom modal شود.

### 14.3 Dashboard

- unread messages باید به Header binding نهایی شود.
- announcements باید data-driven شود.
- active presence و today sidebar stats باید API-driven شوند.
- responsive و empty stateهای chart باید دوباره مرور شوند.

### 14.4 Tasks

- task detail endpoint برای edit کامل نیاز است.
- summary cards باید از endpoint summary بیایند.
- status filter بهتر است در آینده server-side شود.
- AI generation فعلاً فقط UI است.
- play/timer action هنوز واقعی نیست.

### 14.5 Auth

- login واقعی هنوز نیست.
- temporary token و userId باید حذف شوند.
- userId باید از auth/profile state بیاید.

---

## 15. مسیر دقیق ادامه پروژه

مسیر پیشنهادی بعد از Branch 009:

```txt
010-api-stabilization-and-real-mock-verification
011-presence-and-timer-integration
012-task-form-polish-and-detail-prefill
013-dashboard-sidebar-and-notifications-data
014-two-page-polish-and-lead-demo
015-auth-login-and-profile-hardening
```

چرا اول API Stabilization؟

چون بزرگ‌ترین ریسک فعلی feature جدید نیست؛ ریسک اصلی این است که API routeها، response shapeها، CORS، environment و persistence درست نباشند. اگر این بخش تثبیت نشود، Presence یا featureهای بعدی هم روی پایه ناپایدار ساخته می‌شوند.

---

## 16. Branch بعدی پیشنهادی با جزئیات اجرایی

## Branch 010 — `feature/010-api-stabilization-and-real-mock-verification`

### هدف

تثبیت اتصال API واقعی/Mock API قابل مصرف، حذف bridgeهای موقت و آماده‌سازی دو صفحه Dashboard و Tasks برای دمو قابل اعتماد.

### چرا این branch لازم است؟

ما در Branch 009 تجربه کردیم که:

- contract endpoint به درد مصرف مستقیم نمی‌خورد.
- response shape اگر wrapper داشته باشد، سرویس frontend مجبور به map موقت می‌شود.
- CORS می‌تواند request را در مرورگر بلاک کند حتی اگر سرور 200 بدهد.
- environment ناهماهنگ باعث می‌شود درخواست به URL اشتباه برود.
- mock API اگر persistence نداشته باشد، create/update/delete در GET بعدی دیده نمی‌شوند.

پس قبل از Presence، باید اتصال دو صفحه موجود را تثبیت کنیم.

### Checklist دقیق Branch 010

#### 1. پاکسازی حالت‌های موقت

- [ ] بررسی `environment.ts` و `environment.development.ts`.
- [ ] هماهنگ کردن propertyها:
  - `apiBaseUrl`
  - `contractBaseUrl`
  - `useMockData`
  - `useContractApi`
- [ ] تصمیم نهایی برای تست local:
  - مستقیم با CORS درست
  - یا proxy dev
- [ ] حذف یا کامنت‌گذاری واضح bridge موقت `/taskscontract/`.
- [ ] حذف console log مثل `Reading tasks from contract API`.

#### 2. تست routeهای مستقیم Tasks

- [ ] تست `GET /api/v1/tasks/` در browser/curl/network.
- [ ] بررسی اینکه response دقیقاً `{ data, meta }` باشد.
- [ ] تست pagination با `page=1`, `page=2`.
- [ ] تست `range=today`, `week_till_today`, `month_till_today`.
- [ ] اگر summary endpoint آماده شد، اتصال summary cards به `GET /api/v1/tasks/summary/`.
- [ ] اگر create/update/delete persistence ندارد، ثبت در گزارش و تصمیم‌گیری: demo static یا fake persistence سمت mock server.

#### 3. تست routeهای Projects

- [ ] تست `GET /api/v1/projects/get_all_projects/`.
- [ ] تست `GET /api/v1/projects/project_details/?project=30`.
- [ ] بررسی services/contracts.
- [ ] اگر query param متفاوت بود، service را اصلاح کن.

#### 4. تست mutation endpoints

- [ ] تست `POST /api/v1/tasks/`.
- [ ] تست `PUT /api/v1/tasks/{id}/`.
- [ ] تست `DELETE /api/v1/tasks/{id}/`.
- [ ] بررسی اینکه بعد از POST/PUT/DELETE، GET بعدی تغییر را نشان می‌دهد یا نه.
- [ ] اگر نشان نمی‌دهد، دلیل را به عنوان backend/mock persistence dependency ثبت کن.

#### 5. تست Dashboard endpoints

- [ ] تست `GET /api/v1/users/a_user_details/`.
- [ ] تست `GET /api/v1/dashboard/pie_chart/`.
- [ ] تست `GET /api/v1/dashboard/line_chart/`.
- [ ] تست `GET /api/v1/news/get_message_data/`.
- [ ] بررسی اینکه خطی چند date دارد یا نه.
- [ ] بررسی empty/error state.

#### 6. CORS و Auth

- [ ] اگر CORS درست شد، افزونه مرورگر غیرفعال شود و مستقیم تست شود.
- [ ] اگر CORS درست نشد، proxy dev با توضیح رسمی نگه داشته شود.
- [ ] auth interceptor برای mock server فقط در صورت نیاز skip شود.
- [ ] temporary token از commit حساس حذف شود.

#### 7. گزارش نهایی Branch 010

- [ ] ثبت routeهای verified.
- [ ] ثبت routeهای broken.
- [ ] ثبت response shape mismatchها.
- [ ] ثبت CORS وضعیت نهایی.
- [ ] ثبت اینکه چه چیزهایی connected واقعی هستند و چه چیزهایی frontend-ready هستند.

### خروجی مورد انتظار Branch 010

در پایان branch باید دقیقاً بدانیم:

```txt
کدام endpointها واقعاً قابل مصرف‌اند
کدام endpointها هنوز فقط contract/spec هستند
کدام responseها shape درست دارند
کدام بخش‌های UI با API واقعی/mock-consumable کار می‌کنند
کدام موارد وابسته به backend باقی مانده‌اند
```

---

## 17. اگر مسیر طبق برنامه پیش نرفت چه کنیم؟

### سناریو 1: لید route مستقیم داد ولی response هنوز کل فایل یا wrapper است

راه‌حل:

- به لید بگوییم هر route فقط JSON خودش را return کند.
- موقتاً map نزنیم مگر برای تست کوتاه.
- اگر مجبور شدیم map بزنیم، کد را با نام temporary bridge مشخص کنیم.

### سناریو 2: CORS درست نشد

راه‌حل:

- برای dev از Angular proxy استفاده کنیم.
- browser extension فقط برای تست شخصی باشد.
- در گزارش بنویسیم CORS server-side هنوز blocker است.

### سناریو 3: create موفق است ولی task جدید در list دیده نمی‌شود

راه‌حل:

- بررسی کنیم mock server persistence دارد یا نه.
- اگر ندارد، بگوییم frontend flow درست است ولی mock server static است.
- از optimistic update فعلاً دوری کنیم مگر به عنوان branch جدا/تصمیم آگاهانه.

### سناریو 4: edit کامل prefill نمی‌شود

راه‌حل:

- اگر response list فیلدهای service/contract ندارد، از لید بخواهیم اضافه کند.
- یا endpoint detail task بگیریم:

```txt
GET /api/v1/tasks/{id}/
```

### سناریو 5: line chart فقط یک نقطه دارد

راه‌حل:

- از backend/mock بخواهیم چند date مختلف بدهد.
- یک نقطه برای line chart فنی درست است ولی از نظر UI خط واقعی نشان نمی‌دهد.

---

## 18. چک‌لیست قبل از Commit و Demo

### 18.1 قبل از Commit

```bash
ng serve
npm run build
```

چک شود:

- [ ] console log موقت حذف شده باشد.
- [ ] environment روی حالت تصمیم‌گرفته‌شده باشد.
- [ ] bridge موقت ناخواسته commit نشود.
- [ ] token واقعی یا حساس commit نشود.
- [ ] TODO و REPORT آپدیت باشند.

### 18.2 قبل از Demo به لید

- [ ] Dashboard باز شود.
- [ ] Tasks باز شود.
- [ ] list taskها نمایش داده شود.
- [ ] modal create باز شود.
- [ ] validation کار کند.
- [ ] project/service/contract dropdownها کار کنند.
- [ ] edit modal باز شود.
- [ ] delete confirm کار کند.
- [ ] known limitations آماده توضیح باشند:
  - static mock persistence
  - CORS
  - service/contract prefill
  - unread binding

---

## 19. مرور آموزشی مفاهیم کلیدی

### 19.1 Service چیست؟

Service محل ارتباط با API است. Component نباید URL و HttpClient logic را پخش کند.

### 19.2 Component چه کاری می‌کند؟

Component state را مدیریت می‌کند، service را صدا می‌زند و داده آماده را به template می‌دهد.

### 19.3 Template چه کاری می‌کند؟

Template باید نمایش دهد، نه اینکه منطق سنگین داشته باشد.

### 19.4 Empty و Error چه فرقی دارند؟

```txt
Empty → API موفق بوده، داده‌ای برای نمایش نیست
Error → request شکست خورده است
```

### 19.5 Reactive Form چرا مهم است؟

برای فرم‌های جدی، Reactive Form validation، values، disabled، touched و submit را یکجا مدیریت می‌کند.

### 19.6 Payload Mapping چیست؟

فرم همیشه دقیقاً شکل API نیست. باید داده UI به شکل API تبدیل شود.

### 19.7 Cascading Dropdown چیست؟

Dropdownهایی که به هم وابسته‌اند:

```txt
project → services/contracts
```

### 19.8 Refetch after mutation چیست؟

بعد از create/update/delete دوباره list را از backend می‌گیریم تا backend منبع اصلی حقیقت بماند.

### 19.9 Optimistic Update چیست؟

قبل از تایید backend، UI را فرضاً آپدیت می‌کنیم. سریع است ولی پیچیده‌تر و پرریسک‌تر است.

### 19.10 CORS چیست؟

CORS محدودیت امنیتی مرورگر است. اگر سرور اجازه ندهد، Angular نمی‌تواند response را بخواند حتی اگر سرور 200 بدهد.

---

## 20. سوال‌های آموزشی برای تثبیت یادگیری

1. چرا `tasksState` و `mutationState` را جدا کردیم؟
2. چرا برای delete از `deletingTaskId` استفاده کردیم؟
3. چرا `taskForm.getRawValue()` را مستقیم به API نفرستادیم؟
4. چرا بعد از create/update/delete دوباره `loadTasks()` می‌زنیم؟
5. چرا API فیک static باعث می‌شود task جدید بعد از ثبت دیده نشود؟
6. چرا service/contract قبل از انتخاب project قابل load نیستند؟
7. چرا response مستقیم route بهتر از contract wrapper است؟
8. چرا proxy فقط وقتی کار می‌کند که URL relative باشد؟
9. فرق Mock داخلی، Contract API و Mock API قابل مصرف چیست؟
10. چه زمانی می‌توانیم بگوییم یک endpoint واقعاً connected است؟

---

## 21. پرامپت کامل برای شروع چت جدید

این بخش را می‌توانی کامل در چت جدید کپی کنی.

```md
سلام. من روی پروژه WTT Frontend کار می‌کنم و می‌خوام از همین نقطه ادامه بدیم. لطفاً نقش یک استاد حرفه‌ای Angular/Frontend را داشته باش، مرحله‌به‌مرحله راهنمایی کن، زیاد کد آماده نده مگر وقتی لازم است، و بعد از هر بخش از من سوال آموزشی بپرس تا مطمئن بشی یاد گرفتم.

# وضعیت من

من کارآموز شرکت برنامه‌نویسی هستم و دارم پروژه WTT را با Angular بازطراحی می‌کنم. می‌خوام فقط کار را انجام ندهم؛ می‌خوام اصولی یاد بگیرم. هر جا مفهومی مثل service، state، lifecycle، reactive form، API mapping، CORS، proxy، interceptor، payload یا mutation مطرح شد، ساده و دقیق توضیح بده.

# پروژه چیست؟

WTT یک سیستم مدیریت کارکرد/وظایف/حضور است. هدف بلندمدت آن فقط ثبت ساعت نیست؛ می‌خواهد بین developer، task، GitLab/Jira، team lead، HR و management یک لایه هوشمند بسازد.

MVP فعلی روی دو صفحه متمرکز است:

1. Dashboard
2. Tasks

# استک فنی

- Angular 21.2.x
- Standalone Components
- Zoneless + Signals
- Tailwind CSS 4.2.x + SCSS
- date-fns-jalali
- provideHttpClient(withFetch())
- echarts + ngx-echarts
- Reactive Forms برای Task Modal
- State pattern: signal<ApiState<T>>

# ساختار معماری

الگوی اصلی پروژه:

Model → Service → State → Load Method → Template Binding

Service فقط API را مدیریت می‌کند.
Component state و mapping را مدیریت می‌کند.
Template فقط نمایش می‌دهد.

Feature-first رعایت شده:
DashboardService داخل feature/dashboard/services است.
TasksService داخل feature/tasks/services است.

# Branchهای انجام‌شده

## Branch 001 — workspace and core

- workspace ساخته شد
- Angular standalone setup شد
- Tailwind v4 setup شد
- date-fns-jalali نصب شد
- ساختار core/shared/features آماده شد

## Branch 002 — auth and security

- provideHttpClient(withFetch()) فعال شد
- zoneless + signals فعال شد
- authInterceptor ساخته شد
- errorInterceptor ساخته شد
- AuthService ساخته شد
- userId از URL حذف شد برای کاهش ریسک IDOR
- login واقعی هنوز نداریم

## Branch 003 — ui layout and theme

- Header، Sidebar، Left Sidebar ساخته شدند
- Theme toggle ساخته شد
- Light/Dark Mode با CSS variables و Signals آماده شد
- LayoutService برای context-aware UI ساخته شد

## Branch 004 — dashboard widgets

- Dashboard static UI ساخته شد
- KPI cards، نمودارها، اطلاعیه‌ها و recent activities ساخته شدند
- بعدها ECharts جایگزین chartهای static/SVG شد

## Branch 005 — tasks and presence UI

- Task Command Center ساخته شد
- task rows، status rails، smart filters و actionهای اولیه ساخته شدند
- Header/LeftSidebar بر اساس صفحه تغییر کردند
- Presence واقعی به آینده منتقل شد

## Branch 006 — api contracts and data foundation

- environment.ts و environment.development.ts ساخته شدند
- models ساخته شدند: user, dashboard, task, project, api-state
- dashboard.contract.json و tasks.contract.json ساخته شدند
- temporaryUserId و temporary token strategy مشخص شد

## Branch 007 — dashboard api integration

- DashboardService ساخته شد
- getStats, getPieChart, getLineChart, getUnreadMessages اضافه شدند
- statsState, lineChartState, pieChartState ساخته شدند
- KPI cards data-driven شدند
- ECharts برای pie/line chart استفاده شد
- loading/error/empty state اضافه شد
- Mock Mode اضافه شد

## Branch 008 — tasks read and filter integration

- TasksService ساخته شد
- getTasks وصل شد
- tasksState ساخته شد
- task rows داینامیک شدند
- pagination با meta پیاده شد
- quick filters اضافه شدند
- range filter از API query استفاده می‌کند
- status filter فعلاً client-side است چون backend status query رسمی نداده
- loading/error/empty state آماده شد

## Branch 009 — tasks mutation and smart form

- createTask, updateTask, deleteTask اضافه شدند
- getProjects و getProjectDetails اضافه شدند
- Reactive Form ساخته شد
- Task Modal ساخته شد
- create mode و edit mode ساخته شدند
- submitTaskForm وصل شد
- buildTaskPayload ساخته شد
- duration از start_time/end_time حساب می‌شود
- project dropdown داینامیک شد
- service/contract dropdownها cascading شدند
- delete flow با deletingTaskId ساخته شد
- CORS/proxy/contract API تست شد

# وضعیت Dashboard

Dashboard frontend-ready است:

- serviceها آماده‌اند
- stateها آماده‌اند
- ECharts وصل است
- loading/error/empty state داریم

اما اتصال واقعی فقط وقتی connected حساب می‌شود که endpoint مستقیم، response درست، CORS درست و Network 200 OK داشته باشیم.

# وضعیت Tasks

Tasks از نظر frontend کامل‌تر است:

- list
- pagination
- filters
- create
- edit
- delete
- modal
- reactive form
- project/service/contract dropdown
- payload mapping

محدودیت فعلی:
اگر mock API فقط JSON ثابت return کند، بعد از create/update/delete، GET بعدی تغییر را نشان نمی‌دهد. این مشکل frontend نیست؛ mock/backend باید persistence داشته باشد.

# APIهای مهم

Dashboard:
GET /api/v1/users/a_user_details/?user=273&range=month_till_today
GET /api/v1/dashboard/pie_chart/?user=273&range=month_till_today
GET /api/v1/dashboard/line_chart/?user=273&range=month_till_today
GET /api/v1/news/get_message_data/?state=unread_count

Tasks:
GET /api/v1/tasks/?user=273&page=1&range=month_till_today
GET /api/v1/tasks/summary/?user=273&range=today
GET /api/v1/projects/get_all_projects/
GET /api/v1/projects/project_details/?project=30
POST /api/v1/tasks/
PUT /api/v1/tasks/{id}/
DELETE /api/v1/tasks/{id}/

# تصمیم‌های API

project_details query فعلاً project=30 است.
Task list باید در حالت ایده‌آل project_title, location, start_time, end_time بدهد.
برای edit کامل بهتر است project_service و project_contract هم در response یا task detail endpoint باشد.

# تجربه API/CORS

ما فهمیدیم:

- contract endpoint مثل /taskscontract/ فقط documentation/spec است.
- API مصرفی frontend باید route نهایی داشته باشد و response مستقیم بدهد.
- اگر response داخل wrapper باشد، مجبور می‌شویم map موقت بزنیم.
- CORS را موقتاً با proxy یا browser extension دور زدیم.
- راه درست CORS، تنظیم سمت سرور است.
- proxy فقط وقتی کار می‌کند که URL relative باشد مثل /mock-api/api/v1/tasks.

# مسیر آینده پیشنهادی

Branch بعدی بهتر است:
feature/010-api-stabilization-and-real-mock-verification

هدف این branch:

- تثبیت routeهای مستقیم
- حذف bridge موقت contract
- تست response shape
- تست CORS یا proxy تصمیم‌گرفته‌شده
- تست persistence create/update/delete
- verify کردن Dashboard و Tasks با mock API قابل مصرف

بعد از آن:
feature/011-presence-and-timer-integration
feature/012-task-form-polish-and-detail-prefill
feature/013-dashboard-sidebar-and-notifications-data
feature/014-two-page-polish-and-lead-demo
feature/015-auth-login-and-profile-hardening

# اگر مسیر طبق برنامه پیش نرفت

اگر route مستقیم wrapper داد:

- موقتاً map نزن مگر فقط برای تست
- از لید بخواه هر route فقط JSON خودش را return کند

اگر CORS خراب بود:

- برای dev از proxy استفاده کن
- extension فقط شخصی و موقت است

اگر create موفق شد ولی list تغییر نکرد:

- یعنی mock API persistence ندارد
- frontend flow درست است ولی backend/mock server باید state ذخیره کند

اگر edit کامل prefill نشد:

- task list باید project_service/project_contract بدهد
- یا endpoint GET /api/v1/tasks/{id}/ لازم است

# سبک پاسخ مورد انتظار

لطفاً:

- مرحله‌به‌مرحله جلو برو
- قبل از کد دلیل تغییر را توضیح بده
- بعد از هر قدم یک یا چند سوال آموزشی بپرس
- زیاد کد آماده نده مگر لازم باشد
- مسیر درست معماری را حفظ کن
- تغییرات موقت مثل contract bridge یا CORS extension را از مسیر نهایی جدا نگه دار

اول کار از Branch 010 شروع کن و قبل از هر کدی بگو دقیقاً هدف branch چیست، چه فایل‌هایی باید بررسی شوند، چه چیزهایی نباید commit شوند، و چطور endpointها را verify می‌کنیم.
```

---

## 22. جمع‌بندی نهایی

پروژه الان از حالت UI-only خارج شده و به یک فرانت‌اند جدی با service/state/form/API architecture رسیده است.

مهم‌ترین نتیجه تا اینجا:

```txt
Dashboard و Tasks از نظر frontend structure آماده‌اند.
Tasks حتی create/edit/delete flow دارد.
باقی ریسک اصلی، backend/mock API قابل مصرف، CORS و persistence است.
```

مسیر درست بعدی:

```txt
اول API را تثبیت کن
بعد Presence/Timer را بساز
بعد فرم‌ها و dashboard side data را polish کن
بعد demo به لید آماده کن
بعد login واقعی را کامل کن
```

## مسیر جدید پروژه بعد از تصمیم اتصال به WTT واقعی

بعد از پایان `feature/009-tasks-mutation-and-smart-form`، مسیر پروژه تغییر کرد. در مسیر قبلی تمرکز روی mock API، contract adapter، CORS workaround و fake persistence بود. اما طبق تصمیم جدید لید، توسعه باید بر اساس حساب واقعی WTT، base URL واقعی و APIهای واقعی نسخه v1 ادامه پیدا کند.

بنابراین اولویت پروژه از `mock/contract stabilization` به `real authentication foundation` تغییر کرد.

مسیر جدید:

````txt
Real WTT Login
→ Real Token
→ Real Auth State
→ Real Profile
→ Real User ID
→ Real Read APIs
→ Safe Mutations
→ Presence Read-only
→ Safe Presence Mutations
→ Mock Cleanup
→ Full WTT Frontend
دلیل تغییر مسیر

تا وقتی login واقعی و token واقعی نداشته باشیم، اتصال APIها کامل و قابل اعتماد نیست. در نسخه قبلی پروژه، temporary token و temporaryUserId استفاده می‌شدند. این برای توسعه اولیه قابل قبول بود، اما برای اتصال واقعی به WTT باید حذف شود.

اصول جدید توسعه
Auth-first
ابتدا login واقعی، token واقعی و profile واقعی پیاده‌سازی می‌شود. بدون auth واقعی، هیچ API اصلی نهایی محسوب نمی‌شود.
Read-before-write
ابتدا همه APIهای GET وصل و verify می‌شوند. Mutationها مثل create/update/delete بعداً و فقط با داده تستی کنترل‌شده تست می‌شوند.
No unsafe mutation
هیچ task واقعی کاری، هیچ حضور واقعی، و هیچ داده مهمی نباید برای تست update/delete شود.
Test data must be obvious
هر task تستی باید با prefix مشخص ساخته شود:
[FRONTEND-TEST-DO-NOT-APPROVE]
Rollback note required
هر mutation واقعی باید قابل پیگیری و برگشت باشد:
task id، زمان ساخت، زمان ویرایش، وضعیت حذف/پاکسازی.
No token in source code
token واقعی نباید در environment, service, interceptor یا commit ذخیره شود. token فقط در state/runtime یا storage موقت dev نگهداری می‌شود.
Component remains source-agnostic
component نباید بداند داده از mock آمده یا API واقعی. Component فقط state و UI را مدیریت می‌کند. Service مسئول ارتباط با API است.
Service owns API communication
همه requestها باید داخل serviceها باشند. URL و HttpClient نباید در component پخش شوند.
Models protect contracts
responseهای واقعی باید با modelها مقایسه شوند. اگر API response با model نمی‌خواند، ابتدا mismatch ثبت می‌شود، بعد تصمیم گرفته می‌شود model اصلاح شود یا adapter لازم است.
Error must be visible
اگر API خطا داد، نباید بی‌صدا mock data نمایش داده شود. خطا باید در UI state یا گزارش branch مشخص شود.
Mock cleanup is gradual
mockها یک‌دفعه حذف نمی‌شوند. هر service فقط وقتی mock آن حذف می‌شود که API واقعی همان بخش verify شده باشد.
Presence is high risk
APIهای presence روی حضور واقعی اثر می‌گذارند. بنابراین ابتدا فقط read-only presence وصل می‌شود و clock-in/clock-out واقعی در branch جدا و با اجازه انجام می‌شود.
وضعیت جدید branchها

Branch 010 از api-stabilization-and-real-mock-verification به real-auth-and-safe-v1-api-foundation تغییر کرد.

Branchهای بعدی به ترتیب روی Dashboard real read، Tasks real read، safe task mutation، profile/header real data، presence read-only و سپس safe presence mutation تمرکز می‌کنند.

معیار connected واقعی

یک endpoint فقط وقتی connected واقعی محسوب می‌شود که:

1. request از Angular با HttpClient ارسال شود
2. token درست روی request بنشیند
3. Network status موفق باشد
4. response shape با model frontend بخواند
5. UI با همان response پر شود
6. error/loading/empty state درست کار کند
7. ریسک read/write آن در branch report ثبت شود
نتیجه

از این نقطه به بعد، پروژه WTT Frontend از حالت mock-driven به real-api-driven منتقل می‌شود. هدف نهایی این است که تمام صفحه‌های اصلی WTT با auth واقعی، profile واقعی، dashboard واقعی، task واقعی، presence واقعی و بعداً intelligence/automation واقعی کار کنند، بدون اینکه اصول امنیت، auditability و ایمنی داده‌های واقعی نقض شود.


---

# 4. اصولی که تا آخر پروژه باید رعایت کنیم

این‌ها قانون‌های ثابت ما هستند:

## قانون ۱ — اول Auth، بعد API

هیچ feature واقعی را کامل حساب نمی‌کنیم تا وقتی:

```txt
login واقعی
token واقعی
profile واقعی
userId واقعی

داشته باشیم.

الان AuthService فعلی هنوز URL هاردکد placeholder دارد و فقط fetchProfile(userId) را می‌زند؛ پس باید اول این را درست کنیم.

قانون ۲ — اول GET، بعد Mutation

APIهایی مثل این‌ها کم‌خطرترند:

GET /profile/
GET /tasks/
GET /projects/get_all_projects/
GET /dashboard/line_chart/

ولی این‌ها خطرناک‌اند:

POST /tasks/
PUT /tasks/{id}/
DELETE /tasks/{id}/
POST /presence/
PUT /presence/{id}/

چون روی داده واقعی اثر می‌گذارند.

قانون ۳ — token واقعی هرگز commit نمی‌شود

توکن نه در این فایل‌ها:

environment.ts
auth.interceptor.ts
auth.service.ts
README.md
REPORT.md
TODO.md

نه در screenshot، نه در پیام، نه در کامنت.

قانون ۴ — mockها مرحله‌ای جمع می‌شوند

Mock را فقط وقتی حذف می‌کنیم که API واقعی همان بخش verified شده باشد.

مثلاً:

Dashboard stats real شد → mock stats حذف
Tasks list real شد → mock tasks list حذف
Projects real شد → mock projects حذف
Mutation real شد → fake mutation حذف
قانون ۵ — component را شلوغ نمی‌کنیم

Component فقط:

state
loading/error
فرم
UI flow

Service فقط:

API call
HttpParams
payload ارسال
response type
````

---

## Branch 011 — `feature/011-dashboard-real-read-finalization`

### هدف Branch

هدف این branch نهایی‌سازی داده‌های read-only داشبورد و سایدبار بود؛ یعنی حذف مقدارهای static باقی‌مانده، اتصال dashboard widgets به APIهای واقعی WTT v1، و آماده‌سازی صفحه Dashboard برای ادامه مسیر real-api-driven.

این branch هیچ mutation واقعی انجام نداد و فقط روی GET/read-only APIها تمرکز داشت.

---

### کارهای انجام‌شده

#### 1. تکمیل اتصال Dashboard Read APIs

APIهای اصلی dashboard به مسیرهای واقعی WTT v1 متصل و verify شدند:

- `GET /api/v1/dashboard/a_user_details`
- `GET /api/v1/dashboard/profile`
- `GET /api/v1/dashboard/line_chart`
- `GET /api/v1/dashboard/pie_chart`

از این APIها برای KPI cards، profile summary، line chart و project distribution استفاده شد.

---

#### 2. اصلاح مسیر و range آمار سایدبار

در ابتدا برای آمار سایدبار از `range=today` استفاده شد، اما با مقایسه Network در WTT اصلی مشخص شد که:

- `profile?range=today` می‌تواند مقدارهایی مثل `presences_time: 0` و `total_randeman: 0` برگرداند.
- WTT اصلی برای نمایش آمار معنادار dashboard از `range=month_till_today` استفاده می‌کند.

بنابراین تصمیم نهایی:

```txt
Sidebar stats range = month_till_today

و عنوان UI از «آمار امروز» به «آمار ماه جاری» یا «آمار بازه» تغییر کرد.

3. تکمیل News / Announcements

اطلاعیه‌های عمومی و شخصی به API واقعی وصل شدند:

GET /api/v1/news/get_message_data/?range=month_till_today&type=public&page=1&state=all
GET /api/v1/news/get_message_data/?range=month_till_today&type=private&page=1&state=all

برای private announcements، empty state هم در نظر گرفته شد، چون response واقعی می‌تواند این شکل باشد:

{
  "count": 0,
  "results": [],
  "next": null,
  "previous": null
}

همچنین notification badge از unread count قابل تغذیه شد:

GET /api/v1/news/get_message_data/?state=unread_count
4. تکمیل Project Distribution Sidebar

نمودار توزیع پروژه‌ها در سایدبار از API واقعی استفاده می‌کند:

GET /api/v1/dashboard/pie_chart?user=<id>&range=month_till_today

برای جلوگیری از hardcode، raw pie chart response جدا از ECharts option نگهداری شد و legend به صورت dynamic ساخته شد.

تصمیم معماری:

raw API response → legend / percent calculation
EChartsOption → فقط chart rendering

این کار باعث شد رنگ chart و legend هم‌خوان بماند و UI وابسته به ساختار داخلی ECharts نشود.

5. Recent Activities از حالت static خارج شد

لیست فعالیت‌های اخیر دیگر نباید static باشد. تا زمانی که endpoint اختصاصی recent activities پیدا شود، از latest tasks fallback استفاده می‌شود:

GET /api/v1/tasks/?range=month_till_today&page=1

این تصمیم در API reference هم قابل دفاع است، چون برای Dashboard recent activities می‌توان موقتاً از latest tasks استفاده کرد تا endpoint اختصاصی پیدا شود.

6. Header / Sidebar Profile Data

Profile/name/avatar از داده واقعی auth/profile/dashboard profile وارد UI شد. هدف این بود که static placeholderهای کاربر کم‌کم حذف شوند و user data از AuthService یا Dashboard profile flow بیاید.

7. Logout واقعی

دکمه خروج layout به AuthService logout flow متصل شد:

پاک کردن token/session state
پاک کردن current user
برگشت به login route
8. پاکسازی CSS و UI Polish
دکمه جداگانه حضور حذف شد و خود presence orb تعامل‌پذیر شد.
hover حضور نرم‌تر و 3Dتر شد.
کارت latest task ساده‌تر شد.
دکمه‌های تکراری play/stop حذف شدند.
legend توزیع پروژه‌ها dynamic شد.
CSSهای تکراری تا حد ممکن پاکسازی شدند.
console logهای اضافه حذف شدند یا برای حذف نهایی علامت‌گذاری شدند.
APIهای Verify شده در این Branch
GET /api/v1/dashboard/a_user_details
GET /api/v1/dashboard/profile
GET /api/v1/dashboard/line_chart
GET /api/v1/dashboard/pie_chart
GET /api/v1/news/get_message_data/?type=public
GET /api/v1/news/get_message_data/?type=private
GET /api/v1/news/get_message_data/?state=unread_count
GET /api/v1/news/messages_count/
GET /api/v1/tasks/
GET /api/v1/tasks/tasks_count/
تصمیم‌های مهم فنی
تصمیم ۱ — Dashboard summary از month_till_today

چون WTT اصلی مقدارهای dashboard summary را با month_till_today نمایش می‌دهد، sidebar stats هم همین range را استفاده می‌کند.

تصمیم ۲ — Recent activities موقتاً از latest tasks

تا وقتی endpoint اختصاصی recent activity پیدا نشده، latest task list به عنوان fallback استفاده می‌شود.

تصمیم ۳ — No real mutation

این branch کاملاً read-only ماند. هیچ create/update/delete واقعی اضافه یا تست نشد.

تصمیم ۴ — Component همچنان source-agnostic

Component نباید بداند داده از mock آمده یا API واقعی. Service مسئول API call است و component فقط state و UI flow را مدیریت می‌کند.

ریسک‌ها و موارد منتقل‌شده به Branch بعدی

موارد زیر عمداً به Branchهای بعدی منتقل شدند:

تکمیل read integration کامل صفحه Tasks
verify کامل GET /api/v1/project/get_all_projects/
verify کامل GET /api/v1/projects/project_details/
بررسی query param درست project details: id یا project
حذف کامل contract adapter از TasksService بعد از real verification
mutation واقعی taskها فقط در branch جدا و با test data مشخص
clock-in / clock-out واقعی فقط بعد از اجازه و branch جدا
نتیجه Branch

Branch 011 داشبورد و سایدبار را از نظر read-only real API نهایی کرد. صفحه Dashboard حالا به داده‌های واقعی WTT v1 وصل است، مقدارهای static اصلی حذف شده‌اند، و مسیر پروژه برای ورود به Branch 012 یعنی real tasks read integration آماده است.

Status: Done
Safe Rule: رعایت شد
Real Mutation: انجام نشد
Next Branch: feature/012-tasks-real-read-integration
```
