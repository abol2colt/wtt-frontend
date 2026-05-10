import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  isAdmin: boolean;
  isStaff: boolean;
  user_id: number;
  user_status: string;
  user_role: string;
  isSupervisor: boolean;
}

export interface UserProfile {
  id: number;
  username?: string;
  role: string;
  first_name?: string;
  last_name?: string;
  user_status?: string;
  isAdmin?: boolean;
  isStaff?: boolean;
  isSupervisor?: boolean;
  workflow?: {
    manager?: {
      id: number;
      first_name: string;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  private readonly tokenStorageKey = 'wtt_auth_token';
  private readonly userIdStorageKey = 'wtt_user_id';

  // Keep auth state in signals so components can react to login/logout changes.
  readonly token = signal<string | null>(sessionStorage.getItem(this.tokenStorageKey));
  readonly currentUser = signal<UserProfile | null>(null);

  // Authenticated state should depend on token existence, not on route or UI state.
  readonly isAuthenticated = computed(() => Boolean(this.token()));

  login(credentials: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.apiBaseUrl}/login/`, credentials).pipe(
      tap((response) => {
        this.setSession(response);
      }),
    );
  }

  logout(): void {
    // Clear all auth-related runtime and session state.
    sessionStorage.removeItem(this.tokenStorageKey);
    sessionStorage.removeItem(this.userIdStorageKey);

    this.token.set(null);
    this.currentUser.set(null);
  }

  fetchProfile() {
    // Real WTT frontend calls the current-user endpoint after login.
    // This endpoint should return the authenticated user's profile based on the token.
    return this.http.get<UserProfile>(`${this.apiBaseUrl}/user/`).pipe(
      tap((profile) => {
        this.currentUser.set(profile);
      }),
    );
  }

  getCurrentUserId(): number | null {
    const storedUserId = sessionStorage.getItem(this.userIdStorageKey);

    if (!storedUserId) {
      return null;
    }

    const parsedUserId = Number(storedUserId);

    return Number.isFinite(parsedUserId) ? parsedUserId : null;
  }

  getAuthHeaderValue(): string | null {
    const currentToken = this.token();

    if (!currentToken) {
      return null;
    }

    // Current WTT v1 backend uses token authentication.
    return `Token ${currentToken}`;
  }

  private setSession(response: LoginResponse): void {
    // Never hardcode real tokens in source code. Store them only at runtime.
    sessionStorage.setItem(this.tokenStorageKey, response.token);
    sessionStorage.setItem(this.userIdStorageKey, String(response.user_id));

    this.token.set(response.token);

    // Build a lightweight user state immediately from login response.
    // The full profile can be fetched from /user/ after login.
    this.currentUser.set({
      id: response.user_id,
      role: response.user_role,
      user_status: response.user_status,
      isAdmin: response.isAdmin,
      isStaff: response.isStaff,
      isSupervisor: response.isSupervisor,
    });
  }
}
