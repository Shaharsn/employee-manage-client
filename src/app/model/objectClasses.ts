import { Employee as IEmployee, Project as IProject } from "../types/types";

export class Employee implements IEmployee {
  id: number;
  name: string;
  email: string;
  role: string;
  projects: IProject[];

  constructor(id?: number, name?: string, email?: string, role?: string) {
    this.id = id ? id : -1;
    this.name = name ? name : "";
    this.email = email ? email : "";
    this.role = role ? role : "";
    this.projects = [];
  }

  addProjects = (projects: IProject[]) => {
    this.projects = [...projects];
  };
}

export class Project implements IProject {
  id: number;
  name: string;
  description: string;
  employees: IEmployee[];

  constructor(name?: string, description?: string) {
    this.id = -1;
    this.name = name ? name : "";
    this.description = description ? description : "";
    this.employees = [];
  }

  addEmployees(employees: IEmployee[]) {
    this.employees = [...employees];
  }
}
