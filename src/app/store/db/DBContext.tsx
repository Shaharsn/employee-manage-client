import React from "react";
import { Employee, Project } from "../../types/types";

// CONTEXT
export interface dbContextInterface {
    employees: Employee[];
    projects: Project[];
    storeEmployeeList: (employees: Employee[]) => void;
    storeProjectList: (projects: Project[]) => void;
    addEmployee: (employee: Employee) => void;
    addProject: (project: Project) => void;
    updateEmployee: (employee: Employee) => void;
    updateProject: (project: Project) => void;
    deleteEmployee: (employee: number) => void;
    deleteProject: (projectId: number) => void;
}

const DBContext = React.createContext<dbContextInterface>({
    employees: [],
    projects: [],
    storeEmployeeList: () => {},
    storeProjectList: () => {},
    addEmployee: () => {},
    addProject: () => {},
    updateEmployee: () => {},
    updateProject: () => {},
    deleteEmployee: () => {},
    deleteProject: () => {},
});
export default DBContext;
