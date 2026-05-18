import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="mx-auto flex max-w-3xl flex-col gap-4 p-6" dir="rtl">
      <a
        routerLink="/tasks"
        class="w-fit rounded-full border border-[var(--card-border)] px-4 py-2 text-xs font-black text-[var(--text-soft)] hover:text-[var(--text-main)]"
      >
        بازگشت به وظایف
      </a>

      <div class="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-sm">
        <p class="text-[11px] font-black text-cyan-500">جزئیات وظیفه</p>
        <h1 class="mt-2 text-xl font-black text-[var(--text-main)]">
          وظیفه #{{ taskId }}
        </h1>
        <p class="mt-3 text-sm font-bold leading-7 text-[var(--text-soft)]">
          صفحه جزئیات کامل بعد از پایدار شدن جریان دمو تکمیل می‌شود. فعلاً این مسیر برای
          ناوبری امن و lowercase نگه داشته شده است.
        </p>
      </div>
    </section>
  `,
})
export class TaskDetailComponent {
  private readonly route = inject(ActivatedRoute);
  readonly taskId = this.route.snapshot.paramMap.get('id') ?? '';
}
