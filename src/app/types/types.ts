export interface Project {
  id: string;
  name?: string;
  description?: string;
  employees?: Employee[];
};

export interface Employee {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  projects?: Project[];
};

export interface UserInfo {
  userName: string;
  role: string;
}
