import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ApiState } from '../../../shared/models/api-state.model';
import { TaskItem } from '../../../shared/models/task.model';
import { TasksService } from '../services/tasks.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="mx-auto flex max-w-5xl flex-col gap-4 p-6" dir="rtl">
      <a
        routerLink="/tasks"
        class="w-fit rounded-full border border-[var(--card-border)] px-4 py-2 text-xs font-black text-[var(--text-soft)] hover:text-[var(--text-main)]"
      >
        بازگشت به وظایف
      </a>

      @if (taskState().loading) {
        <div class="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <div class="animate-pulse space-y-4">
            <div class="h-5 w-1/3 rounded bg-slate-200 dark:bg-white/10"></div>
            <div class="h-4 w-2/3 rounded bg-slate-200 dark:bg-white/10"></div>
            <div class="h-32 rounded-2xl bg-slate-200 dark:bg-white/10"></div>
          </div>
        </div>
      } @else if (taskState().error) {
        <div class="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-center">
          <p class="text-sm font-black text-red-500">{{ taskState().error }}</p>
          <button type="button" class="filter-chip mt-4" (click)="loadTask()">تلاش مجدد</button>
        </div>
      } @else if (taskState().data; as task) {
        <div
          class="rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-sm"
        >
          <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div class="min-w-0">
              <p class="text-[11px] font-black text-cyan-500">جزئیات وظیفه</p>
              <h1 class="mt-2 text-2xl font-black leading-9 text-[var(--text-main)]">
                {{ task.title }}
              </h1>
              <p class="mt-2 text-xs font-bold text-[var(--text-soft)]">
                #{{ task.id }} · {{ task.project_title ?? 'بدون پروژه' }}
              </p>
            </div>

            <span
              class="w-fit rounded-full px-4 py-2 text-xs font-black"
              [class.bg-emerald-500]="task.status === 'approved'"
              [class.text-white]="task.status === 'approved'"
              [class.bg-red-500]="task.status === 'rejected'"
              [class.text-orange-500]="task.status !== 'approved' && task.status !== 'rejected'"
              [class.bg-orange-500/10]="task.status !== 'approved' && task.status !== 'rejected'"
            >
              {{ getStatusLabel(task.status) }}
            </span>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
            <div class="rounded-2xl bg-slate-500/10 p-4">
              <p class="text-[10px] font-black text-[var(--text-soft)]">تاریخ</p>
              <p class="mt-2 text-sm font-black text-[var(--text-main)]">{{ task.date }}</p>
            </div>

            <div class="rounded-2xl bg-slate-500/10 p-4">
              <p class="text-[10px] font-black text-[var(--text-soft)]">مدت</p>
              <p class="mt-2 text-sm font-black text-[var(--text-main)]">
                {{ formatMinutes(task.duration) }}
              </p>
            </div>

            <div class="rounded-2xl bg-slate-500/10 p-4">
              <p class="text-[10px] font-black text-[var(--text-soft)]">شروع</p>
              <p class="mt-2 text-sm font-black text-[var(--text-main)]">
                {{ task.start_time ?? '-' }}
              </p>
            </div>

            <div class="rounded-2xl bg-slate-500/10 p-4">
              <p class="text-[10px] font-black text-[var(--text-soft)]">پایان</p>
              <p class="mt-2 text-sm font-black text-[var(--text-main)]">
                {{ task.end_time ?? '-' }}
              </p>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div class="rounded-2xl border border-[var(--card-border)] p-4">
              <p class="text-[10px] font-black text-[var(--text-soft)]">سرویس</p>
              <p class="mt-2 text-sm font-black text-[var(--text-main)]">
                {{ task.project_service?.service ?? '-' }}
              </p>
            </div>

            <div class="rounded-2xl border border-[var(--card-border)] p-4">
              <p class="text-[10px] font-black text-[var(--text-soft)]">قرارداد</p>
              <p class="mt-2 text-sm font-black text-[var(--text-main)]">
                {{ task.project_contract?.contract ?? '-' }}
              </p>
            </div>

            <div class="rounded-2xl border border-[var(--card-border)] p-4">
              <p class="text-[10px] font-black text-[var(--text-soft)]">محل انجام</p>
              <p class="mt-2 text-sm font-black text-[var(--text-main)]">
                {{ getLocationLabel(task.location) }}
              </p>
            </div>
          </div>

          <div class="mt-4 rounded-2xl border border-[var(--card-border)] p-5">
            <p class="text-[10px] font-black text-[var(--text-soft)]">توضیحات</p>
            <p class="mt-3 whitespace-pre-line text-sm font-bold leading-8 text-[var(--text-main)]">
              {{ task.description || 'توضیحی ثبت نشده است.' }}
            </p>
          </div>
        </div>
      }
    </section>
  `,
})
export class TaskDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tasksService = inject(TasksService);

  readonly taskState = signal<ApiState<TaskItem>>({
    data: null,
    loading: false,
    error: null,
  });

  ngOnInit(): void {
    this.loadTask();
  }

  loadTask(): void {
    const taskId = Number(this.route.snapshot.paramMap.get('id'));

    if (!taskId) {
      this.taskState.set({
        data: null,
        loading: false,
        error: 'شناسه وظیفه معتبر نیست.',
      });
      return;
    }

    this.taskState.set({
      data: null,
      loading: true,
      error: null,
    });

    this.tasksService.getTaskById(taskId).subscribe({
      next: (task) => {
        this.taskState.set({
          data: task,
          loading: false,
          error: null,
        });
      },
      error: (err) => {
        this.taskState.set({
          data: null,
          loading: false,
          error: err?.message || 'خطا در دریافت جزئیات وظیفه.',
        });
      },
    });
  }

  formatMinutes(minutes: number): string {
    if (!minutes || minutes <= 0) return '۰ دقیقه';

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours && remainingMinutes) return `${hours} ساعت و ${remainingMinutes} دقیقه`;
    if (hours) return `${hours} ساعت`;

    return `${remainingMinutes} دقیقه`;
  }

  getStatusLabel(status: TaskItem['status']): string {
    switch (status) {
      case 'approved':
        return 'تایید شده';
      case 'rejected':
        return 'رد شده';
      case 'pending':
        return 'در انتظار بررسی';
      default:
        return status || 'نامشخص';
    }
  }

  getLocationLabel(location?: string): string {
    switch (location) {
      case 'teleworking':
        return 'دورکاری';
      case 'incompany_working':
        return 'حضوری';
      default:
        return '-';
    }
  }
}
