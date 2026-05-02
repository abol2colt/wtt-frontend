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

**// Branch: feature/003-layout-and-routing**

- [ ] Design main layout shell (Sidebar, Top Navigation Header, Main Viewport).
- [ ] Implement responsive behavior for the sidebar using Tailwind utility classes.
- [ ] Configure lazy-loaded routing modules (`/dashboard`, `/tasks`, `/presence`).
      // پوسته اصلی برنامه طراحی شده و مسیریابی بهینه‌سازی می‌شود تا ماژول‌های سنگین‌تر فقط زمان نیاز لود شوند (Lazy Loading).

**// Branch: feature/004-dashboard-metrics**

- [ ] Integrate chart library (e.g., Chart.js or ECharts).
- [ ] Create Pie Chart component fetching data from `/api/v1/dashboard/pie_chart/`.
- [ ] Create Line Chart component fetching data from `/api/v1/dashboard/line_chart/`.
- [ ] Create `computed` properties tied to signals to dynamically calculate overall efficiency and overtime from `a_user_details`.
- [ ] Design structural placeholders for future GitLab/Jira statistic widgets.
      // نمودارهای داشبورد و آمار کارکرد پیاده‌سازی می‌شوند و متغیرهای محاسبه‌شده برای نمایش در لحظه‌یِ درصدها آماده می‌شوند. جایگاه ابزارک‌های آینده نیز در UI رزرو می‌شود.

**// Branch: feature/005-task-management-crud**

- [ ] Implement task list data-table component with server-side pagination (`/api/v1/tasks/`).
- [ ] Build cascading dropdowns (Projects -> Services -> Contracts) calling respective `/project_details/` endpoints.
- [ ] Develop Task Creation form ensuring rigorous validation for required payload fields.
- [ ] Develop Task Edit/Delete flows.
- [ ] Add visual mock badge for the "Reviewer" feature on task cards.
      // سیستم کامل مدیریت وظایف شامل ساخت، ویرایش و حذف به همراه لیست‌های کشویی وابسته برای انتخاب دقیق پروژه‌ها ساخته می‌شود.

**// Branch: feature/006-presence-timer**

- [ ] Create a real-time visual timer component.
- [ ] Call `no_end_time_presence` on initialization to sync the timer with an active session.
- [ ] Implement "Clock In" button dispatching exact local time payload.
- [ ] Implement "Clock Out" logic for presence termination.
      // تایمر حضور و غیاب بر اساس منطق فعلی بک‌اند ساخته می‌شود که توانایی همگام‌سازی زمان کلاینت با دیتابیس سرور را دارد.

**// Branch: feature/007-realtime-orchestration-prep**

- [ ] Create `connection-orchestration.service` to act as a manager for real-time updates.
- [ ] Set up notification polling (or prepare WebSocket listeners) for `get_message_data` to check for AI logs.
- [ ] Design the UI notification toast/badge that will trigger when a task transitions to "Pending" via AI.
      // سرویس مدیریت ارتباطات برای دریافت لحظه‌ای اعلان‌ها (مخصوصاً برای زمانی که هوش مصنوعی تسک جدید می‌سازد) آماده می‌شود تا با معماری آینده سازگار باشد.

**// Branch: refactor/008-review-and-mock-tests**

- [ ] Audit component logic to ensure all observables/signals are properly cleaned up to prevent memory leaks.
- [ ] Test layout responsiveness with simulated (Mock) data mimicking AI-generated Markdown logs.
- [ ] Verify timezone strictness across all POST/PUT requests.
      // کدها ریویو می‌شوند تا از عملکرد بهینه حافظه اطمینان حاصل شود. همچنین رفتار UI در هنگام دریافت متون طولانی (تولید شده توسط هوش مصنوعی) شبیه‌سازی و تست می‌گردد.
