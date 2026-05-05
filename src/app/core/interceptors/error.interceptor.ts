import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.error('🔒 خطای ۴۰۱: توکن نامعتبر است یا منقضی شده. هدایت به صفحه لاگین...');
        // TODO: بعداً اینجا کد پاک کردن Signal کاربر و هدایت به صفحه لاگین رو می‌زنیم
        // router.navigate(['/auth/login']);
      } else if (error.status === 403) {
        console.error(
          '⛔ خطای ۴۰۳: شما دسترسی لازم برای این عملیات را ندارید (RBAC/IDOR Blocked).',
        );
      } else if (error.status === 503) {
        console.error(
          '🛡️ خطای ۵۰۳: سیستم فایروال (WAF) درخواست شما را به دلیل ترافیک غیرعادی مسدود کرد!',
        );
      } else {
        console.error(`❌ خطای ناشناخته رخ داد: ${error.message}`);
      }

      return throwError(() => error);
    }),
  );
};
