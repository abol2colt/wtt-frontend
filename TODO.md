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

- [ ] Design static stat cards (Total Work, Overtime, etc.) with mock data.
- [ ] Integrate ECharts or Chart.js and render static Mock Pie Chart.
- [ ] Render static Mock Line Chart for performance trends.
- [ ] Build the UI placeholder for the future AI/GitLab integration widgets.
      // در این برنچ، صفحه داشبورد با کارت‌های آماری زیبا و نمودارهای نمایشی (بدون اتصال به بک‌اند) طراحی می‌شود تا ظاهر صفحه کاملاً شبیه به عکس‌های طراحی شده دربیاید.

**// Branch: feature/005-ui-tasks-and-presence**

- [ ] Design the Tasks Data-Table with static rows and pagination UI.
- [ ] Design the "Create Task" modal/form with static cascading dropdowns.
- [ ] Design the Presence Timer widget (static UI with mock "00:00:00" display).
- [ ] Add static visual badges for task status and the future "Reviewer" feature.
      // بخش‌های مدیریت وظایف (جداول و فرم‌ها) و ظاهر تایمر حضور و غیاب بدون درگیر شدن با منطق فرم‌ها و فقط با استفاده از کلاس‌های Tailwind پیاده‌سازی می‌شوند.

**// Branch: feature/006-logic-state-and-dashboard**

- [ ] Connect Theme Toggle to global Signal state and local storage.
- [ ] Fetch real data from `/api/v1/users/a_user_details/` and populate stat cards.
- [ ] Connect Pie Chart and Line Chart to their respective backend endpoints.
      // از این برنچ فاز منطق آغاز می‌شود. کامپوننت‌های استاتیک داشبورد زنده شده و داده‌های واقعی کاربر را از سرویس‌ها دریافت و نمایش می‌دهند.

**// Branch: feature/007-logic-tasks-crud**

- [ ] Implement reactive forms logic for Task Creation/Edit.
- [ ] Connect Cascading Dropdowns to `/api/v1/projects/project_details/`.
- [ ] Connect Task Data-Table to `/api/v1/tasks/` with server-side pagination.
      // فرم‌ها و جداول وظایف که در فاز UI ساخته شده بودند، حالا به API متصل شده و قابلیت ثبت، ویرایش و حذف واقعی پیدا می‌کنند.

**// Branch: feature/008-logic-presence-timer**

- [ ] Implement real-time interval logic for the visual timer.
- [ ] Connect "Clock In" and "Clock Out" buttons to the backend payload.
- [ ] Handle timezone strictness (`Asia/Tehran`) using `date-fns-jalali` before payload submission.
      // منطق پیچیده تایمر حضور و غیاب و ارسال دقیق زمان‌ها به سرور به کامپوننت نمایشی تایمر متصل می‌گردد.

---
