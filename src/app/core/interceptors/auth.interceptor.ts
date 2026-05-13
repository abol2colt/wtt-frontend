import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Login request must not include Authorization because we do not have a token yet.
  const isLoginRequest = req.url.includes('/login/');
  const isSmartProxyRequest = req.url.startsWith('http://localhost:3000/api');
  if (isLoginRequest || isSmartProxyRequest) {
    return next(req);
  }

  const authHeaderValue = authService.getAuthHeaderValue();

  if (!authHeaderValue) {
    return next(req);
  }

  // Attach the current WTT auth token to every protected API request.
  const authenticatedRequest = req.clone({
    setHeaders: {
      Authorization: authHeaderValue,
    },
  });

  return next(authenticatedRequest);
};
