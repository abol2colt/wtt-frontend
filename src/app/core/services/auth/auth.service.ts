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
  // بعداً می‌بریم تو فایل environment
  private apiUrl = 'http://api.your-backend.com/api/v1';

  // سیگنال سراسری: در ابتدا null است چون کاربر هنوز لود نشده
  currentUser = signal<UserProfile | null>(null);

  constructor() {}

  // متد دریافت اطلاعات پروفایل
  fetchProfile(userId: number) {
    // طبق داکیومنت، آیدی کاربر به عنوان query param ارسال می‌شه
    return this.http.get<UserProfile>(`${this.apiUrl}/profile/?user=${userId}`).pipe(
      tap((profile) => {
        // وقتی دیتا از سرور اومد، اون رو تو سیگنال ذخیره می‌کنیم
        this.currentUser.set(profile);
        console.log('✅ اطلاعات پروفایل دریافت و در State ذخیره شد:', profile);
      }),
    );
  }
}
