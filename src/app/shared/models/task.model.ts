export type TaskStatus = 'pending' | 'approved' | 'rejected' | 'draft' | 'edited';

export type WorkLocation = 'teleworking' | 'incompany_working';

export interface TaskItem {
  id: number;
  status: TaskStatus | string;
  title: string;
  project_id: number;
  date: string;
  duration: number;
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
