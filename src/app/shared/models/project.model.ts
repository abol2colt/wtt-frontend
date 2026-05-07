export interface Project {
  id: number;
  title: string;
  description?: string;
}

export interface ProjectService {
  id: number;
  service: string;
}

export interface ProjectContract {
  id: number;
  contract: string;
}

export interface ProjectDetailsResponse {
  services: ProjectService[];
  contracts: ProjectContract[];
}
