export type TaskStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'draft'
  | 'edited'
  | 'accept'
  | 'reject'
  | string;

export type WorkLocation = 'teleworking' | 'incompany_working';

export interface TaskItem {
  id: number;
  status: TaskStatus | string;
  title: string;
  project_id: number;
  project_title?: string;
  date: string;
  duration: number;
  location?: WorkLocation | string;
  start_time?: string;
  end_time?: string;
  description?: string;
  editable?: boolean;
  project_contract?: {
    id: number;
    contract: string;
  };
  project_service?: {
    id: number;
    service: string;
  };
}

export interface TaskListMeta {
  page: number;
  page_size: number;
  total: number;
}

export interface TaskListResponse {
  data: TaskItem[];
  meta: TaskListMeta;
}

export interface TaskMutationPayload {
  title: string;
  project: number;
  project_service: number;
  project_contract: number;
  location: WorkLocation | string;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  description?: string;
}
export interface TasksCountResponse {
  accept: number;
  reject: number;
  pending: number;
  all: number;
}
export type TaskRange =
  | 'today'
  | 'yesterday'
  | 'week'
  | 'last_week'
  | 'month'
  | 'last_month'
  | 'month_till_today'
  | 'this_year';

export interface TaskListQuery {
  page?: number;
  range?: TaskRange;
  start_date?: string;
  end_date?: string;
  project?: number;
  project_contract?: number;
  project_service?: number;
  teleworking?: boolean;
  favorite?: boolean;
}
export type ExternalTaskSource = 'jira' | 'mock-jira';

export interface ExternalTaskSourceItem {
  id: string;
  key?: string;
  title: string;

  project_id: number;
  project_title?: string;

  service_id: number;
  service_title?: string;

  contract_id: number;
  contract_title?: string;

  branch_name?: string;
  status?: string;
  estimated_minutes?: number;

  source?: ExternalTaskSource;
  raw?: unknown;
}

export interface GitEvidenceSummary {
  taskKey?: string;
  branch?: string;
  commitCount?: number;
  firstCommitAt?: string;
  lastCommitAt?: string;
  excludedGapMinutes?: number;
  reasoning?: string;
}

export interface GitEvidenceSyncResponse {
  success: boolean;
  description?: string;

  durationMinutes?: number;
  suggestedStartTime?: string;
  suggestedEndTime?: string;
  suggestedDurationMinutes?: number;
  excludedGapMinutes?: number;

  confidenceScore?: number;
  confidenceLabel?: 'high' | 'medium' | 'needs-review' | 'manual-review' | string;

  evidence?: GitEvidenceSummary;
  error?: string;
}
