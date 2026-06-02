import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { clientLogger } from '../../shared/utils/client-logger';
import { AuthService } from '../services/auth/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isIntegrationProxyRequest = req.url.startsWith(environment.integrationProxyBaseUrl);

      if (error.status === 401 && !isIntegrationProxyRequest) {
        authService.logout();
        router.navigate(['/auth/login']);
      } else if (error.status === 401 && isIntegrationProxyRequest) {
        clientLogger.warn(
          'Integration provider authorization failed. WTT session was kept active.',
        );
      } else if (error.status === 503) {
        clientLogger.warn('WTT backend or gateway is temporarily unavailable.');
      } else {
        clientLogger.error('Unexpected HTTP error.', {
          status: error.status,
          message: error.message,
        });
      }

      return throwError(() => error);
    }),
  );
};
