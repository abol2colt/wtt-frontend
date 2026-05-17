import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LayoutService } from '../../../core/services/layout/layout.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly layout = inject(LayoutService);
  private readonly rememberedUsernameStorageKey = 'wtt_username';
  private readonly rememberMeStorageKey = 'wtt_remember_me';

  // Public because the template may need to read auth-related state.
  public readonly authService = inject(AuthService);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showPassword = signal(false);
  readonly sessionExpired = signal(false);

  readonly loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [true],
  });

  ngOnInit(): void {
    this.sessionExpired.set(this.route.snapshot.queryParamMap.get('expired') === 'true');
    this.restoreRememberedLogin();

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

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { username, password, rememberMe } = this.loginForm.getRawValue();

    this.authService
      .login({ username, password }, rememberMe)
      .pipe(switchMap(() => this.authService.fetchProfile()))
      .subscribe({
        next: () => {
          if (rememberMe) {
            localStorage.setItem(this.rememberedUsernameStorageKey, username);
            localStorage.setItem(this.rememberMeStorageKey, 'true');
          } else {
            localStorage.removeItem(this.rememberedUsernameStorageKey);
            localStorage.removeItem(this.rememberMeStorageKey);
          }

          this.isLoading.set(false);
          this.layout.showWelcomeSplashOnce();
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.isLoading.set(false);
          this.errorMessage.set('ورود ناموفق بود. نام کاربری یا رمز عبور را بررسی کن.');
        },
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((isVisible) => !isVisible);
  }

  private restoreRememberedLogin(): void {
    const shouldRemember = localStorage.getItem(this.rememberMeStorageKey) === 'true';
    const rememberedUsername = localStorage.getItem(this.rememberedUsernameStorageKey);

    this.loginForm.patchValue({
      username: shouldRemember ? (rememberedUsername ?? '') : '',
      rememberMe: shouldRemember,
    });
  }
}
