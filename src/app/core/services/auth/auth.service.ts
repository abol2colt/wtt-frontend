import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { LayoutService } from '../layout/layout.service';

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
  email?: string;
  avatar?: string | null;
  isAdmin?: boolean;
  isStaff?: boolean;
  isSupervisor?: boolean;
  workflow?: {
    brand?: string;
    manager?: {
      id: number;
      first_name?: string;
      last_name?: string;
      avatar?: string | null;
    };
  };
}

interface WttUserListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: WttUserApiUser[];
}

interface WttUserApiUser {
  id: number;
  username?: string;
  is_active?: boolean;
  user_detailed_info?: {
    base_information?: {
      role?: string;
      email?: string;
      avatar?: string;
      status?: string;
      first_name?: string;
      last_name?: string;
      mobile_number?: string;
    };
    workflow?: {
      brand?: string;
      manager?: {
        id: number;
        first_name?: string;
        last_name?: string;
        avatar?: string;
      };
    };
  };
  created_date?: string;
  created_by?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly layout = inject(LayoutService);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  private readonly tokenStorageKey = 'wtt_auth_token';
  private readonly userIdStorageKey = 'wtt_user_id';

  // Keep auth state in signals so components can react to login/logout changes.
  readonly token = signal<string | null>(
    sessionStorage.getItem(this.tokenStorageKey) ?? localStorage.getItem(this.tokenStorageKey),
  );
  readonly currentUser = signal<UserProfile | null>(null);

  // Authenticated state should depend on token existence, not on route or UI state.
  readonly isAuthenticated = computed(() => Boolean(this.token()));

  constructor() {
    const storedToken =
      sessionStorage.getItem(this.tokenStorageKey) ?? localStorage.getItem(this.tokenStorageKey);

    if (storedToken) {
      document.cookie = `auth_token=${storedToken}; path=/; SameSite=Lax`;
    }
  }

  login(credentials: LoginRequest, rememberMe = false) {
    return this.http.post<LoginResponse>(`${this.apiBaseUrl}/login/`, credentials).pipe(
      tap((response) => {
        this.setSession(response, rememberMe);
      }),
    );
  }

  logout(): void {
    // Clear all auth-related runtime and session state.
    sessionStorage.removeItem(this.tokenStorageKey);
    sessionStorage.removeItem(this.userIdStorageKey);
    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem(this.userIdStorageKey);

    document.cookie = 'auth_token=; path=/; max-age=0';

    this.token.set(null);
    this.currentUser.set(null);
    this.layout.resetWelcomeSplash();
  }

  fetchProfile() {
    return this.http.get<WttUserListResponse | UserProfile>(`${this.apiBaseUrl}/user/`).pipe(
      map((response) => this.normalizeUserProfile(response)),
      tap((profile) => {
        this.currentUser.set(profile);
      }),
    );
  }

  getCurrentUserId(): number | null {
    const storedUserId =
      sessionStorage.getItem(this.userIdStorageKey) ?? localStorage.getItem(this.userIdStorageKey);

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
  private normalizeUserProfile(response: WttUserListResponse | UserProfile): UserProfile {
    if ('results' in response) {
      const user = response.results[0];

      if (!user) {
        return {
          id: this.getCurrentUserId() ?? 0,
          role: 'developer',
        };
      }

      const baseInfo = user.user_detailed_info?.base_information;
      const workflow = user.user_detailed_info?.workflow;

      return {
        id: user.id,
        username: user.username,
        role: baseInfo?.role ?? workflow?.brand ?? 'developer',
        first_name: baseInfo?.first_name,
        last_name: baseInfo?.last_name,
        user_status: baseInfo?.status,
        email: baseInfo?.email,
        avatar: baseInfo?.avatar ?? null,
        workflow: {
          brand: workflow?.brand,
          manager: workflow?.manager
            ? {
                id: workflow.manager.id,
                first_name: workflow.manager.first_name,
                last_name: workflow.manager.last_name,
                avatar: workflow.manager.avatar ?? null,
              }
            : undefined,
        },
      };
    }

    return response;
  }
  private setSession(response: LoginResponse, rememberMe: boolean): void {
    // Never hardcode real tokens in source code. Store them only at runtime.
    const persistentStorage = rememberMe ? localStorage : sessionStorage;
    const volatileStorage = rememberMe ? sessionStorage : localStorage;

    volatileStorage.removeItem(this.tokenStorageKey);
    volatileStorage.removeItem(this.userIdStorageKey);

    persistentStorage.setItem(this.tokenStorageKey, response.token);
    persistentStorage.setItem(this.userIdStorageKey, String(response.user_id));

    document.cookie = `auth_token=${response.token}; path=/; SameSite=Lax`;

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
