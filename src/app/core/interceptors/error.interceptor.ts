import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { environment } from '../../../environments/environment';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isIntegrationProxyRequest = req.url.startsWith(environment.integrationProxyBaseUrl);
      if (error.status === 401 && !isIntegrationProxyRequest) {
        // A 401 means the token is missing, expired, or rejected by the backend.
        authService.logout();
        router.navigate(['/auth/login']);
      } else if (error.status === 401 && isIntegrationProxyRequest) {
        // A 403 means the token is valid, but this user does not have permission.
        console.error('Integration provider unauthorized. Do not logout WTT user.');
      } else if (error.status === 503) {
        // A 503 usually means the backend or gateway is temporarily unavailable.
        console.error('Service unavailable: WTT backend is not available right now.');
      } else {
        // Keep unexpected errors visible during development.
        console.error(`Unexpected HTTP error: ${error.message}`);
      }

      return throwError(() => error);
    }),
  );
};
