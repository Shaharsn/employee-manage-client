import { ReactNode, useReducer } from "react";
import { Employee as IEmployee, Project } from "../../types/types";
import DBContext, { dbContextInterface } from "./DBContext";
import { EmployeeReducer } from "./dbEmployeeReducer";
import { ProjectReducer } from "./dbProjectReducer";

// CONTEXT PROVIDER
interface DBContextProviderInterface {
  children: ReactNode;
}

const defaultEmployeesState = {
  employees: [],
};

const defaultProjectsState = {
  projects: [],
};

export const DBContextProvider = (props: DBContextProviderInterface) => {
  const [employeesState, dispatchEmployeesAction] = useReducer(
    EmployeeReducer,
    defaultEmployeesState
  );

  const [projectsState, dispatchProjectsAction] = useReducer(
    ProjectReducer,
    defaultProjectsState
  );

  const storeEmployeeListHandler = (employees: IEmployee[]) => {
    dispatchEmployeesAction({
      type: "STORE",
      item: employees,
    });
  };

  const storeProjectListHandler = (projects: Project[]) => {
    dispatchProjectsAction({
      type: "STORE",
      item: projects,
    });
  };

  const addEmployeeHandler = async (employee: IEmployee) => {
    dispatchEmployeesAction({
      type: "ADD",
      item: employee,
    });
  };

  const addProjectHandler = (project: Project) => {
    dispatchProjectsAction({
      type: "ADD",
      item: project,
    });
  };

  const updateEmployeeHandler = (employee: IEmployee) => {
    dispatchEmployeesAction({
      type: "UPDATE",
      item: employee,
    });
  };

  const updateProjectHandler = (project: Project) => {
    dispatchProjectsAction({
      type: "UPDATE",
      item: project,
    });
  };

  const deleteEmployeeHandler = (employeeId: number) => {
    dispatchEmployeesAction({
      type: "DELETE",
      item: employeeId,
    });
  };
  const deleteProjectHandler = (projectId: number) => {
    dispatchProjectsAction({
      type: "DELETE",
      item: projectId,
    });
  };

  const contextValue: dbContextInterface = {
    employees: employeesState.employees,
    projects: projectsState.projects,
    storeEmployeeList: storeEmployeeListHandler,
    storeProjectList: storeProjectListHandler,
    addEmployee: addEmployeeHandler,
    addProject: addProjectHandler,
    updateEmployee: updateEmployeeHandler,
    updateProject: updateProjectHandler,
    deleteEmployee: deleteEmployeeHandler,
    deleteProject: deleteProjectHandler,
  };

  return (
    <DBContext.Provider value={contextValue}>
      {props.children}
    </DBContext.Provider>
  );
};
