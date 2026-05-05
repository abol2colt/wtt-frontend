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
