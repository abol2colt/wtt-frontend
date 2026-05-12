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

## 🔄 Branch 010: `feature/010-real-auth-and-safe-v1-api-foundation`

**Goal:** Real WTT login, token/session handling, authenticated user id, safe v1 API foundation, and early dashboard/sidebar real-read integration.

### Auth Foundation

- [x] Capture real login endpoint from WTT Network tab.
- [x] Document login request shape without exposing real credentials.
- [x] Document login response shape without exposing real token.

- [x] Add auth models:
  - [x] `LoginRequest`
  - [x] `LoginResponse`
  - [x] lightweight authenticated user/profile model

- [x] Refactor `AuthService`:
  - [x] Use `environment.apiBaseUrl`
  - [x] Add `login(credentials)`
  - [x] Save token after successful login
  - [x] Save authenticated `user_id`
  - [x] Add `logout()`
  - [x] Add `token` state
  - [x] Add `currentUser` state
  - [x] Add `isAuthenticated`
  - [x] Add `getCurrentUserId()`
  - [x] Add `getAuthHeaderValue()`
  - [x] Add `fetchProfile()`
  - [x] Remove placeholder hardcoded API URL
  - [x] Avoid storing real token in source code

- [x] Decide temporary dev token storage:
  - [x] Use `sessionStorage` during internship/dev
  - [x] Never hardcode token in source
  - [x] Never commit real token/cookie/auth screenshots

- [x] Refactor `authInterceptor`:
  - [x] Remove hardcoded temporary token
  - [x] Read token from auth/session storage flow
  - [x] Skip Authorization for login endpoint
  - [x] Attach `Authorization: Token <token>`

- [x] Improve `errorInterceptor`:
  - [x] Handle 401 by clearing auth state / redirecting toward login flow
  - [x] Keep 403/503 user-safe logging

- [x] Add login route/page:
  - [x] `/auth/login`
  - [x] Login form with loading/error state
  - [x] Redirect to dashboard after successful login
  - [x] Redirect already-authenticated user away from login page

- [x] Fetch real profile after login.
- [x] Replace `temporaryUserId` usage in connected areas with authenticated user id.
- [x] Update environment files for real/proxy API direction.
- [x] Keep mock flags only as temporary fallback until each service is migrated.

### Real API Foundation / Verified Endpoints

- [x] Verify real dashboard stats endpoint:
  - [x] `GET /api/v1/dashboard/a_user_details`
- [x] Verify real dashboard profile endpoint:
  - [x] `GET /api/v1/dashboard/profile`
- [x] Verify real dashboard line chart endpoint:
  - [x] `GET /api/v1/dashboard/line_chart`
- [x] Verify real dashboard pie chart endpoint:
  - [x] `GET /api/v1/dashboard/pie_chart`
- [x] Verify real public news endpoint:
  - [x] `GET /api/v1/news/get_message_data/?type=public&state=all`
- [x] Verify real private news endpoint:
  - [x] `GET /api/v1/news/get_message_data/?type=private&state=all`
- [x] Verify real unread message count endpoint:
  - [x] `GET /api/v1/news/get_message_data/?state=unread_count`
- [x] Verify real news count endpoint:
  - [x] `GET /api/v1/news/messages_count/`
- [x] Verify real presence count endpoint:
  - [x] `GET /api/v1/presence/presence_count/`
- [x] Verify real clock-in endpoint shape:
  - [x] `POST /api/v1/presence/`
- [x] Verify real tasks list shape:
  - [x] `GET /api/v1/tasks/`
- [x] Verify real tasks count shape:
  - [x] `GET /api/v1/tasks/tasks_count/`
- [x] Verify real projects endpoint:
  - [x] `GET /api/v1/project/get_all_projects/`

### Left Sidebar / Dashboard Work Done Inside Branch 010

- [x] Replace `environment.temporaryUserId` in LeftSidebar with authenticated user id.
- [x] Connect left sidebar pie chart to real authenticated user.
- [x] Add dynamic project distribution legend from real pie chart response.
- [x] Connect public announcements to real API.
- [x] Prepare private announcements endpoint and empty state.
- [x] Connect presence count read API.
- [x] Connect active presence read API.
- [x] Add animated active/inactive presence orb.
- [x] Make presence orb clickable instead of adding a separate button.
- [x] Keep presence mutation in dry-run mode.
- [x] Prevent real presence mutation in this branch.
- [x] Replace running task card with latest task fallback.
- [x] Add local play/stop timer for latest task.
- [x] Remove duplicate old play/stop buttons from latest task card.
- [x] Connect today sidebar stats:
  - [x] Work time from `/dashboard/profile`
  - [x] Productivity from `/dashboard/profile`
  - [x] Task count from `/tasks/tasks_count/`
- [x] Replace remaining static today stats values.

### API Documentation

- [x] Update API reference with real login endpoint.
- [x] Update dashboard endpoints to real paths.
- [x] Update news endpoints.
- [x] Update presence endpoints.
- [x] Update task list/count endpoints.
- [x] Update project endpoint from `projects` to singular `project`.
- [x] Keep `WTT_API_Reference_clean.md` as source of truth.

### Still Needed Before Closing Branch 010

- [ ] Run final `npm run build`.
- [ ] Verify Network tab after fresh login:
  - [ ] `POST /login/`
  - [ ] `GET /user/`
  - [ ] `GET /dashboard/a_user_details`
  - [ ] `GET /dashboard/profile`
  - [ ] `GET /dashboard/line_chart`
  - [ ] `GET /dashboard/pie_chart`
  - [ ] `GET /news/get_message_data/`
  - [ ] `GET /presence/presence_count/`
  - [ ] `GET /tasks/`
  - [ ] `GET /tasks/tasks_count/`
- [ ] Confirm no real token/cookie is committed.
- [ ] Write Branch 010 report:
  - [ ] Login endpoint
  - [ ] Token format: `Authorization: Token <token>`
  - [ ] Profile endpoint status
  - [ ] Auth storage decision
  - [ ] Security notes
  - [ ] Real endpoints verified
  - [ ] Dry-run presence note
  - [ ] Remaining work moved to Branch 011

**Safe Rule:** No real mutation in this branch. Presence click remains dry-run unless explicitly approved.

## ✅ Branch 011: `feature/011-dashboard-real-read-finalization`

**Goal:** Finalize dashboard/sidebar read-only data and polish remaining dashboard UI.

### Checklist

- [x] Connect private announcements in Dashboard UI.
- [x] Add private announcements empty state.
- [x] Bind unread messages to Header notification badge.
- [x] Replace recent activities static list with latest tasks fallback.
- [x] Show real profile/name/avatar in Header/Sidebar where UI is ready.
- [x] Make logout button real across layout.
- [x] Verify `/dashboard/profile` with final selected range.
- [x] Decide sidebar stats range:
  - [x] Use `month_till_today` instead of `today`
  - [x] Rename UI label from `آمار امروز` to `آمار ماه جاری` / `آمار بازه`
- [x] Clean leftover CSS duplicates.
- [x] Remove noisy console logs.
- [x] Write Branch 011 report.

### Verified Read APIs

- [x] `GET /api/v1/dashboard/a_user_details?range=month_till_today&user=<id>&page=1`
- [x] `GET /api/v1/dashboard/profile?range=month_till_today&user=<id>&page=1`
- [x] `GET /api/v1/dashboard/line_chart?range=month_till_today&user=<id>`
- [x] `GET /api/v1/dashboard/pie_chart?range=month_till_today&user=<id>`
- [x] `GET /api/v1/news/get_message_data/?range=month_till_today&type=public&page=1&state=all`
- [x] `GET /api/v1/news/get_message_data/?range=month_till_today&type=private&page=1&state=all`
- [x] `GET /api/v1/news/get_message_data/?state=unread_count`
- [x] `GET /api/v1/news/messages_count/?range=month_till_today&type=public`
- [x] `GET /api/v1/news/messages_count/?range=month_till_today&type=private`
- [x] `GET /api/v1/tasks/?range=month_till_today&page=1`
- [x] `GET /api/v1/tasks/tasks_count/?range=month_till_today`

### Important Decision

`range=today` in `/dashboard/profile` can return zero for `presences_time` and `total_randeman`.
The original WTT dashboard displays meaningful dashboard summary values from `range=month_till_today`.
Therefore sidebar summary stats now use `month_till_today`.

### Safety Notes

- No real create/update/delete was added in this branch.
- Presence mutation remains guarded/dry-run.
- Dashboard branch stayed read-only.

**Outcome:** Dashboard and sidebar real-read finalization is complete and ready for commit.

### 🔜 Branch 012: `feature/012-tasks-real-read-integration`

**Goal:** Connect Tasks read APIs to real WTT v1 data safely and remove old mock/contract read paths where verified.

### Checklist

#### Real Tasks List

- [ ] Remove mock mode from verified Tasks read methods.
- [ ] Remove/disable `useContractApi` path for tasks after verification.
- [ ] Connect real `GET /api/v1/tasks/`.
- [ ] Verify request params:
  - [ ] `page`
  - [ ] `range`
  - [ ] optional `user` only if backend needs it
- [ ] Verify real response shape.
- [ ] Confirm whether response is:
  - [ ] `{ count, next, previous, results }`
  - [ ] or `{ data, meta }`
- [ ] Keep adapter/mapping inside `TasksService`, not component.

#### Pagination

- [ ] Verify page 1.
- [ ] Verify page 2.
- [ ] Verify total count.
- [ ] Verify next/previous behavior.
- [ ] Make UI pagination work from real backend response.

#### Range Filters

- [ ] Verify `range=today`.
- [ ] Verify `range=week_till_today`.
- [ ] Verify `range=month_till_today`.
- [ ] Keep active range state in component.
- [ ] Refetch tasks when range changes.

#### Status Handling

- [ ] Verify real status values:
  - [ ] `accept`
  - [ ] `reject`
  - [ ] `pending`
  - [ ] others if present
- [ ] Map backend statuses to UI labels:
  - [ ] `accept` → `approved`
  - [ ] `reject` → `rejected`
  - [ ] `pending` → `pending`
- [ ] Keep status filter client-side unless backend supports status query.

#### Projects

- [ ] Connect real `GET /api/v1/project/get_all_projects/`.
- [ ] Confirm response shape:
  - [ ] `my_projects`
  - [ ] `all_projects`
  - [ ] `all_active_projects`
- [ ] Use `all_active_projects` for create/edit dropdown if available.

#### Project Details

- [ ] Connect real `GET /api/v1/projects/project_details/`.
- [ ] Verify query param:
  - [ ] `id`
  - [ ] `project`
  - [ ] other real key from Network
- [ ] Verify services response.
- [ ] Verify contracts response.
- [ ] Add mapping if backend response shape differs.

#### UI / State

- [ ] Keep loading state.
- [ ] Keep error state.
- [ ] Keep empty state.
- [ ] Keep task modal disabled states safe.
- [ ] Do not call create/update/delete in this branch.
- [ ] Remove noisy console logs.
- [ ] Write Branch 012 report.

### Safe Rule

No create/update/delete in this branch.
This branch is read-only.

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
