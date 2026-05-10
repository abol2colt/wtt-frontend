import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // for test develop= token > hardcore => auto rec+token
  const token = 'YOUR_TEMPORARY_TOKEN_HERE';
  if (req.url.startsWith('/mock-api') || req.url.includes('192.168.130.44:1234')) {
    return next(req);
  }
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Token ${token}`,
      },
    });
    //changed req => server
    return next(clonedRequest);
  }

  return next(req);
};
