# WTT Frontend — Current Cleanup Report

## Summary

The frontend is an Angular 21 application with real WTT read/login integration and a Smart Worklog demo flow. The cleanup focused on safety, buildability, production hygiene, documentation and low-risk modularization.

## What changed

- Production environment no longer points to a personal LAN IP.
- Development environment remains local-proxy friendly.
- Angular scripts now support repeatable build/test/typecheck/format flows.
- The app spec now matches the actual routed shell instead of the default generated Angular page.
- Auth no longer mirrors tokens into a JavaScript-readable cookie.
- Direct console noise in the error interceptor was replaced by a production-quiet logger.
- Task status metadata and task-page types were moved out of the main component.
- Compiler warnings for unused imports were resolved.
- API reference token example was sanitized.

## Verified commands

```bash
npm run format:check
npm run typecheck
npm test
npm run build
```

## Known limitations

- Large components remain and should be split in the next dedicated refactor branches.
- Sass import warning remains documented.
- Only shell-level tests exist; feature-level coverage should be added.
