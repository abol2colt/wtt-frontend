export interface Project {
  id: number;
  title: string;
  description?: string;
  services?: ProjectService[];
  contracts?: ProjectContract[];
}

export interface ProjectService {
  id: number;
  service: string;
}

export interface ProjectContract {
  id: number;
  contract: string;
}
