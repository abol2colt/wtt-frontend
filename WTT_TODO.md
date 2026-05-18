# TODO — WTT Frontend Roadmap

> Final branch-based roadmap for the WTT frontend redesign, real WTT API integration, Smart Worklog MVP, and demo preparation.
>
> Freeze date: 2026-05-16  
> Execution target: Today 13:00–20:00 + tomorrow morning demo buffer  
> Rule: Do not expand scope before demo unless it fixes a blocker.

---

## Legend

- `[x]` Done
- `[~]` Partially done / needs final verification
- `[!]` Risk / dependency / needs backend or real account
- `[ ]` Not done
- `[FORCE]` Must be completed before tomorrow demo
- `[DEMO]` Required for presentation confidence
- `[SAFE]` Must not touch real production data unless guarded
- `[LATER]` Product roadmap after demo

---

## Current Product Direction

WTT is no longer only a manual timesheet UI. The target product direction is:

```txt
Real WTT Login + Real WTT Data
→ Jira-compatible assigned task source
→ GitLab-compatible evidence source
→ AI-generated Persian worklog report
→ Human confirmation
→ Safe WTT task/worklog mutation
→ Team lead review
```

### Demo truth statement

```txt
WTT authentication and read APIs are real.
Jira is currently mocked through a Jira-compatible contract.
GitLab is currently local/mock/provider-based because real access is not available yet.
The integration architecture must be ready for real Jira/GitLab credentials later.
```

### Absolute safety rule

No real work item should be created, updated, or deleted during demo except a clearly marked test task that is immediately cleaned up.

---

# Completed Foundation Branches

## ✅ Branch 001 — `feature/001-workspace-and-core`

**Goal:** Initialize the Angular workspace and base engineering setup.

### Checklist

- [x] Initialize Angular workspace.
- [x] Configure VS Code / Prettier / editor basics.
- [x] Install and configure Tailwind CSS + base SCSS variables.
- [x] Install `date-fns-jalali`.
- [x] Prepare project folder structure: `core`, `shared`, `features`, `state`.
- [x] Prepare basic HTTP/application setup.

**خلاصه فارسی:** پروژه پایه‌گذاری شد و ساختار اصلی برای توسعه featureها آماده شد.

---

## ✅ Branch 002 — `feature/002-auth-and-security`

**Goal:** Prepare auth, HTTP, and security foundation.

### Checklist

- [x] Create `AuthService` skeleton/profile flow.
- [x] Implement token interceptor.
- [x] Implement global error interceptor.
- [x] Set up user/auth state using signals.
- [x] Remove user id from visible routes where possible.
- [x] Replace temporary token strategy later with real login/token flow.
- [x] Replace `temporaryUserId` usage later with authenticated user id.

**خلاصه فارسی:** زیرساخت امنیت، interceptorها و state احراز هویت آماده شد؛ مسیر بعدی اتصال واقعی login بود.

---

## ✅ Branch 003 — `feature/003-ui-layout-and-theme`

**Goal:** Build the main app shell and theme foundation.

### Checklist

- [x] Build app shell.
- [x] Build main sidebar.
- [x] Build header.
- [x] Build left sidebar.
- [x] Add dark/light theme toggle.
- [x] Use CSS variables/design tokens.
- [~] Responsive polish remains for final demo cleanup.

**خلاصه فارسی:** پوسته اصلی برنامه، سایدبارها، هدر و تم دارک/لایت ساخته شد.

---

## ✅ Branch 004 — `feature/004-ui-dashboard-widgets`

**Goal:** Build static dashboard UI before data integration.

### Checklist

- [x] Build static dashboard KPI cards.
- [x] Build static dashboard chart areas.
- [x] Build announcements/activity placeholders.
- [x] Prepare dashboard visual layout.
- [x] Replace static chart approach later with ECharts.

**خلاصه فارسی:** داشبورد اولیه به شکل UI آماده شد و بعداً data-driven شد.

---

## ✅ Branch 005 — `feature/005-ui-tasks-and-presence`

**Goal:** Build task command center layout and initial presence/timer UI.

### Checklist

- [x] Build Task Command Center layout.
- [x] Add task rows, visual statuses, and inline actions.
- [x] Implement `LayoutService` for context-aware header/sidebar.
- [x] Move task-specific actions into Tasks page instead of global header.
- [x] Prepare presence/timer visual parts.
- [~] Presence real mutation remains guarded until safe verification.

**خلاصه فارسی:** صفحه وظایف و بخش‌های اولیه حضور/تایمر طراحی شدند.

---

## ✅ Branch 006 — `feature/006-api-contracts-and-data-foundation`

**Goal:** Prepare models, environment files, and API contracts.

### Checklist

- [x] Verify package versions.
- [x] Document Angular version as `21.2.x`.
- [x] Create `environment.ts` and `environment.development.ts`.
- [x] Move hardcoded base URL out of services.
- [x] Create shared API models:
  - [x] `api-state.model.ts`
  - [x] `dashboard.model.ts`
  - [x] `task.model.ts`
  - [x] `project.model.ts`
  - [x] `user.model.ts`
- [x] Create initial API contracts for backend/lead discussion.
- [x] Decide temporary user id and token strategy.

**خلاصه فارسی:** مدل‌ها، environmentها و قراردادهای پایه API ساخته شدند.

---

## ✅ Branch 007 — `feature/007-dashboard-api-integration`

**Goal:** Make Dashboard data-driven.

### Checklist

- [x] Create `DashboardService`.
- [x] Move dashboard API calls out of component.
- [x] Add dashboard stats/profile/chart calls.
- [x] Add unread message count read flow.
- [x] Add `ApiState` for dashboard sections.
- [x] Replace mock KPI values with state-based values.
- [x] Replace static chart rendering with ECharts.
- [x] Add loading/error/empty states.
- [x] Keep mock mode only as temporary fallback.

**خلاصه فارسی:** داشبورد از حالت static خارج شد و با service/state/chart واقعی‌تر شد.

---

## ✅ Branch 008 — `feature/008-tasks-read-and-filter-integration`

**Goal:** Connect Tasks read/list/filter/pagination flow.

### Checklist

- [x] Create `TasksService`.
- [x] Connect task list read flow.
- [x] Implement server-side pagination based on backend metadata.
- [x] Replace static task rows with dynamic rendering.
- [x] Map backend status to UI rail/badge text.
- [x] Add loading skeleton.
- [x] Add error state + retry.
- [x] Add empty state.
- [x] Add quick filters.
- [x] Keep status filter client-side where backend does not provide status query.
- [x] Add task summary cards.

**خلاصه فارسی:** لیست وظایف، فیلترها، صفحه‌بندی و stateهای اصلی آماده شدند.

---

## ✅ Branch 009 — `feature/009-tasks-mutation-and-smart-form`

**Goal:** Build task modal, create/edit/delete flow, and smart form foundation.

### Checklist

- [x] Extend `TasksService` with create/update/delete/project APIs.
- [x] Add Reactive Form for task create/edit.
- [x] Add task modal.
- [x] Add create mode.
- [x] Add edit mode.
- [x] Build `TaskMutationPayload` from form.
- [x] Calculate `duration` from `start_time` and `end_time`.
- [x] Validate end time after start time.
- [x] Add mutation loading/error state.
- [x] Refetch list after mutation.
- [x] Load project dropdown.
- [x] Load project details into service/contract dropdowns.
- [x] Reset service/contract when project changes.
- [x] Add delete flow and row-level deleting state.
- [!] Real create/update/delete requires safe controlled verification.

**خلاصه فارسی:** فرم ثبت/ویرایش وظیفه و جریان mutation در فرانت آماده شد، ولی mutation واقعی باید با گارد تست شود.

---

## ✅ Branch 010 — `feature/010-real-auth-and-safe-v1-api-foundation`

**Goal:** Real WTT login, token/session handling, authenticated user id, and safe v1 API foundation.

### Checklist

- [x] Capture real login endpoint.
- [x] Add real login models.
- [x] Refactor `AuthService` to use environment base URL.
- [x] Add login/logout/token/current user state.
- [x] Save real token after login.
- [x] Fetch real profile after login.
- [x] Replace temporary user id where connected.
- [x] Refactor `authInterceptor` to attach `Authorization: Token <token>`.
- [x] Improve error handling for 401/403/503.
- [x] Add login route/page.
- [x] Verify real dashboard read endpoints.
- [x] Verify real news read endpoints.
- [x] Verify real presence read endpoints.
- [x] Verify real tasks read/count endpoints.
- [x] Verify real projects endpoint.
- [x] Connect sidebar read data where ready.
- [x] Keep presence mutation dry-run/guarded.
- [x] Run build during later branches.
- [x] Keep real tokens out of source code.

**خلاصه فارسی:** login واقعی WTT، token، profile و APIهای read-only اصلی وصل و آماده استفاده شدند.

---

## ✅ Branch 011 — `feature/011-dashboard-real-read-finalization`

**Goal:** Finalize dashboard/sidebar read-only data and layout binding.

### Checklist

- [x] Connect private announcements in Dashboard UI.
- [x] Add private announcements empty state.
- [x] Bind unread messages to Header notification badge.
- [x] Replace recent activities static list with latest tasks fallback.
- [x] Show real profile/name/avatar where UI is ready.
- [x] Make logout button real.
- [x] Verify dashboard profile range behavior.
- [x] Use `month_till_today` for sidebar summary.
- [x] Clean leftover CSS duplicates.
- [x] Remove noisy console logs.
- [x] Write branch report.

**خلاصه فارسی:** داشبورد و سایدبار با داده‌های واقعی read-only نهایی شدند.

---

## ✅ Branch 012 — `feature/012-tasks-real-read-integration`

**Goal:** Connect Tasks read APIs to real WTT v1 data safely.

### Checklist

- [x] Remove mock mode from verified task read methods.
- [x] Remove/disable contract bridge for verified task read path.
- [x] Connect real `GET /api/v1/tasks/`.
- [x] Confirm response shape `{ count, next, previous, results }`.
- [x] Keep adapter/mapping inside `TasksService`.
- [x] Fix pagination using real backend total/count.
- [x] Verify range filters.
- [x] Verify manual Jalali date filters.
- [x] Connect real `tasks_count`.
- [x] Use real status counters from `tasks_count`.
- [x] Connect real projects endpoint.
- [x] Connect real project details endpoint.
- [x] Add advanced task filters.
- [x] Move advanced filters to left sidebar.
- [x] Keep create/update/delete guarded.
- [x] Remove noisy console logs.
- [x] Run build.
- [x] Verify no mock/contract requests on task read path.
- [x] Write branch report.

**خلاصه فارسی:** صفحه Tasks به read API واقعی WTT وصل شد و فیلترها/شمارنده‌ها واقعی شدند.

---

## ✅ Branch 013 — `feature/013-smart-worklog-mvp-integration`

**Goal:** Build a safe Smart Worklog MVP that fills the WTT task form from Jira-like tasks and GitLab commit evidence.

### Checklist

- [x] Initialize `wtt-proxy` as private/local repo.
- [x] Add `.gitignore` for `.env`, `node_modules`, GitLab volumes.
- [x] Add `.env.example` without real secrets.
- [x] Keep real `GITLAB_TOKEN` and `GEMINI_API_KEY` only in local `.env`.
- [x] Keep current GitLab + Gemini sync working.
- [x] Add Jira-compatible mock assigned tasks endpoint.
- [x] Add GitLab evidence endpoint.
- [x] Keep mock Jira response close to future real Jira shape:
  - [x] `key`
  - [x] `title`
  - [x] `project_id`
  - [x] `service_id`
  - [x] `contract_id`
  - [x] optional `branch_name`
- [x] Keep `TasksService` only for WTT APIs.
- [x] Keep GitLab/Jira logic outside `TasksService`.
- [x] Set WTT form fields from selected Jira-compatible task.
- [x] Load project details before setting service/contract.
- [x] Remove `setTimeout` dependency from task selection.
- [x] Add selected task state.
- [x] Fill description from AI response.
- [x] Fill start/end time from calculated duration.
- [x] Keep user as final reviewer before submit.
- [x] Run build.
- [x] Write branch report.

**خلاصه فارسی:** Smart Worklog MVP ساخته شد؛ فرم WTT از تسک Jira-compatible و شواهد GitLab/AI پر می‌شود ولی ثبت نهایی هنوز safe/guarded است.

---

# FORCE Plan Before Tomorrow Demo

## 🔥✅ Branch 014 — `feature/014-force-secrets-config-and-demo-safety`

**Timebox:** 13:00–13:45  
**Priority:** P0 / FORCE  
**Goal:** Lock security, environment config, and demo safety before touching feature code.

### Checklist

- [x] Rotate any real GitLab/Gemini tokens that were ever pasted into code, report, screenshot, Drive, or chat.
- [x] Confirm `.env` is ignored in:
  - [x] `wtt-fronted`
  - [x] `wtt-proxy`
  - [x] `wtt-sanbox`
- [x] Confirm no `.env` file is uploaded to Drive.
- [x] Confirm `.env.example` contains only placeholders:
  - [x] `WTT_API_BASE_URL`
  - [x] `JIRA_BASE_URL`
  - [x] `JIRA_TOKEN`
  - [x] `GITLAB_BASE_URL`
  - [x] `GITLAB_TOKEN`
  - [x] `GEMINI_API_KEY`
- [x] Move any hardcoded proxy URL into Angular environment.
- [x] Add demo safety flags:
  - [x] `enableRealTaskMutation`
  - [x] `enableRealPresenceMutation`
  - [x] `enableIntegrationMockMode`
- [x] Default all dangerous flags to `false`.
- [x] Add a clear console/runtime warning when mutation is disabled.
- [x] Run `npm run build`.
- [x] Start proxy and frontend once to confirm env configs load.

### Done criteria

- No real token is committed or stored in shared files.
- App still loads after moving config to environment.
- Dangerous mutations are off by default.

**خلاصه فارسی:** اول امنیت و config را قفل می‌کنیم تا دمو با secret واقعی یا mutation ناخواسته خراب نشود.

---

## 🔥✅ Branch 015 — `feature/015-force-integration-provider-contracts`

**Timebox:** 13:45–15:00  
**Priority:** P0 / FORCE  
**Goal:** Make Jira/GitLab/AI integration provider-ready and explainable for technical leads.

### Checklist

#### Shared integration contracts

- [ ] Add integration models under a clear location:
  - [ ] `shared/models/integration.model.ts` or `features/tasks/models/worklog-integration.model.ts`
- [ ] Add `ExternalTask` model:
  - [ ] `source`
  - [ ] `key`
  - [ ] `title`
  - [ ] `assigneeId`
  - [ ] `wttProjectId`
  - [ ] `wttServiceId`
  - [ ] `wttContractId`
  - [ ] `branchName`
  - [ ] `raw`
- [ ] Add `GitEvidence` model:
  - [ ] `provider`
  - [ ] `branchName`
  - [ ] `commits`
  - [ ] `firstEvidenceAt`
  - [ ] `lastEvidenceAt`
  - [ ] `confidenceHints`
- [ ] Add `AiWorklogDraft` model:
  - [ ] `description`
  - [ ] `summary`
  - [ ] `risks`
  - [ ] `suggestedStartTime`
  - [ ] `suggestedEndTime`
  - [ ] `suggestedDurationMinutes`

#### Frontend services

- [ ] Create `TaskSourceService` or `JiraCompatibleTaskSourceService`.
- [ ] Create `GitEvidenceService` or keep existing `GitlabSyncService` but rename methods conceptually.
- [ ] Keep `TasksService` only for WTT endpoints.
- [ ] Remove Jira/GitLab/AI calls from `TasksService` if any exist.
- [ ] Rename UI wording from `Jira mock` to `Assigned tasks source` or `Jira-compatible tasks`.
- [ ] Keep mock endpoint names internal only.
- [ ] Make all integration URLs environment-driven.
- [ ] Add user-friendly error when proxy is offline.
- [ ] Add user-friendly error when task mapping does not match WTT project/service/contract.

#### Proxy/backend

- [ ] Rename route comments conceptually:
  - [ ] `GET /api/jira/mock-tasks` means future assigned Jira issues.
  - [ ] `POST /api/sync-gitlab` means future Git provider evidence sync.
- [ ] Keep real provider replacement points documented.
- [ ] Do not expose tokens in logs.
- [ ] Keep raw provider response in debug only when safe.

### Done criteria

- The code can be explained as adapter/provider-ready.
- Real Jira/GitLab can be added later without redesigning the WTT form.
- `TasksService` remains clean and WTT-only.

**خلاصه فارسی:** اتصال Jira/GitLab را از فرم و WTT جدا می‌کنیم تا سیستم واقعاً آماده اتصال حساب‌های واقعی باشد.

---

## 🔥✅ Branch 016 — `feature/016-force-smart-worklog-time-confidence`

**Timebox:** 15:00–16:15  
**Priority:** P0 / FORCE  
**Goal:** Make time suggestion realistic and reviewable instead of simply using first-to-last commit blindly.

### Checklist

#### Time calculation logic

- [ ] Create a small pure utility for time suggestion:
  - [ ] `calculateWorklogTimeSuggestion(evidence)`
- [ ] Use first valid evidence as initial start candidate.
- [ ] Use last valid evidence as initial end candidate.
- [ ] Treat commit gaps under 90 minutes as same work session.
- [ ] Treat commit gaps over 90 minutes as break/waiting time.
- [ ] Return:
  - [ ] `suggestedStartTime`
  - [ ] `suggestedEndTime`
  - [ ] `suggestedDurationMinutes`
  - [ ] `excludedGapMinutes`
  - [ ] `reasoning`
- [ ] Never claim the suggestion is exact; label it as suggested.

#### Manual adjustment rules

- [ ] Let user accept suggested time.
- [ ] Let user edit suggested start/end time.
- [ ] Allow up to 30 minutes increase without explanation.
- [ ] Require `adjustmentReason` if user increases time by more than 30 minutes.
- [ ] Block submit/draft approval if required reason is missing.
- [ ] Show a small warning when adjusted time is much higher than evidence time.

#### Confidence score

- [ ] Add `confidenceScore` to the draft state.
- [ ] Add confidence calculation rules:
  - [ ] Jira-compatible task + Git evidence + AI draft + no manual change: high
  - [ ] Small manual change: medium-high
  - [ ] Large manual change with reason: medium
  - [ ] Missing mapping or missing evidence: low
- [ ] Show confidence in modal as a small badge.
- [ ] Include confidence and evidence summary in AI-generated description or hidden draft metadata.

#### Evidence Pack preview

- [ ] Show short evidence preview:
  - [ ] Task key
  - [ ] Branch
  - [ ] Commit count
  - [ ] First evidence
  - [ ] Last evidence
  - [ ] Excluded gaps
  - [ ] Confidence score

### Done criteria

- Demo can explain time suggestion honestly.
- User remains final reviewer.
- Leads can see why extra manual time needs a reason.

**خلاصه فارسی:** زمان پیشنهادی را واقعی‌تر می‌کنیم و برای تغییر زیاد زمان، دلیل و confidence score می‌گذاریم.

---

## 🔥✅ Branch 017 — `feature/017-force-dashboard-demo-polish`

**Timebox:** 16:15–17:10  
**Priority:** P1 / FORCE  
**Goal:** Prevent dashboard from looking broken when financial month data is empty.

### Checklist

#### Dashboard range filters

- [ ] Add quick range filters to Dashboard:
  - [ ] `month_till_today`
  - [ ] `month`
  - [ ] `last_month`
  - [ ] `week`
  - [ ] `this_year`
- [ ] Use `month_till_today` as default.
- [ ] If dashboard data is empty, show empty state instead of broken cards.
- [ ] Optionally add fallback suggestion: "Try this year".
- [ ] Keep selected range synced across dashboard cards/charts.

#### Private announcements

- [ ] Keep private announcements API connected.
- [ ] If API returns empty list, show a clean empty state.
- [ ] Do not treat empty private announcements as error.
- [ ] Keep public announcements visible if available.

#### Recent activities

- [ ] Build recent activities from latest loaded tasks if backend has no separate endpoint.
- [ ] Generate activity text from:
  - [ ] task status
  - [ ] task date
  - [ ] task title
  - [ ] project title
- [ ] Show max 5 recent activities.
- [ ] Add empty state if there are no tasks.

#### Visual polish

- [ ] Avoid zero/NaN values in KPI cards.
- [ ] Make chart empty states intentional.
- [ ] Remove any obvious placeholder text.
- [ ] Run responsive smoke check at current demo resolution.

### Done criteria

- Dashboard looks intentional even when current financial range is empty.
- No empty API result appears as a broken UI.

**خلاصه فارسی:** داشبورد را برای دمو مقاوم می‌کنیم تا خالی بودن ماه مالی شبیه باگ دیده نشود.

---

## ✅ Branch 018 — `feature/018-force-safe-wtt-task-mutation-smoke-test`

**Priority:** P1 / SAFE / DEMO  
**Goal:** Verify real WTT create/update/delete with one controlled test task only.

### Checklist

#### Safety guard

- [x] Keep `enableRealTaskMutation=false` by default.
- [x] Require explicit local enable for mutation test.
- [x] Add test-only title prefix:
  - [x] `[FRONTEND-TEST-DO-NOT-APPROVE]`
- [x] Block create/update/delete for tasks that do not start with test prefix.
- [x] Add confirm modal before real delete mutation.
- [x] Keep rollback/smoke-test notes.
- [x] Add user-friendly 403 message for missing WTT mutation permission.
- [x] Ensure no real data is changed when backend blocks mutation.

#### Test flow

- [x] Enable mutation flag locally for smoke test.
- [x] Send create request for one test task to real WTT API.
- [x] Verify request reaches real WTT backend.
- [x] Receive backend permission response:
  - [x] `403 Forbidden`
  - [x] current user has no access to create/update this resource.
- [x] Confirm no test task was created.
- [x] Skip update/delete because create was blocked by backend permission.
- [x] Set mutation flag back to false.
- [x] Save test evidence:
  - [x] test title
  - [x] mutation flag status
  - [x] backend response
  - [x] cleanup status

### Result

Real mutation path was safely tested until WTT backend permission boundary.  
The frontend safety guard worked, the request reached WTT, and backend correctly blocked the current user with `403 Forbidden`.  
No real task was created, updated, or deleted.

### Done criteria

- [x] Real WTT mutation path is guarded.
- [x] Mutation can only be attempted locally with explicit flag.
- [x] Test task prefix protection exists.
- [x] Backend permission limitation is documented.
- [x] No real work item was changed.
- [x] Demo can say mutation path is implemented, guarded, and permission-checked.

**خلاصه فارسی:** مسیر ثبت واقعی WTT را با گارد تست کردیم؛ درخواست تا backend رفت ولی چون کاربر دسترسی ساخت نداشت، WTT خطای 403 داد و هیچ داده واقعی تغییر نکرد.

---

## ✅ Branch 019 — `feature/019-force-final-demo-cleanup-and-script`

**Priority:** P0 / DEMO  
**Goal:** Make the app presentable and prepare the exact technical demo path.

### Checklist

#### Cleanup

- [x] Remove or avoid noisy console logs where they affect demo clarity.
- [x] Remove visible mock wording from main user-facing flow.
- [x] Use provider-ready wording:
  - [x] assigned task source
  - [x] Git evidence
  - [x] integration proxy
  - [x] Jira-compatible contract
- [x] Confirm loading/error/empty states on:
  - [x] Login
  - [x] Dashboard
  - [x] Tasks
  - [x] Smart Worklog modal
  - [x] Assigned task dropdown
  - [x] Git evidence sync
  - [x] Private announcements empty state
  - [x] Dashboard empty/range state
- [x] Confirm Dashboard range filters:
  - [x] month till today
  - [x] full financial month
  - [x] previous financial month
  - [x] today
  - [x] yesterday
  - [x] week
  - [x] this year
- [x] Confirm left sidebar stats sync with selected Dashboard range.
- [x] Confirm dark mode demo layout.
- [x] Run final build/watch check.

#### Demo script

- [x] Write a 5-minute demo script:
  - [x] What WTT is today
  - [x] What was redesigned
  - [x] Real WTT login/read
  - [x] Dashboard range filters
  - [x] Sidebar stats sync
  - [x] Jira-compatible task selection
  - [x] Git evidence sync
  - [x] AI Persian report
  - [x] Time/confidence/manual confirmation
  - [x] Safe WTT mutation guard
  - [x] What is mock/local now and what becomes real later
- [x] Write a 1-minute fallback script if Git/AI/API fails.
- [x] Write backend dependency list:
  - [x] Jira assigned issue fields needed
  - [x] GitLab token/project/branch access needed
  - [x] WTT task mutation permission needed
  - [x] Optional task detail endpoint needed
- [x] Prepare final demo checklist.

#### Smoke test

- [x] Login fresh.
- [x] Open Dashboard.
- [x] Change dashboard range.
- [x] Confirm sidebar stats update with range.
- [x] Open Tasks.
- [x] Select assigned task from source.
- [x] Sync Git evidence.
- [x] Review AI draft.
- [x] Confirm confidence/evidence note appears.
- [x] Adjust time by under 30 minutes.
- [x] Adjust time by over 30 minutes and verify reason is required.
- [x] Try safe mutation only with flag enabled.
- [x] Confirm backend blocks mutation with 403 for current user.
- [x] Set mutation flag back to false.
- [x] Logout / session cleanup.

### Done criteria

- [x] Demo can be performed without improvising.
- [x] App can survive empty Dashboard/private announcements data.
- [x] App can survive offline/failed integration proxy with user-friendly errors.
- [x] Mutation is guarded and safe by default.
- [x] Build/watch passes.
- [x] Demo script and checklist are ready.

**خلاصه فارسی:** دمو نهایی آماده شد؛ مسیر اصلی از login واقعی تا Smart Worklog، گزارش AI، زمان پیشنهادی، reason اجباری و mutation guard قابل ارائه است.

---

## 🔥 Branch 019.1 — `feature/019.1-force-core-shell-auth-and-sidebar-polish`

**Timebox:** Before demo, only if Branch 019 is stable  
**Priority:** P0 / FORCE / DEMO  
**Goal:** Upgrade the first impression and app shell without changing business logic.

### Scope boundary

This branch is UI/UX polish only.  
Do not redesign backend auth, token strategy, WTT API contracts, or integration logic here.

### Checklist

#### Auth Layout

- [ ] Move login out of the main app shell visual experience.
- [ ] Ensure `/auth/login` does not render:
  - [ ] main sidebar
  - [ ] left filter sidebar
  - [ ] dashboard header
  - [ ] task context panels
- [ ] Rewrite login page as a dedicated two-column auth layout:
  - [ ] form column
  - [ ] brand/gradient/illustration column
- [ ] Use violet/cyan gradient branding for the visual side.
- [ ] Make login responsive:
  - [ ] two columns on desktop
  - [ ] single clean card on mobile
- [ ] Add clean form states:
  - [ ] username required
  - [ ] password required
  - [ ] loading while submitting
  - [ ] disabled submit while submitting
  - [ ] user-friendly error message
  - [ ] show/hide password button
- [ ] Add login helper actions:
  - [ ] remember me checkbox
  - [ ] forgot password link
  - [ ] expired session message state
- [ ] Keep forgot password as UI/route placeholder if backend endpoint is not available.
- [ ] Ensure login still uses `AuthService` and environment-driven API configuration.
- [ ] Confirm no hardcoded auth/proxy URL remains in login component/template.
- [ ] Do not expose tokens or raw auth errors in the UI.

#### Suggested Tailwind treatment

- [ ] Use soft enterprise surfaces:
  - [ ] `bg-white/85 dark:bg-slate-900/85`
  - [ ] `backdrop-blur-xl`
  - [ ] `rounded-3xl`
  - [ ] `ring-1 ring-slate-200/70 dark:ring-white/10`
  - [ ] `shadow-2xl shadow-slate-900/10`
- [ ] Use gradient only for primary CTA and brand panel.
- [ ] Avoid pure black backgrounds in dark mode.
- [ ] Prefer `slate-950`, `slate-900`, and `slate-800` for dark surfaces.

#### Sidebar collapse foundation

- [ ] Add or verify `LayoutService` shell signals:
  - [ ] `isCollapsed`
  - [ ] `isMobileSidebarOpen`
  - [ ] `isFilterPanelOpen`
- [ ] Bind sidebar width using explicit Tailwind classes:
  - [ ] `w-[260px]` when expanded
  - [ ] `w-[76px]` when collapsed
- [ ] Avoid dynamically generated arbitrary classes such as `'w-[' + width + 'px]'`.
- [ ] Use `ngClass` or explicit class maps so Tailwind can detect the classes.
- [ ] Add smooth width transition:
  - [ ] `transition-[width,transform]`
  - [ ] `duration-300`
  - [ ] `ease-[cubic-bezier(0.22,1,0.36,1)]`
- [ ] When sidebar is collapsed:
  - [ ] keep icons visible
  - [ ] hide labels smoothly
  - [ ] show tooltips on hover/focus
  - [ ] keep active route visually clear
  - [ ] keep timer badge visible
- [ ] Use logical positioning:
  - [ ] `start-*`
  - [ ] `end-*`
  - [ ] avoid hardcoded `left/right` where RTL/LTR matters
- [ ] Make mobile sidebar overlay-based instead of shrinking the main layout.

#### Welcome Splash

- [ ] Create a small `WelcomeSplashComponent`.
- [ ] Render it with Angular control flow using `@if`.
- [ ] Show it only after successful login or first dashboard entry.
- [ ] Auto-dismiss after 3–5 seconds.
- [ ] Remove it from DOM after dismiss.
- [ ] Keep it separate from the future notification center.
- [ ] Show contextual text:
  - [ ] greeting based on time
  - [ ] user name
  - [ ] today task summary
  - [ ] correction-needed count if available
- [ ] Add graceful fallback if dashboard summary data is unavailable.

### Done criteria

- [ ] Login page looks like a dedicated enterprise entry point.
- [ ] Login does not visually appear inside the dashboard shell.
- [ ] Sidebar collapse/expand is smooth and does not break layout.
- [ ] Collapsed sidebar remains usable through icons and tooltips.
- [ ] Welcome splash appears once and disappears cleanly.
- [ ] No auth/proxy URL is hardcoded in login UI code.
- [ ] Build/watch still passes.

**خلاصه فارسی:** ورود و اسکلت اصلی برنامه حرفه‌ای‌تر می‌شود؛ Login از داشبورد جدا می‌شود، سایدبار Collapse اصولی می‌گیرد و Welcome Splash سبک اضافه می‌شود.

---

## 🪄 Branch 019.2 — `feature/019.2-force-smart-worklog-wizard-task-drawer`

**Timebox:** Before demo, only if Smart Worklog flow is already stable  
**Priority:** P0 / FORCE / DEMO  
**Goal:** Convert the current Smart Worklog form into a guided AI experience and standardize task edit/detail UX.

### Scope boundary

This branch must not rewrite WTT task mutation logic.  
It only improves the user flow around existing Smart Worklog, task edit, and routing.

### Checklist

#### AI Worklog Stepper

- [ ] Convert the current Smart Worklog form into a 3-step wizard:
  - [ ] Step 1: select assigned task and WTT mapping
  - [ ] Step 2: generate/review AI description
  - [ ] Step 3: confirm final worklog draft
- [ ] Use Angular `@switch` or equivalent state-driven rendering for step content.
- [ ] Keep form state when moving between steps.
- [ ] Add visible step progress:
  - [ ] active step
  - [ ] completed step
  - [ ] disabled future step
- [ ] Step 1 should show:
  - [ ] assigned task source dropdown
  - [ ] selected task key/title
  - [ ] project/service/contract mapping
  - [ ] mapping error state
- [ ] Step 2 should show:
  - [ ] Git evidence sync state
  - [ ] AI generation button
  - [ ] loading skeleton/shimmer
  - [ ] generated Persian description
  - [ ] retry action
  - [ ] AI unavailable fallback
- [ ] Add quick AI tone actions as demo polish:
  - [ ] more formal
  - [ ] shorter
  - [ ] more technical
- [ ] Keep AI tone actions as UI-level polish if real provider support is not ready.
- [ ] Step 3 should show final review:
  - [ ] task title/key
  - [ ] suggested start/end time
  - [ ] duration
  - [ ] confidence score
  - [ ] evidence summary
  - [ ] final editable description
- [ ] Keep user as final reviewer before any WTT mutation attempt.
- [ ] Preserve existing safety guard for real task mutation.
- [ ] Show friendly 403/permission message if backend blocks mutation.

#### AI loading and visual polish

- [ ] Replace raw spinner-only loading with a more polished skeleton state.
- [ ] Use one strong primary AI CTA with gradient.
- [ ] Avoid using too many gradients inside the form.
- [ ] Keep the generated AI draft in a readable card.
- [ ] Do not show raw provider/mock wording to end users.

#### Task edit Slide-over

- [ ] Replace task edit modal with a slide-over drawer.
- [ ] Drawer should open from logical `end` side.
- [ ] Add backdrop with blur.
- [ ] Add internal scroll inside drawer body.
- [ ] Add sticky footer actions:
  - [ ] save
  - [ ] cancel
- [ ] Add close behavior:
  - [ ] close button
  - [ ] Escape key
  - [ ] backdrop click
- [ ] Restore focus to the triggering button after close.
- [ ] Keep create flow separate from edit flow if needed.

#### Task detail routing

- [ ] Standardize task detail route as lowercase:
  - [ ] `/tasks/:id`
- [ ] Ensure no route uses uppercase path segments.
- [ ] Make row click open task detail page only when intended.
- [ ] Keep edit button opening the drawer, not navigating away.
- [ ] Add placeholder detail page only if full task details are not ready.
- [ ] Do not overbuild full task detail chat before demo unless already stable.

### Done criteria

- [ ] Smart Worklog feels like a guided AI workflow, not a long raw form.
- [ ] User can understand each step without explanation.
- [ ] AI failure does not break the flow.
- [ ] Task edit opens in a drawer.
- [ ] Task detail route is lowercase and consistent.
- [ ] Existing mutation guard remains active.
- [ ] Build/watch still passes.

**خلاصه فارسی:** فرم Smart Worklog به ویزارد سه‌مرحله‌ای تبدیل می‌شود، ادیت تسک از مودال به Drawer می‌رود و مسیر `/tasks/:id` استاندارد می‌شود.

---

## ⚡ Branch 019.3 — `feature/019.3-force-command-palette-timer-dashboard-polish`

**Timebox:** Before demo, only after core shell is stable  
**Priority:** P1 / DEMO  
**Goal:** Add high-impact wow factors: Command Palette, global timer badge, and cleaner dashboard visuals.

### Scope boundary

This branch adds demo polish and shell-level UX.  
Do not start a full notification center, full presence module, or engineering analytics dashboard here.

### Checklist

#### Command Palette

- [ ] Implement Command Palette using `@angular/cdk/overlay`.
- [ ] Open palette with:
  - [ ] `Ctrl + K`
  - [ ] `Cmd + K`
- [ ] Close palette with:
  - [ ] Escape
  - [ ] backdrop click
  - [ ] selecting an item
- [ ] Render overlay above all app shell layers.
- [ ] Add blurred backdrop.
- [ ] Prevent z-index conflicts with sidebar, drawer, and splash.
- [ ] Add grouped results:
  - [ ] Navigation
  - [ ] Tasks
  - [ ] Smart Worklog
  - [ ] Reports
  - [ ] AI actions
- [ ] Add demo-friendly commands:
  - [ ] Open dashboard
  - [ ] Open tasks
  - [ ] Start Smart Worklog
  - [ ] Show tasks needing correction
  - [ ] Open today report
  - [ ] Open AI preferences
- [ ] Add keyboard navigation if time allows:
  - [ ] Arrow Down
  - [ ] Arrow Up
  - [ ] Enter
- [ ] Add empty result state.
- [ ] Add proxy/API failure-safe behavior if results rely on live data.
- [ ] Do not make Command Palette dependent on unstable backend endpoints.

#### Suggested Command Palette Tailwind treatment

- [ ] Use:
  - [ ] `fixed top-20 left-1/2 z-[90]`
  - [ ] `w-[calc(100%-2rem)] max-w-2xl`
  - [ ] `-translate-x-1/2`
  - [ ] `rounded-3xl`
  - [ ] `bg-white/90 dark:bg-slate-900/90`
  - [ ] `backdrop-blur-2xl`
  - [ ] `shadow-2xl shadow-slate-950/25`
  - [ ] `ring-1 ring-slate-200/80 dark:ring-white/10`

#### Global Timer Badge

- [ ] Create or verify a singleton `TimerService`.
- [ ] Store timer state with signals:
  - [ ] `activeTaskId`
  - [ ] `activeTaskTitle`
  - [ ] `startedAt`
  - [ ] `elapsedTime`
  - [ ] `isRunning`
- [ ] Ensure timer does not reset on route change.
- [ ] Show active timer in:
  - [ ] sidebar expanded state
  - [ ] sidebar collapsed state
  - [ ] active task row
  - [ ] optional topbar compact badge
- [ ] Add pulse indicator when timer is running.
- [ ] Prevent multiple simultaneous timers unless explicitly allowed.
- [ ] If user starts a new timer while another is active, require clear behavior:
  - [ ] stop previous timer
  - [ ] or ask confirmation
- [ ] Keep timer usable without real presence mutation.
- [ ] Do not mix timer polish with full presence mutation redesign.

#### Dashboard Donut and KPI polish

- [ ] Replace or polish the current dashboard chart with a clean Doughnut chart.
- [ ] Keep chart segments limited and readable.
- [ ] Add center label:
  - [ ] productivity percentage
  - [ ] selected range label
- [ ] Use rounded segment edges where ECharts supports it.
- [ ] Add soft shadow/glow only in dark mode where it improves clarity.
- [ ] Remove or hide obvious placeholders:
  - [ ] Coming Soon
  - [ ] empty decorative cards
  - [ ] non-functional activity blocks
- [ ] Keep KPI cards readable and non-zero/NaN safe.
- [ ] Add intentional empty state for empty dashboard data.
- [ ] Keep selected dashboard range synced where currently expected.

### Done criteria

- [ ] `Ctrl/Cmd + K` reliably opens the Command Palette.
- [ ] Command Palette works above the whole shell.
- [ ] Timer remains alive across page navigation.
- [ ] Collapsed sidebar still shows active timer state.
- [ ] Dashboard looks intentional even with limited data.
- [ ] No placeholder text is visible in the main demo flow.
- [ ] Build/watch still passes.

**خلاصه فارسی:** سرچ سراسری با Ctrl+K، تایمر سراسری و نمودار Donut داشبورد اضافه یا پولیش می‌شوند تا دمو جذاب‌تر و حرفه‌ای‌تر دیده شود.

---

## 🎛️ Branch 019.4 — `feature/019.4-force-reports-settings-visual-consistency`

**Timebox:** Before demo, only if main flow is safe  
**Priority:** P1 / DEMO  
**Goal:** Make Reports, Settings, and theme surfaces visually consistent with the redesigned shell.

### Scope boundary

This branch is not the full Profile/My Report center.  
Full profile/report center remains Branch 021.  
Full integration settings center remains Branch 025.

### Checklist

#### Reports polish

- [ ] Align Reports page with the new shell visual system.
- [ ] Remove old/light-only visual style from reports.
- [ ] Add or polish Reports KPI cards:
  - [ ] total work time
  - [ ] task count
  - [ ] confirmed worklogs
  - [ ] correction-needed count
- [ ] Add clean range filter area.
- [ ] Add export button UI:
  - [ ] PDF placeholder if export is not real
  - [ ] Excel placeholder if export is not real
- [ ] Make export placeholders safe and honest:
  - [ ] disabled with tooltip
  - [ ] or demo-only visual action with no fake claim
- [ ] Replace raw table styling with clean DataGrid styling.
- [ ] Add table states:
  - [ ] loading
  - [ ] empty
  - [ ] error
- [ ] Use hover states and status badges.
- [ ] Ensure Reports page works in both light and dark mode.

#### Settings/Profile micro-polish

- [ ] Clean existing Settings/Profile entry points without building the full profile center.
- [ ] Add small AI preferences demo section if time allows:
  - [ ] report tone
  - [ ] concise/balanced/detailed preference
  - [ ] formal/technical/managerial style
- [ ] Keep AI preference state local/mock if backend persistence is not available.
- [ ] Do not claim AI preferences are saved server-side unless implemented.
- [ ] Keep settings UI simple and demo-safe.

#### Theme consistency

- [ ] Use shared visual language across Dashboard, Tasks, Reports, Settings:
  - [ ] `rounded-3xl`
  - [ ] `ring-1`
  - [ ] `shadow-sm`
  - [ ] `bg-white`
  - [ ] `dark:bg-slate-900/70`
- [ ] Reduce excessive borders.
- [ ] Use `ring` and soft shadows instead of heavy outlines.
- [ ] Replace pure black dark surfaces with slate/zinc surfaces.
- [ ] Keep primary color as violet and accent as cyan.
- [ ] Use emerald for success, amber for warning, rose/red for danger.
- [ ] Verify contrast for text in dark mode.

### Done criteria

- [ ] Reports no longer looks visually disconnected from the rest of the app.
- [ ] Settings/Profile does not look unfinished.
- [ ] AI preferences are demo-safe and honestly represented.
- [ ] No full post-demo roadmap scope is accidentally started.
- [ ] Light and dark mode feel like the same product.
- [ ] Build/watch still passes.

**خلاصه فارسی:** صفحه گزارش‌ها و تنظیمات از نظر ظاهر با داشبورد و تسک‌ها هماهنگ می‌شوند، بدون اینکه وارد پیاده‌سازی کامل پروفایل یا تنظیمات Integration شویم.

---

## 🧪 Branch 019.5 — `feature/019.5-force-demo-hardening-responsive-qa`

**Timebox:** Last pass before Branch 020 morning buffer  
**Priority:** P0 / FORCE / DEMO  
**Goal:** Make the polished demo safe, responsive, and resilient.

### Scope boundary

This branch fixes blockers and demo-breaking UX issues only.  
Do not add new product features here.

### Checklist

#### Error handling

- [ ] Ensure no raw API error appears in the main UI.
- [ ] Handle WTT mutation `403 Forbidden` with a user-friendly message.
- [ ] Handle offline integration proxy with a clear message.
- [ ] Handle AI provider failure with fallback/retry.
- [ ] Handle empty assigned task source.
- [ ] Handle missing project/service/contract mapping.
- [ ] Confirm dangerous mutation flags remain disabled by default:
  - [ ] `enableRealTaskMutation=false`
  - [ ] `enableRealPresenceMutation=false`
- [ ] Keep real mutation attempts restricted to test-prefixed tasks only.
- [ ] Do not change real WTT data during demo unless explicitly guarded and intentional.

#### Loading / empty / error states

- [ ] Verify state coverage for:
  - [ ] Login
  - [ ] Dashboard
  - [ ] Tasks
  - [ ] Smart Worklog Wizard
  - [ ] Command Palette
  - [ ] Reports
  - [ ] Settings/Profile micro-polish
  - [ ] Sidebar stats
  - [ ] Timer badge
- [ ] Replace broken-looking empty areas with intentional empty states.
- [ ] Avoid zero/NaN display in KPI cards.
- [ ] Remove visible debug/mock text from user-facing UI.
- [ ] Keep provider-ready wording:
  - [ ] assigned task source
  - [ ] Git evidence
  - [ ] integration proxy
  - [ ] Jira-compatible contract

#### Responsive QA

- [ ] Smoke test desktop layout:
  - [ ] 1920px
  - [ ] 1440px
  - [ ] 1366px
- [ ] Smoke test tablet layout:
  - [ ] 1024px
  - [ ] 768px
- [ ] Smoke test mobile layout:
  - [ ] around 390px width
- [ ] Confirm no unintended horizontal scroll.
- [ ] Confirm sidebar becomes usable on mobile.
- [ ] Confirm filter panel does not crush main content.
- [ ] Confirm drawer becomes full-width on mobile.
- [ ] Confirm Command Palette fits mobile width.
- [ ] Confirm Auth Layout is clean on mobile.

#### Accessibility and keyboard polish

- [ ] Add `aria-label` for icon-only buttons.
- [ ] Add visible focus ring for interactive controls.
- [ ] Confirm Escape closes:
  - [ ] Command Palette
  - [ ] Drawer
  - [ ] modal/wizard if applicable
- [ ] Confirm keyboard users can reach main actions.
- [ ] Confirm tooltip does not hide essential information.
- [ ] Respect reduced motion where easy to do.

#### Final technical checks

- [ ] Run `npm run build`.
- [ ] Run frontend locally.
- [ ] Run proxy locally.
- [ ] Login fresh.
- [ ] Run full demo path once.
- [ ] Confirm console does not show obvious demo-breaking errors.
- [ ] Confirm no secrets are present in source or shared files.
- [ ] Confirm mutation flags are back to safe defaults.
- [ ] Prepare final notes for Branch 020 morning buffer.

### Done criteria

- [ ] One clean full rehearsal passes after polish.
- [ ] No new risky feature was added during hardening.
- [ ] Demo can survive API/proxy/AI failure with graceful fallback.
- [ ] Responsive layout does not break at common demo sizes.
- [ ] Build/watch passes.
- [ ] Branch 020 can remain a true bugfix buffer.

**خلاصه فارسی:** آخرین مرحله فقط مقاوم‌سازی دمو است؛ خطاها، حالت‌های خالی، ریسپانسیو، دسترسی‌پذیری و Build بررسی می‌شوند تا Branch 020 فقط باگ‌فیکس صبح دمو بماند.

---

## 🌅 Branch 020 — `feature/020-morning-demo-bugfix-buffer`

**Timebox:** Tomorrow morning, 2 hours before daily  
**Priority:** P0 / BUFFER  
**Goal:** Fix only demo blockers; no new scope.

### Checklist

- [ ] Pull latest local state.
- [ ] Run frontend.
- [ ] Run proxy.
- [ ] Login fresh.
- [ ] Run full demo path once.
- [ ] Fix only:
  - [ ] build blocker
  - [ ] login blocker
  - [ ] tasks page blocker
  - [ ] smart worklog blocker
  - [ ] dashboard visual blocker
- [ ] Do not add new feature.
- [ ] Prepare final notes for presentation.

### Done criteria

- One clean successful rehearsal before daily.
- No new risky feature added in the morning.

**خلاصه فارسی:** فردا صبح فقط رفع اشکال دمو انجام می‌دهیم، نه توسعه feature جدید.

---

# Post-Demo Product Roadmap

## 🔜 Branch 021 — `feature/021-profile-and-user-report-center`

**Priority:** LATER  
**Goal:** Merge user profile, user report, and personal work summary into one page.

### Checklist

- [ ] Add sidebar item near Settings: `Profile / My Report`.
- [ ] Show profile information.
- [ ] Show monthly work summary.
- [ ] Show task summary.
- [ ] Show presence summary.
- [ ] Show AI personal report section.
- [ ] Add export-ready structure for lead/HR later.
- [ ] Keep all data read-only first.
- [ ] Write branch report.

**خلاصه فارسی:** پروفایل و گزارش کاربر را در یک صفحه واحد و مفید جمع می‌کنیم.

---

## 🔜 Branch 022 — `feature/022-notification-center-and-announcements`

**Priority:** LATER  
**Goal:** Merge notifications and announcements into a clean notification center.

### Checklist

- [ ] Create notification center route/page.
- [ ] Use header bell as shortcut.
- [ ] Show toast/dropdown notification at top when new item arrives.
- [ ] Store public/private announcements in archive view.
- [ ] Distinguish:
  - [ ] transient notification
  - [ ] persistent announcement
- [ ] Keep empty states clean.
- [ ] Avoid intrusive notifications.
- [ ] Write branch report.

**خلاصه فارسی:** اعلان‌های لحظه‌ای و اطلاعیه‌ها را در یک مرکز اعلان مرتب می‌کنیم.

---

## 🔜 Branch 023 — `feature/023-requests-leave-and-mission-center`

**Priority:** LATER  
**Goal:** Merge leave and mission into one Requests module instead of separate heavy pages.

### Checklist

- [ ] Create `Requests` feature.
- [ ] Add request type:
  - [ ] leave
  - [ ] mission
- [ ] Build shared list/filter layout.
- [ ] Build shared create/edit modal.
- [ ] Keep API integration read-only first if endpoints are uncertain.
- [ ] Add clean empty state.
- [ ] Add request status badges.
- [ ] Write branch report.

**خلاصه فارسی:** مرخصی و ماموریت را به جای صفحات جدا، در یک ماژول درخواست‌ها جمع می‌کنیم.

---

## 🔜 Branch 024 — `feature/024-presence-quick-action-and-history`

**Priority:** LATER  
**Goal:** Replace heavy presence page need with quick action + history drawer/page.

### Checklist

- [ ] Keep sidebar presence orb as primary quick action.
- [ ] Add presence history drawer or compact page.
- [ ] Connect active presence read.
- [ ] Add guarded clock-in.
- [ ] Add guarded clock-out.
- [ ] Prevent double clock-in.
- [ ] Add delete/edit only if company policy allows.
- [ ] Write branch report.

**خلاصه فارسی:** حضور را به جای صفحه سنگین، به اکشن سریع و تاریخچه سبک تبدیل می‌کنیم.

---

## 🔜 Branch 025 — `feature/025-integration-settings-center`

**Priority:** LATER  
**Goal:** Add settings UI for WTT/Jira/GitLab/AI integrations.

### Checklist

- [ ] Add integration settings page.
- [ ] Add Jira-compatible provider config:
  - [ ] base URL
  - [ ] token placeholder
  - [ ] project mapping
- [ ] Add GitLab provider config:
  - [ ] base URL
  - [ ] token placeholder
  - [ ] project id
  - [ ] branch pattern
- [ ] Add AI provider config placeholder.
- [ ] Do not store secrets insecurely in frontend.
- [ ] Use backend/proxy for secret storage later.
- [ ] Add connection test buttons.
- [ ] Write branch report.

**خلاصه فارسی:** تنظیمات اتصال WTT/Jira/GitLab/AI را حرفه‌ای و قابل توسعه می‌کنیم.

---

## 🔜 Branch 026 — `feature/026-evidence-pack-ui-and-lead-approval`

**Priority:** LATER  
**Goal:** Make evidence visible for team leads and approval flow.

### Checklist

- [ ] Add Evidence Pack UI.
- [ ] Show task, branch, commits, MR, AI summary, confidence.
- [ ] Add developer confirmation state.
- [ ] Add team lead approval state.
- [ ] Add reject/rework reason.
- [ ] Add audit trail.
- [ ] Keep raw surveillance data minimized.
- [ ] Write branch report.

**خلاصه فارسی:** برای لید، شواهد کار و جریان تایید را شفاف ولی غیرکنترلی نمایش می‌دهیم.

---

## 🔜 Branch 027 — `feature/027-engineering-intelligence-dashboard`

**Priority:** LATER  
**Goal:** Add team-level engineering intelligence after MVP is stable.

### Checklist

- [ ] Add cycle time metrics.
- [ ] Add review waiting time.
- [ ] Add rework indicators.
- [ ] Add bottleneck summary.
- [ ] Add team-level report, not individual ranking.
- [ ] Add AI weekly summary.
- [ ] Keep privacy/anti-surveillance rules.
- [ ] Write branch report.

**خلاصه فارسی:** بعد از پایدار شدن MVP، داشبورد هوشمند مهندسی برای تحلیل تیمی اضافه می‌شود.

---

# Final Demo Checklist

## Must pass before sleep

- [ ] No secrets in source.
- [ ] `npm run build` passes.
- [ ] Login works.
- [ ] Dashboard loads or shows intentional empty state.
- [ ] Tasks list loads.
- [ ] Jira-compatible task dropdown works.
- [ ] Selected task fills WTT form.
- [ ] Git evidence sync fills AI description.
- [ ] Time suggestion works.
- [ ] Manual time increase over 30 minutes requires reason.
- [ ] Confidence score is visible or included in draft.
- [ ] Safe test mutation is either verified or clearly disabled.
- [ ] Demo script is ready.

---

# Final Scope Lock

Until tomorrow demo, do not start:

- Full profile page implementation.
- Full leave/mission implementation.
- Full notification center.
- Full presence page redesign.
- HR/payroll export.
- Team lead approval UI.
- Engineering intelligence dashboard.

Only finish the forced branches 014–020.
