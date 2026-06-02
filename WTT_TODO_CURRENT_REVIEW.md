# WTT Current TODO — Post Cleanup

## Done in this cleanup branch

- [x] Run frontend install/build/test checks.
- [x] Fix failing app unit test.
- [x] Add professional npm scripts: `typecheck`, `format`, `format:check`, `clean`, `build:dev`.
- [x] Remove local/hardcoded integration IP from production environment.
- [x] Add development environment replacement.
- [x] Remove unsafe auth-token cookie mirroring.
- [x] Remove noisy direct console logging from the HTTP error interceptor.
- [x] Split task-page types/status metadata into smaller files.
- [x] Remove Persian/temporary comments from source files.
- [x] Keep real mutation flags disabled by default.
- [x] Document final review and remaining risks.

## Must stay safe

- [ ] Do not enable real task mutation without a signed-off test account and cleanup plan.
- [ ] Do not enable real presence mutation without backend permission confirmation.
- [ ] Do not commit `.env`, provider tokens, local runtime integration files, `node_modules`, `.angular`, or `dist`.

## Next frontend refactor branches

1. `refactor/tasks-page-split`
   - Split the large tasks template into task summary, filters, list/grid, modal wizard and evidence picker components.
2. `refactor/left-sidebar-split`
   - Split attendance, presence, running task timer and statistics widgets.
3. `test/tasks-smart-worklog-flow`
   - Add tests for Jira task selection, project details preselection and AI fallback behavior.
4. `test/auth-session-flow`
   - Add tests for remember-me storage, logout cleanup and interceptor behavior.
5. `chore/style-system-hardening`
   - Review the Tailwind/Sass import strategy and reduce oversized component styles.
