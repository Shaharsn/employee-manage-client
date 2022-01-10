export interface Project {
  id: number;
  name: string;
  description: string;
  employees: Employee[];
};

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  projects: Project[];
};
