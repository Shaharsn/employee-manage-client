export type Project = {
  id: number;
  name: string;
  description: string;
  employees: [Employee];
};

export type Employee = {
  id: number;
  name: string;
  email: string;
  role: string;
  projects: [Project];
};
