import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // فعلاً توکن رو هاردکد می‌کنیم تا بعداً از لاگین واقعی یا LocalStorage بخونیم
  const token = 'YOUR_TEMPORARY_TOKEN_HERE';

  // اگر توکن وجود داشت، ریکوئست رو کپی می‌کنیم و هدر رو بهش می‌چسبونیم
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Token ${token}`,
      },
    });
    // ریکوئست تغییر یافته رو می‌فرستیم سمت سرور
    return next(clonedRequest);
  }

  // اگر توکنی نبود، همون ریکوئست ساده رو می‌فرستیم
  return next(req);
};
