# TODO — WTT Frontend Roadmap

> وضعیت به‌روزشده بعد از پایان `feature/009-tasks-mutation-and-smart-form`  
> این فایل مسیر آینده را بر اساس تصمیم‌های واقعی پروژه تا امروز مرتب می‌کند.

---

## Legend

- `[x]` انجام شده
- `[~]` انجام شده ولی اتصال/تکمیل نهایی به backend یا UI دیگر مانده
- `[!]` وابسته به backend / CORS / contract / persistence
- `[ ]` انجام نشده

---

## ✅ Branch: `feature/001-workspace-and-core`

- [x] Initialize Angular workspace.
- [x] Configure VS Code / Prettier / ESLint basics.
- [x] Install and configure Tailwind CSS + base SCSS variables.
- [x] Install `date-fns-jalali`.
- [x] Prepare project folder structure: `core`, `shared`, `features`, `state`.
- [x] Prepare basic HTTP/application setup.

**Outcome:** پروژه آماده توسعه featureها شد.

---

## ✅ Branch: `feature/002-auth-and-security`

- [x] Create `AuthService` skeleton/profile flow.
- [x] Implement token interceptor.
- [x] Implement global error interceptor.
- [x] Set up user/auth state using signals.
- [x] Remove user id from visible routes where possible.
- [~] Temporary token is still used until real login is implemented.
- [~] `temporaryUserId` is still used for v1 APIs.

**Outcome:** زیرساخت امنیت و HTTP آماده است، ولی login واقعی هنوز branch جدا می‌خواهد.

---

## ✅ Branch: `feature/003-ui-layout-and-theme`

- [x] Build app shell.
- [x] Build main sidebar.
- [x] Build header.
- [x] Build left sidebar.
- [x] Add dark/light theme toggle.
- [x] Use CSS variables/design tokens.
- [~] Responsive review still needed in final polish.

**Outcome:** پوسته اصلی برنامه آماده شد.

---

## ✅ Branch: `feature/004-ui-dashboard-widgets`

- [x] Build static dashboard KPI cards.
- [x] Build static dashboard chart areas.
- [x] Build announcements/activity placeholders.
- [x] Prepare dashboard visual layout.
- [~] Later replaced chart rendering with ECharts in Branch 007.

**Outcome:** UI اولیه داشبورد آماده اتصال داده شد.

---

## ✅ Branch: `feature/005-ui-tasks-and-presence`

- [x] Build Task Command Center layout.
- [x] Add task rows, visual statuses and inline actions.
- [x] Implement `LayoutService` for context-aware header/sidebar.
- [x] Move task-specific actions into Tasks page instead of global header.
- [~] Presence/timer visual parts exist but real API integration is deferred.
- [~] Play/Stop action is still UI-only until Presence branch.

**Outcome:** صفحه Tasks و context-aware layout آماده شد.

---

## ✅ Branch: `feature/006-api-contracts-and-data-foundation`

- [x] Verify installed package versions from `package-lock.json`.
- [x] Document Angular version as `21.2.x`.
- [x] Create `environment.ts` and `environment.development.ts`.
- [x] Move hardcoded base URL out of services.
- [x] Create shared API models:
  - [x] `api-state.model.ts`
  - [x] `dashboard.model.ts`
  - [x] `task.model.ts`
  - [x] `project.model.ts`
  - [x] `user.model.ts`
- [x] Create initial API contracts for lead.
- [x] Decide temporary user id strategy.
- [x] Decide temporary token strategy.

**Outcome:** پایه data contracts و modelها آماده شد.

---

## ✅ Branch: `feature/007-dashboard-api-integration`

- [x] Create `DashboardService`.
- [x] Move dashboard API calls out of component.
- [x] Add `getStats(userId, range)`.
- [x] Add `getPieChart(userId, range)`.
- [x] Add `getLineChart(userId, range)`.
- [x] Add `getUnreadMessages()`.
- [x] Add `statsState`, `lineChartState`, `pieChartState` with `ApiState`.
- [x] Replace mock KPI values with state-based values.
- [x] Replace static SVG/CSS charts with ECharts.
- [x] Add loading/error/empty states.
- [x] Implement environment-based mock mode.
- [~] Unread messages service exists but final header binding is deferred.
- [!] Real API verification is still dependent on final route responses and CORS.

**Outcome:** Dashboard core data-flow is ready. Real data only needs valid API routes, CORS, and `useMockData: false`.

---

## ✅ Branch: `feature/008-tasks-read-and-filter-integration`

- [x] Create `TasksService`.
- [x] Connect task list read flow.
- [x] Implement server-side pagination based on `meta`.
- [x] Replace static task rows with dynamic rendering.
- [x] Map backend status to UI rail/badge text.
- [x] Add loading skeleton.
- [x] Add error state + retry.
- [x] Add empty state.
- [x] Add quick filters:
  - [x] range filters through API query
  - [x] status filters client-side on loaded page until backend confirms status query
- [x] Add task summary cards from loaded data.
- [~] Real `/api/v1/tasks/summary/` can replace local summary later.
- [!] Real API verification is dependent on final route response and CORS.

**Outcome:** Tasks list/read/filter/pagination flow is ready.

---

## ✅ Branch: `feature/009-tasks-mutation-and-smart-form`

- [x] Extend `TasksService`:
  - [x] `createTask(payload)`
  - [x] `updateTask(taskId, payload)`
  - [x] `deleteTask(taskId)`
  - [x] `getProjects()`
  - [x] `getProjectDetails(projectId)`
- [x] Add Reactive Form for task create/edit.
- [x] Add task modal.
- [x] Add create mode.
- [x] Add edit mode.
- [x] Build `TaskMutationPayload` from form.
- [x] Calculate `duration` from `start_time` and `end_time`.
- [x] Validate end time after start time.
- [x] Add mutation loading/error state.
- [x] Connect submit to create/update.
- [x] Refetch list after mutation.
- [x] Load projects into project dropdown.
- [x] Load project details into service/contract dropdowns.
- [x] Reset service/contract when project changes.
- [x] Add delete flow.
- [x] Add row-level deleting state.
- [x] Add delete error state.
- [x] Test contract API, CORS, proxy and browser-extension workaround.
- [!] Real persistence for create/update/delete depends on backend/mock server storing state.
- [!] Full edit prefill needs `project_service` and `project_contract` in list response or task detail endpoint.

**Outcome:** Tasks mutation flow is complete on frontend. Real visible list changes require backend/mock persistence.

---

### Current Real API Direction

The main integration path is now real WTT v1 API.
Mock and contract bridge are no longer the main development direction.
They may stay temporarily only until each real endpoint is verified.

Priority:

1. Real login
2. Real token
3. Real profile
4. Read-only real APIs
5. Safe controlled mutations

## CORS

Temporary options used/tested:

- Browser CORS extension: personal local workaround only.
- Angular proxy: recommended dev workaround.

Final expected solution:

- Backend/mock server enables CORS for `http://localhost:4200`, or frontend and API are served from same origin.

## Contract bridge

`useContractApi` and mapping from contract wrapper is temporary only.
Before final/demo branch, remove or disable contract bridge.

---

# ✅ Decided Roadmap From Here

# ✅ Updated Roadmap — Real WTT v1 API Direction

## 🔜 Branch 010: `feature/010-real-auth-and-safe-v1-api-foundation`

**Goal:** Replace temporary token/user flow with real WTT login, real token handling, and a safe foundation for consuming v1 APIs.

### Checklist

- [x] Capture real login endpoint from WTT Network tab.
- [x] Document login request shape without exposing real credentials.
- [x] Document login response shape without exposing real token.
- [ ] Add login models:
  - [ ] `LoginRequest`
  - [ ] `LoginResponse`
  - [ ] `AuthToken`
- [x] Refactor `AuthService`:
  - [ ] Use `environment.apiBaseUrl`
  - [ ] Add `login(credentials)`
  - [ ] Add `logout()`
  - [ ] Add `token` state
  - [ ] Add `currentUser` state
  - [ ] Add `isAuthenticated`
  - [ ] Add `fetchProfile(...)`
- [ ] Decide temporary dev token storage:
  - [ ] Prefer `sessionStorage` during internship/dev
  - [ ] Never hardcode token in source
- [ ] Refactor `authInterceptor`:
  - [ ] Remove hardcoded temporary token
  - [ ] Read token from `AuthService` or token storage
  - [ ] Skip Authorization for login endpoint
  - [ ] Attach correct `Authorization` header format based on real backend: `Token xxx` or `Bearer xxx`
- [ ] Improve `errorInterceptor`:
  - [ ] Handle 401 by clearing auth state
  - [ ] Redirect to login when route guard exists
  - [ ] Keep 403/503 user-safe logging
- [ ] Add basic login route/page if needed:
  - [ ] `/auth/login`
  - [ ] Login form with loading/error state
- [ ] Fetch real profile after login.
- [ ] Replace `temporaryUserId` usage with authenticated user id.
- [ ] Update `environment.ts` and `environment.development.ts`.
- [ ] Keep mock flags only until each service is migrated.
- [ ] Write branch report:
  - [ ] Login endpoint
  - [ ] Token format
  - [ ] Profile endpoint status
  - [ ] Auth storage decision
  - [ ] Security notes

**Safe Rule:** No real mutation in this branch.

---

## 🔜 Branch 011: `feature/011-dashboard-real-read-integration`

**Goal:** Connect Dashboard read-only APIs to real WTT v1 data.

### Checklist

- [ ] Remove mock mode from verified Dashboard methods.
- [ ] Connect `GET /api/v1/users/a_user_details/`.
- [ ] Connect `GET /api/v1/dashboard/line_chart/`.
- [ ] Connect `GET /api/v1/dashboard/pie_chart/`.
- [ ] Connect `GET /api/v1/news/get_message_data/`.
- [ ] Replace `environment.temporaryUserId` with authenticated user id.
- [ ] Verify response shapes in Network tab.
- [ ] Keep loading/error/empty states.
- [ ] Bind unread messages to Header if UI is ready.
- [ ] Remove noisy console logs.
- [ ] Write branch report.

**Safe Rule:** Dashboard branch is read-only.

---

## 🔜 Branch 012: `feature/012-tasks-real-read-integration`

**Goal:** Connect Tasks read APIs to real WTT v1 data safely.

### Checklist

- [ ] Remove mock mode from verified Tasks read methods.
- [ ] Connect `GET /api/v1/tasks/`.
- [ ] Verify pagination response `{ data, meta }`.
- [ ] Verify real status values.
- [ ] Verify range filters:
  - [ ] `today`
  - [ ] `week_till_today`
  - [ ] `month_till_today`
- [ ] Connect `GET /api/v1/projects/get_all_projects/`.
- [ ] Connect `GET /api/v1/projects/project_details/`.
- [ ] Verify whether query param is `id` or `project`.
- [ ] Keep status filter client-side unless backend supports status query.
- [ ] Remove contract adapter for tasks if real endpoint works.
- [ ] Write branch report.

**Safe Rule:** No create/update/delete in this branch.

---

## 🔜 Branch 013: `feature/013-safe-task-mutation-verification`

**Goal:** Test real task create/update/delete only with controlled test data.

### Checklist

- [ ] Add a dev-only safe mutation checklist.
- [ ] Create one clearly marked test task:
  - [ ] Title prefix: `[FRONTEND-TEST-DO-NOT-APPROVE]`
- [ ] Verify `POST /api/v1/tasks/`.
- [ ] Verify created task appears in `GET /api/v1/tasks/`.
- [ ] Verify `PUT /api/v1/tasks/{id}/` only on the test task.
- [ ] Verify `DELETE /api/v1/tasks/{id}/` only on the test task.
- [ ] Add UI warning or dev guard before real delete.
- [ ] Replace `window.confirm` with custom confirm modal if needed.
- [ ] Write rollback notes:
  - [ ] Test task id
  - [ ] Created at
  - [ ] Updated at
  - [ ] Deleted/cleaned up status

**Safe Rule:** Never mutate real work items.

---

## 🔜 Branch 014: `feature/014-profile-header-and-layout-real-data`

**Goal:** Use real profile/auth data across layout, header, and sidebars.

### Checklist

- [ ] Show real user name in Header/Sidebar.
- [ ] Show manager information if available.
- [ ] Bind notification count if verified.
- [ ] Remove remaining static user placeholders.
- [ ] Add logged-in / logged-out UI states.
- [ ] Add basic auth guard if routes need protection.
- [ ] Write branch report.

---

## 🔜 Branch 015: `feature/015-presence-read-only-integration`

**Goal:** Connect presence read-only state before allowing clock-in/clock-out.

### Checklist

- [ ] Create `PresenceService`.
- [ ] Add models:
  - [ ] `PresenceItem`
  - [ ] `ActivePresenceResponse`
- [ ] Connect `GET /api/v1/presence/no_end_time_presence/`.
- [ ] Show active/idle presence status in sidebar.
- [ ] Build timer display from `start_time`.
- [ ] Do not call `POST /presence/` yet.
- [ ] Do not call `PUT /presence/{id}/` yet.
- [ ] Write branch report.

**Safe Rule:** Read-only presence first.

---

## 🔜 Branch 016: `feature/016-safe-presence-clock-in-out`

**Goal:** Add real clock-in/clock-out only after read-only presence is verified.

### Checklist

- [ ] Confirm company/team permission for testing clock-in/out.
- [ ] Implement Clock In with `POST /api/v1/presence/`.
- [ ] Implement Clock Out with `PUT /api/v1/presence/{id}/`.
- [ ] Prevent double clock-in.
- [ ] Add timestamp utility: `YYYY-MM-DD HH:MM:SS`.
- [ ] Add confirmation before clock-out.
- [ ] Add branch report with exact test timestamps.

**Safe Rule:** Presence affects real attendance. Test only when allowed.

---

## 🔜 Branch 017: `feature/017-task-form-polish-and-detail-prefill`

**Goal:** Improve task modal UX and edit correctness after real read/mutation verification.

### Checklist

- [ ] Confirm whether task list includes `project_service` and `project_contract`.
- [ ] If not, find or request `GET /api/v1/tasks/{id}/`.
- [ ] Add full edit prefill.
- [ ] Add field-level validation messages.
- [ ] Add success toast for create/update/delete.
- [ ] Improve disabled/loading states.
- [ ] Add better empty/error states for dropdowns.
- [ ] Improve modal accessibility.
- [ ] Write branch report.

---

## 🔜 Branch 018: `feature/018-dashboard-and-tasks-demo-polish`

**Goal:** Prepare real-auth, real-dashboard, and real-tasks pages for lead demo.

### Checklist

- [ ] Remove temporary mock/contract code from verified paths.
- [ ] Remove noisy console logs.
- [ ] Verify real login.
- [ ] Verify dashboard real data.
- [ ] Verify tasks real read data.
- [ ] Verify safe mutation notes.
- [ ] Test dark/light mode.
- [ ] Test responsive layout.
- [ ] Prepare demo script.
- [ ] Prepare backend dependency list.
- [ ] Write final demo report.

---

## Later / Product Intelligence Branches

- [ ] GitLab evidence integration.
- [ ] Jira ticket/worklog relation.
- [ ] Smart Worklog suggestion.
- [ ] Evidence Pack UI.
- [ ] Confidence Score UI.
- [ ] Approval flow for Team Lead.
- [ ] Code Review Intelligence.
- [ ] AI worklog report.
- [ ] HR/payroll export support.
- [ ] Engineering Intelligence dashboard.
