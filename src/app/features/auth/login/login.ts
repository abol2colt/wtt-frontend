import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  // Public because the template may need to read auth-related state.
  public readonly authService = inject(AuthService);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    // If the user already has a valid local auth session, do not show the login page again.
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage.set('نام کاربری و رمز عبور را وارد کن.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const credentials = this.loginForm.getRawValue();

    this.authService
      .login(credentials)
      .pipe(
        switchMap(() => {
          // Fetch the authenticated user's profile after the token is saved.
          return this.authService.fetchProfile();
        }),
      )
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/dashboard']);
        },

        error: () => {
          this.loading.set(false);
          this.errorMessage.set('ورود انجام شد، اما دریافت اطلاعات پروفایل ناموفق بود.');
        },
      });
  }
}
