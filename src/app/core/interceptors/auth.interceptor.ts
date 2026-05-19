import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const isLoginRequest = req.url.includes('/login/');
  const isIntegrationProxyRequest =
    Boolean(environment.integrationProxyBaseUrl) &&
    req.url.startsWith(environment.integrationProxyBaseUrl);

  if (isLoginRequest || isIntegrationProxyRequest) {
    return next(req);
  }

  const authHeaderValue = authService.getAuthHeaderValue();

  if (!authHeaderValue) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: authHeaderValue,
      },
    }),
  );
};
