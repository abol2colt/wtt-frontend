# WTT Smart Worklog Demo Script

## 5-minute demo

سلام. هدف این نسخه فقط ریدیزاین UI نبود؛ من WTT را به سمت Smart Worklog بردم.

1. Login واقعی WTT انجام می‌شود و token واقعی گرفته می‌شود.
2. Dashboard داده‌های واقعی WTT را نشان می‌دهد و بازه‌هایی مثل ماه جاری، ماه مالی کامل و ماه مالی گذشته دارد.
3. Sidebar چپ با بازه انتخاب‌شده Dashboard sync می‌شود.
4. در صفحه Tasks، لیست وظایف از WTT واقعی خوانده می‌شود.
5. برای ثبت وظیفه جدید، کاربر می‌تواند از منبع وظایف انتسابی یک task انتخاب کند.
6. این منبع فعلاً Jira-compatible mock/local است، ولی contract آن آماده اتصال Jira واقعی است.
7. با انتخاب task، project/service/contract فرم WTT پر می‌شود.
8. سپس کاربر از شواهد Git گزارش تولید می‌کند.
9. proxy کامیت‌های branch مربوط به task را می‌گیرد و Gemini گزارش فارسی قابل بررسی می‌سازد.
10. سیستم زمان پیشنهادی، confidence و evidence summary می‌دهد.
11. اگر کاربر زمان را بیشتر از ۳۰ دقیقه افزایش دهد، باید دلیل وارد کند.
12. mutation واقعی WTT پشت safety flag است و فقط برای task تستی مجاز است.
13. Smoke test mutation تا backend رفت، ولی WTT برای کاربر فعلی 403 داد؛ بنابراین داده واقعی تغییر نکرد.
14. هدف سیستم کنترل کارمند نیست؛ هدف حذف کار دستی، شفافیت evidence و تایید انسانی است.

## What is real?

- WTT login: real
- WTT read APIs: real
- Dashboard and Tasks read: real
- Jira source: currently mock/local, but Jira-compatible
- Git evidence source: local/provider-ready
- AI report: real Gemini through proxy
- WTT mutation: guarded and permission-checked

## Fallback if Git/AI fails

اگر GitLab یا AI در دمو در دسترس نبود:
- فرم WTT همچنان از task source پر می‌شود.
- توضیح می‌دهم proxy لایه integration است.
- response mock/local قابل جایگزینی با GitLab واقعی است.
- معماری provider-ready است و UI نیاز به redesign ندارد.

## Backend dependencies

### Jira assigned issue fields

- key
- title
- assignee
- project_id
- service_id
- contract_id
- branch_name

### GitLab access

- base URL
- project id
- token
- branch pattern by task key

### WTT permissions

- create task
- update own/test task
- delete own/test task
- optional task detail endpoint
