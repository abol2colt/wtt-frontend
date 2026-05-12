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

## 🚀 Branch 012: `feature/012-smart-worklog-mvp-integration`

**Goal:** Integrate the new Node.js Proxy server to fetch real GitLab commits and auto-fill the WTT time registration form (Proof of Concept for Management).

### Checklist (Proxy Backend - wtt-proxy repo)

- [x] Initialize `wtt-proxy` Node.js project.
- [x] Install dependencies (`express`, `axios`, `cors`, `dotenv`).
- [x] Create `.env` for GitLab local credentials and Project ID.
- [x] Implement `GET /api/sync-gitlab` endpoint.
- [x] Parse commits and calculate `suggestedDuration` and `description`.
- [ ] Write `PROXY_LEARNING_REPORT.md` (0-to-100 backend concepts).

### Checklist (Frontend - wtt-frontend repo)

- [ ] Create `GitlabSyncService` in `features/tasks/services/` (or shared).
- [ ] Add `Sync with GitLab` button to the Task creation/edit modal.
- [ ] Implement loading state during proxy fetch.
- [ ] Auto-fill the Angular `FormGroup` (description & duration) using `patchValue`.
- [ ] Add success/error toast notifications for the sync process.
- [ ] Update `REPORT.md` with integration results.

### 🔄 Branch 012: `feature/012-tasks-real-read-integration`

**Goal:** Connect Tasks read APIs to real WTT v1 data safely, remove old mock/contract read paths where verified, and align Tasks filters with real WTT v1 behavior.

### Checklist

#### Real Tasks List

- [x] Remove mock mode from verified Tasks read methods.
- [x] Remove/disable `useContractApi` path for tasks after verification.
- [x] Connect real `GET /api/v1/tasks/`.
- [x] Verify request params:
  - [x] `page`
  - [x] `range`
  - [x] no `user` param needed for Tasks list because backend infers user from token.
- [x] Verify real response shape.
- [x] Confirm real response shape is `{ count, next, previous, results }`.
- [x] Keep adapter/mapping inside `TasksService`, not component.
- [x] Map real WTT response to frontend `TaskListResponse { data, meta }`.

#### Pagination

- [x] Verify page 1.
- [x] Verify page 2.
- [x] Verify total count.
- [x] Verify next/previous behavior.
- [x] Make UI pagination work from real backend response.
- [x] Use fixed real page size assumption instead of `results.length` to avoid wrong total pages on the last page.

#### Range Filters

- [x] Verify `range=today`.
- [x] Verify `range=yesterday`.
- [x] Verify `range=week`.
- [x] Verify `range=last_week`.
- [x] Verify `range=month`.
- [x] Verify `range=last_month`.
- [x] Verify `range=month_till_today`.
- [x] Verify `range=this_year`.
- [x] Replace wrong/old `week_till_today` usage with real WTT `week`.
- [x] Keep active range state in component.
- [x] Refetch tasks when range changes.
- [x] Refetch `tasks_count` when range changes.

#### Custom Date Filters

- [x] Verify `GET /api/v1/tasks/?start_date=<jalali>&end_date=<jalali>&page=1`.
- [x] Add `start_date` and `end_date` to `TaskListQuery`.
- [x] When manual date range is active, send `start_date/end_date` instead of `range`.
- [ ] Polish date UI in the left sidebar so user can select/enter Jalali dates cleanly.

#### Tasks Count

- [x] Connect real `GET /api/v1/tasks/tasks_count/`.
- [x] Verify `tasks_count` with range filters.
- [x] Verify `tasks_count` with `project`.
- [x] Verify `tasks_count` with `project_contract`.
- [x] Verify `tasks_count` with `project_service`.
- [x] Verify `tasks_count` with `teleworking=true`.
- [x] Verify `tasks_count` with `favorite=true`.
- [x] Replace summary card status counts with real `tasks_count` response.
- [x] Keep list and summary counters synced through shared `TaskListQuery`.

#### Status Handling

- [x] Verify real status values:
  - [x] `accept`
  - [x] `reject`
  - [x] `pending`
- [x] Map backend statuses to UI labels:
  - [x] `accept` → `approved`
  - [x] `reject` → `rejected`
  - [x] `pending` → `pending`
- [x] Keep status filter client-side because WTT did not send a separate status query in Network.
- [x] Use `tasks_count` object for real status counters: `accept`, `reject`, `pending`, `all`.

#### Projects

- [x] Connect real `GET /api/v1/project/get_all_projects/`.
- [x] Confirm response shape:
  - [x] `my_projects`
  - [x] `all_projects`
  - [x] `all_active_projects`
- [x] Use `all_active_projects` for dropdown if available.
- [x] Map WTT projects response to frontend `Project[]` inside `TasksService`.

#### Project Details

- [x] Verify real project details endpoint.
- [x] Correct endpoint from old/unverified path to:
  - [x] `GET /api/v1/project/project_details/?id=<projectId>`
- [x] Verify query param:
  - [x] `id`
- [x] Verify services response.
- [x] Verify contracts response.
- [x] Connect services/contracts to project-dependent dropdowns.
- [x] Reset service/contract when project changes.

#### Advanced Filters

- [x] Add `TaskRange` model.
- [x] Add `TaskListQuery` model.
- [x] Refactor `TasksService.getTasks()` to accept `TaskListQuery`.
- [x] Refactor `TasksService.getTasksCount()` to accept `TaskListQuery`.
- [x] Add shared `buildTaskQueryParams()` helper inside `TasksService`.
- [x] Support verified query params:
  - [x] `range`
  - [x] `start_date`
  - [x] `end_date`
  - [x] `project`
  - [x] `project_contract`
  - [x] `project_service`
  - [x] `teleworking=true`
  - [x] `favorite=true`
- [x] Do not send `teleworking=false` or `favorite=false`; remove params when disabled.
- [x] Build current task query in component from active filters.
- [x] Apply advanced filters to both tasks list and tasks count.
- [x] Reset advanced filters safely.
- [x] Move advanced filters from temporary Tasks page area to the Tasks left sidebar UI.
- [x] Polish advanced filter layout visually inside left sidebar.
- [x] Add clean Jalali date input/selection UX.

#### UI / State

- [x] Keep loading state.
- [x] Keep error state.
- [x] Keep empty state.
- [x] Keep task modal disabled states safe.
- [x] Keep create/update/delete guarded in Branch 012.
- [x] Do not call real create/update/delete in this branch.
- [x] Migrate old `getTasks(userId, page, range)` consumers to new `getTasks(userId, query)`.
- [x] Migrate old `getTasksCount(range)` consumers to new `getTasksCount(query)`.
- [x] Remove noisy console logs.
- [x] Run final `npm run build`.
- [x] Verify Network after final UI move.
- [x] Write Branch 012 report.

### Verified APIs

- [x] `GET /api/v1/tasks/?range=month_till_today&page=1`
- [x] `GET /api/v1/tasks/?range=month_till_today&page=2`
- [x] `GET /api/v1/tasks/?start_date=1405-02-02&end_date=1405-02-22&page=1`
- [x] `GET /api/v1/tasks/tasks_count/?range=month_till_today`
- [x] `GET /api/v1/tasks/tasks_count/?range=this_year`
- [x] `GET /api/v1/tasks/tasks_count/?range=month`
- [x] `GET /api/v1/tasks/tasks_count/?range=last_month`
- [x] `GET /api/v1/tasks/tasks_count/?range=week`
- [x] `GET /api/v1/tasks/tasks_count/?range=last_week`
- [x] `GET /api/v1/tasks/tasks_count/?range=today`
- [x] `GET /api/v1/tasks/tasks_count/?range=yesterday`
- [x] `GET /api/v1/tasks/tasks_count/?range=month_till_today&project=<id>`
- [x] `GET /api/v1/tasks/tasks_count/?range=month_till_today&project=<id>&project_contract=<id>`
- [x] `GET /api/v1/tasks/tasks_count/?range=month_till_today&project=<id>&project_service=<id>`
- [x] `GET /api/v1/tasks/tasks_count/?range=month_till_today&teleworking=true`
- [x] `GET /api/v1/tasks/tasks_count/?range=month_till_today&favorite=true`
- [x] `GET /api/v1/project/get_all_projects/`
- [x] `GET /api/v1/project/project_details/?id=<projectId>`

### Safe Rule

No create/update/delete in this branch.
This branch is read-only.

### Remaining Before Closing Branch

- [x] Move advanced filters to left sidebar.
- [x] Polish Jalali date selection/input UX.
- [x] Run final `npm run build`.
- [x] Verify no `/taskscontract/` request.
- [x] Verify no mock read path.
- [x] Verify no `POST /tasks/`, `PUT /tasks/{id}/`, or `DELETE /tasks/{id}/` call.
- [x] Update `WTT_API_Reference_clean.md`.
- [x] Finalize Branch 012 report.

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
