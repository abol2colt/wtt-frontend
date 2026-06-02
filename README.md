# WTT Frontend

Angular 21 frontend for the WTT work tracking dashboard. The app covers login, dashboard analytics, task/worklog management, presence flows, reports, settings, and the Smart Worklog draft flow that combines assigned tasks, Git evidence, and AI-generated Persian descriptions.

## Stack

- Angular 21 standalone components
- Angular signals and reactive forms
- Angular router guards and HTTP interceptors
- Tailwind CSS 4 + SCSS
- ECharts through `ngx-echarts`
- `date-fns-jalali` for Persian date handling
- Vitest through Angular's unit test builder

## Local setup

```bash
npm ci
npm start
```

Use the API proxy when local browser CORS would block the WTT API:

```bash
npm run start:proxy
```

The integration proxy should run from `../wtt-proxy` on `http://localhost:3000`.

## Quality commands

```bash
npm run format:check
npm run typecheck
npm test
npm run build
```

## Safety policy

- Real WTT task mutations are disabled by default through `enableRealTaskMutation`.
- Real presence mutations are disabled by default through `enableRealPresenceMutation`.
- Integration mock mode is enabled only in development.
- Auth tokens are kept at runtime in browser storage according to the remember-me option and are sent by the HTTP interceptor.
- No real provider token or API key must be committed.

## Project structure

```txt
src/app
  core/          layout, guards, interceptors and singleton services
  features/      dashboard, tasks, reports, settings, presence and auth screens
  shared/        reusable models and utilities
  environments/  production and development runtime flags
```

## Known technical debt

- `TasksComponent` and `LeftSidebarComponent` are still large and should be split further in dedicated refactor branches.
- Global Tailwind import in `styles.scss` triggers a Sass deprecation warning, but it does not block the Angular 21 build.
- Current unit test coverage is minimal; feature-level tests should be added for task form mapping, filters, auth/session behavior, and integration fallback states.
