export interface TaskStatusMeta {
  label: string;
  railClass: string;
  textClass: string;
  badgeClass: string;
}

const DEFAULT_STATUS_META: TaskStatusMeta = {
  label: '',
  railClass: 'progress',
  textClass: 'text-[var(--text-soft)]',
  badgeClass: 'border-slate-500/20 bg-slate-500/10 text-[var(--text-soft)]',
};

export const TASK_STATUS_META: Record<string, TaskStatusMeta> = {
  approved: {
    label: 'تایید شده',
    railClass: 'done',
    textClass: 'text-emerald-500',
    badgeClass: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
  },
  pending: {
    label: 'در انتظار تایید',
    railClass: 'review',
    textClass: 'text-orange-500',
    badgeClass: 'border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-300',
  },
  rejected: {
    label: 'نیازمند اصلاح',
    railClass: 'rejected',
    textClass: 'text-red-500',
    badgeClass: 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-300',
  },
  edited: {
    label: 'ویرایش شده',
    railClass: 'progress',
    textClass: 'text-blue-500',
    badgeClass: 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-300',
  },
  draft: {
    label: 'پیش‌نویس',
    railClass: 'draft',
    textClass: 'text-slate-500',
    badgeClass: 'border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-300',
  },
};

export function getTaskStatusMeta(status: string): TaskStatusMeta {
  const meta = TASK_STATUS_META[status];

  return meta
    ? meta
    : {
        ...DEFAULT_STATUS_META,
        label: status,
      };
}
