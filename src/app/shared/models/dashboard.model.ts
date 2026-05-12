export interface DashboardStatsResponse {
  data: DashboardStats;
}

export interface DashboardStats {
  first_name: string;
  last_name: string;
  expected_time: number;
  total_work: number;
  overtime_working: number;
  this_year_vacations: number;
}

export interface DashboardPieItem {
  project: string;
  value: number;
}

export interface DashboardLinePoint {
  date: string;
  presence: number;
  rejected: number;
  pending: number;
  teleworking: number;
  incompany_working: number;
}

export interface MessageCountResponse {
  private: number;
  public: number;
  regulations: number;
}

export interface DashboardStats {
  first_name: string;
  last_name: string;
  expected_time: number;
  total_work: number;
  overtime_working: number;
  this_year_vacations: number;
}

export interface DashboardStatsResponse {
  data: DashboardStats;
}
export interface NewsMessage {
  id: number;
  text: string;
  published_time: string;
  attachments: unknown[];
  username: string;
  fullname: string;
  title: string;
  type: 'public' | 'private' | string;
  profile_image: string;
  seen: boolean;
  favorite: boolean;
}

export interface NewsMessagesResponse {
  count: number;
  results: NewsMessage[];
  next: string | null;
  previous: string | null;
}

export interface NewsMessagesCountResponse {
  all_news_count: number;
  read_news_count: number;
  favorite_count: number;
}
export interface DashboardProfileSummaryResponse {
  data: DashboardProfileSummary;
}

export interface DashboardProfileSummary {
  profile: DashboardProfileUser;
  projects: unknown[];
  overtime_working: number;
  presences_time: number;
  total_randeman: number;
  total_incompany_randeman: number;
  holidays: string[];
  fridays: string[];
  thursdays: string[];
}

export interface DashboardProfileUser {
  first_name: string;
  last_name: string;
  status: string;
  role: string;
  soldier: boolean;
  avatar: string;
}
