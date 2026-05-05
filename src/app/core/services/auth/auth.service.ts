import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

// user data as > document
export interface UserProfile {
  id: number;
  username: string;
  role: string;
  first_name: string;
  last_name: string;
  workflow: { manager: { id: number; first_name: string } };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  //TODO: بعداً می‌بریم تو فایل environment
  private apiUrl = 'http://api.your-backend.com/api/v1';

  currentUser = signal<UserProfile | null>(null);

  constructor() {}

  fetchProfile(userId: number) {
    // example doc query param
    return this.http.get<UserProfile>(`${this.apiUrl}/profile/?user=${userId}`).pipe(
      tap((profile) => {
        this.currentUser.set(profile);
        console.log('✅ اطلاعات پروفایل دریافت و در State ذخیره شد:', profile);
      }),
    );
  }
}
