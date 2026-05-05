export interface User {
  id: number;
  username: string;
  role: 'developer' | string;
  first_name: string;
  last_name: string;
  workflow?: {
    manager: {
      id: number;
      first_name: string;
    };
  };
  stats?: {
    expected_time: number;
    total_work: number;
    overtime_working: number;
    this_year_vacations: number;
  };
}
