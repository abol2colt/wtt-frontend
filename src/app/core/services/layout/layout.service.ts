import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  // این متغیر در کل اپلیکیشن مشترک و زنده است
  public isTasksPage = signal<boolean>(false);
}
