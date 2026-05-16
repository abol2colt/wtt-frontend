export type UserRole = 'developer' | string;

export interface UserProfile {
  id: number;
  username: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  workflow?: UserWorkflow;
}

export interface UserWorkflow {
  manager: UserManager;
}

export interface UserManager {
  id: number;
  first_name: string;
}
