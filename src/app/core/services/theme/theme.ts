import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

const THEME_STORAGE_KEY = 'theme';
type ThemeMode = 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  readonly isDarkMode = signal<boolean>(this.getStoredTheme() !== 'light');

  constructor() {
    effect(() => {
      const mode: ThemeMode = this.isDarkMode() ? 'dark' : 'light';

      this.document.documentElement.classList.toggle('dark', mode === 'dark');
      this.setStoredTheme(mode);
    });
  }

  toggleTheme(): void {
    this.isDarkMode.update((current) => !current);
  }

  private getStoredTheme(): ThemeMode | null {
    try {
      const value = localStorage.getItem(THEME_STORAGE_KEY);
      return value === 'dark' || value === 'light' ? value : null;
    } catch {
      return null;
    }
  }

  private setStoredTheme(mode: ThemeMode): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // Storage access can fail in restricted browser modes.
    }
  }
}
