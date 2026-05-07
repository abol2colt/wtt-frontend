**// Branch: feature/001-workspace-and-core**

- [x] Initialize frontend workspace and configure VS Code settings (Prettier, ESLint).
- [x] Install and configure Tailwind CSS and base SCSS architecture (variables, typography).
- [x] Install `date-fns-jalali` and create a global date helper utility (`YYYY-MM-DD HH:MM:SS` in `Asia/Tehran`).
- [x] Create core HTTP service and `HttpInterceptor` for handling base URLs.
      // در این برنچ، پیکربندی پایه محیط توسعه، ابزارهای استایل‌دهی و کتابخانه تاریخ جلالی به همراه تایم‌زون ست می‌شود و سرویس پایه برای ارسال درخواست‌ها ساخته می‌شود.

**// Branch: feature/002-auth-and-security**

- [x] Create `AuthService` to fetch user profile via `GET /api/v1/profile/`.
- [x] Implement Token Interceptor to automatically inject `Authorization: Token <key>`.
- [x] Set up global application state (using signals) to safely store the authenticated user ID.
- [x] Implement global error handler logic for `401 Unauthorized` and `403/503` codes.
- [x] Refactor routing to eliminate user ID from URLs (Enforcing Zero Client Trust).
      // سیستم احراز هویت و مدیریت خطاهای شبکه (مثل 401 و 403) راه‌اندازی می‌شود. با استفاده از مدیریت وضعیت سراسری، آیدی کاربر از URLها حذف می‌شود تا جلوی باگ IDOR در سطح کلاینت گرفته شود.

**// Branch: feature/003-ui-layout-and-theme**

- [x] Configure Tailwind CSS for Dark Mode support (class strategy).
- [x] Design the main application shell (Sidebar navigation, Top Header).
- [x] Create a reusable Theme Toggle button (Light/Dark switcher).
- [x] Ensure layout responsiveness (mobile, tablet, desktop) using Tailwind utility classes.
      // در این برنچ، اسکلت اصلی قالب (سایدبار و هدر) دقیقاً مطابق با طراحی‌های جدید به صورت کاملاً استاتیک پیاده‌سازی می‌شود و سیستم تغییر تم (تاریک/روشن) راه‌اندازی می‌گردد.

**// Branch: feature/004-ui-dashboard-widgets**

- [x] Design static stat cards (Total Work, Overtime, etc.) with mock data.
- [x] Integrate ECharts or Chart.js and render static Mock Pie Chart.
- [x] Render static Mock Line Chart for performance trends.
- [x] Build the UI placeholder for the future AI/GitLab integration widgets.
      // در این برنچ، صفحه داشبورد با کارت‌های آماری زیبا و نمودارهای نمایشی (بدون اتصال به بک‌اند) طراحی می‌شود تا ظاهر صفحه کاملاً شبیه به عکس‌های طراحی شده دربیاید.

**// Branch: feature/005-ui-tasks-and-presence**

- [x] Build Task Command Center layout with smart filters and inline actions (Play/Stop timer).
- [x] Implement Global `LayoutService` using Signals for context-aware Headers and Sidebars.
- [x] Add static visual badges for task status and the future "Reviewer" feature.
- [ ] Design the Presence Timer widget (static UI with mock "00:00:00" display).
- [ ] Add static visual badges for task status and the future "Reviewer" feature.
      // مرکز فرماندهی وظایف و سیستم رادار هوشمند سایدبارها پیاده‌سازی شد. بخش‌های فرم‌ساز و صفحه حضور به برنچ بعدی منتقل شدند.

  **// Branch: feature/006-api-contracts-and-data-foundation**

- [x] Verify installed package versions from `package-lock.json`.
- [x] Add a note that current Angular version is 21.2.x, not 22.
- [x] Create API environment files: - `src/environments/environment.ts` - `src/environments/environment.development.ts`
- [x] Move hardcoded backend base URL out of `AuthService`.
- [x] Create shared API model files: - `src/app/shared/models/user.model.ts` - `src/app/shared/models/dashboard.model.ts` - `src/app/shared/models/task.model.ts` - `src/app/shared/models/project.model.ts` - `src/app/shared/models/api-state.model.ts`
- [x] Create API contract JSON samples for lead: - `src/assets/contracts/dashboard.contract.json` - `src/assets/contracts/tasks.contract.json`
- [x] Normalize route path from `Tasks` to `tasks`.
- [x] Decide temporary user-id strategy for current backend APIs.
- [x] Decide temporary token strategy until real login is implemented.
- [x] Write branch report with: - installed packages - API assumptions - created models - JSON contracts - technical debt list

      // این برنچ برای آماده‌سازی فاز اتصال واقعی API است.
      // در این مرحله هنوز داشبورد و تسک‌ها را کامل به API وصل نمی‌کنیم؛ اول مدل داده، environment، قرارداد JSON و ساختار تمیز سرویس‌ها آماده می‌شود.

---

**// Branch: feature/007-dashboard-api-integration**

- [ ] Create `DashboardService` for dashboard-related APIs.
- [ ] Move dashboard API calls out of `DashboardComponent`.
- [ ] Fetch dashboard stats from `/api/v1/users/a_user_details/`.
- [ ] Fetch pie chart data from `/api/v1/dashboard/pie_chart/`.
- [ ] Fetch line chart data from `/api/v1/dashboard/line_chart/`.
- [ ] Fetch unread message counts from `/api/v1/news/get_message_data/`.
- [ ] Create dashboard page state using `ApiState`.
- [ ] Replace mock KPI card values with real API data.
- [ ] Keep current SVG chart UI for now and prepare data mapping only.
- [ ] Add loading state for dashboard cards.
- [ ] Add error state for failed dashboard APIs.
- [ ] Add empty state for empty chart responses.
- [ ] Write branch report with API mapping and remaining mock sections.
- [ ] Implement Environment-based Mock Mode for independent UI development.

      // در این برنچ داشبورد از حالت استاتیک خارج می‌شود و داده‌های اصلی آن از API خوانده می‌شود.
      // هنوز chart library نصب نمی‌کنیم؛ اول data flow، service، state و mapping را اصولی می‌چینیم.

  **// Branch: feature/008-tasks-read-and-filter-integration**

- [ ] Create `TasksService`.
- [ ] Connect `/api/v1/tasks/` to task list.
- [ ] Implement server-side pagination based on API `meta`.
- [ ] Replace static task rows with dynamic rendering.
- [ ] Map backend task statuses to UI status rails and badges.
- [ ] Connect quick filters to query params/range strategy.
- [ ] Create task summary cards from loaded task data: - today tasks - total duration - pending count - rejected/needs-edit count
- [ ] Add loading skeleton for task rows.
- [ ] Add empty state for no tasks.
- [ ] Add error state with retry action.
- [ ] Write branch report with task response sample and UI mapping table.

        // این برنچ فقط خواندن و نمایش تسک‌ها را واقعی می‌کند.
        // هنوز create/update/delete را وارد نمی‌کنیم تا پیچیدگی فرم‌ها با لیست قاطی نشود.

  **// Branch: feature/009-tasks-mutation-and-smart-form**

- [ ] Design or complete Smart Task Modal UI.
- [ ] Implement Reactive Form for create/edit task.
- [ ] Connect `/api/v1/projects/get_all_projects/` to project dropdown.
- [ ] Connect `/api/v1/projects/project_details/` to service and contract cascading dropdowns.
- [ ] Implement create task using `POST /api/v1/tasks/`.
- [ ] Implement edit task using `PUT /api/v1/tasks/{id}/`.
- [ ] Implement delete task using `DELETE /api/v1/tasks/{id}/`.
- [ ] Validate required fields before submit: - title - project - project_service - project_contract - location - date - start_time - end_time - duration
- [ ] Convert duration/time fields safely before sending payload.
- [ ] Refresh task list after successful mutation.
- [ ] Show success/error feedback.
- [ ] Write branch report with form model, validation rules, and mutation payload samples.

        // در این برنچ صفحه Tasks کامل عملیاتی می‌شود.
        // تمرکز روی فرم، دراپ‌داون‌های زنجیره‌ای، validation، و هماهنگی دقیق با contract بک‌اند است.

  **// Branch: feature/010-presence-and-timer-integration**

- [ ] Create `PresenceService`.
- [ ] Connect `/api/v1/presence/no_end_time_presence/` to detect active presence.
- [ ] Implement Clock In using `POST /api/v1/presence/`.
- [ ] Implement Clock Out using `PUT /api/v1/presence/{id}/`.
- [ ] Implement visual real-time timer based on active presence `start_time`.
- [ ] Format timestamps as `YYYY-MM-DD HH:MM:SS`.
- [ ] Keep timezone/date handling centralized.
- [ ] Prevent double Clock In when active presence exists.
- [ ] Add loading/error states for presence widget.
- [ ] Write branch report with date/time decisions and edge cases.

        // این برنچ حضور و تایمر را به API وصل می‌کند.
        // چون بک‌اند فعلی زمان دقیق را از فرانت می‌خواهد، تمرکز اصلی روی فرمت تاریخ، جلوگیری از ثبت تکراری، و state درست است.

  **// Branch: feature/011-two-page-polish-and-lead-demo**

- [ ] Review Dashboard and Tasks with real API/mock API data.
- [ ] Remove noisy temporary console logs.
- [ ] Remove unnecessary comments and keep only non-obvious logic comments.
- [ ] Check responsive layout for dashboard and tasks.
- [ ] Verify dark/light mode after API integration.
- [ ] Verify all API errors show user-friendly UI.
- [ ] Create final demo checklist for lead.
- [ ] Create final branch report: - what changed - what APIs were used - what JSON contract was sent - what still depends on backend - what is intentionally mocked - next recommended branch

      // این برنچ برای تحویل تمیز به لید است.
      // هدف این است که دو صفحه Dashboard و Tasks قابل دمو، قابل تست و قابل توضیح باشند.
