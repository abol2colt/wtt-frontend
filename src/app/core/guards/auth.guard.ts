import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Protected routes require an auth token created by the real WTT login flow.
  if (authService.isAuthenticated()) {
    return true;
  }

  // If the user is not authenticated, keep the app in the login flow.
  return router.createUrlTree(['/auth/login']);
};
