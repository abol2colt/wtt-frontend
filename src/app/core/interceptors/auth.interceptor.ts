import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // for test develop= token > hardcore => auto rec+token
  const token = 'YOUR_TEMPORARY_TOKEN_HERE';

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
