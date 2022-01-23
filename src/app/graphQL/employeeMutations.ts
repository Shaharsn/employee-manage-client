// GraphQL Mutations

import { gql, useMutation } from "@apollo/client";
import { Employee, Project } from "../types/types";
import {
  IEmployeesResponse,
  GET_ALL_EMPLOYEES,
  useGetAllEmployees,
} from "./employeeQueries";

export const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $id: String!
    $name: String!
    $email: String!
    $role: String!
  ) {
    addEmployee(id: $id, name: $name, email: $email, role: $role) {
      id
      name
      email
      role
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $id: String!
    $name: String
    $email: String
    $role: String
  ) {
    updateEmployee(id: $id, name: $name, email: $email, role: $role) {
      id
      name
      email
      role
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: String!) {
    deleteEmployee(id: $id) {
      id
    }
  }
`;

export const UPDATE_EMPLOYEE_PROJECTS = gql`
  mutation UpdateEmployeeProjects(
    $employeesWithProjects: [EmployeesWithProjects!]
  ) {
    updateEmployeeProjects(employeesWithProjects: $employeesWithProjects) {
      id
      projects {
        id
        name
        description
      }
    }
  }
`;

// GraphQL Mutations Custom HooK

export const useAddEmployee = (onComplete: () => void) => {
  return useMutation(ADD_EMPLOYEE, {
    // Update the Cache
    update: (cache, data) => {
      const cachedData = cache.readQuery<IEmployeesResponse>({
        query: GET_ALL_EMPLOYEES,
      });
      const employees = cachedData?.employees || [];
      const newEmployee = data.data.addEmployee;
      const updatedEmployees = [...employees, newEmployee];

      cache.writeQuery({
        query: GET_ALL_EMPLOYEES,
        data: { employees: updatedEmployees },
      });
    },
    // Run a given method on complete
    onCompleted: onComplete,
  });
};

export const useUpdateEmployee = (onComplete: () => void) => {
  return useMutation(UPDATE_EMPLOYEE, {
    // Update the Cache
    update: (cache, data) => {
      const cachedData = cache.readQuery<IEmployeesResponse>({
        query: GET_ALL_EMPLOYEES,
      });
      const employees = cachedData?.employees || [];
      const updatedEmployee = data.data.updateEmployee;
      const updatedEmployees = [...employees];

      const existEmpIdx = employees.findIndex(
        (emp) => emp.id === updatedEmployee.id
      );
      const existEmp = employees[existEmpIdx];

      updatedEmployees[existEmpIdx] = {
        ...existEmp,
        name: updatedEmployee.name,
        email: updatedEmployee.email,
        role: updatedEmployee.role,
      };

      cache.writeQuery({
        query: GET_ALL_EMPLOYEES,
        data: { employees: updatedEmployees },
      });
    },
    // Run a given method on complete
    onCompleted: onComplete,
  });
};

export const useDeleteEmployee = () => {
  return useMutation(DELETE_EMPLOYEE, {
    // Update the Cache
    update: (cache, data) => {
      const cachedData = cache.readQuery<IEmployeesResponse>({
        query: GET_ALL_EMPLOYEES,
      });
      const employees = cachedData?.employees || [];
      console.log(data);
      const removedEmployeeId = data.data.deleteEmployee.id;
      const updatedEmployees = [
        ...employees.filter((emp) => emp.id !== removedEmployeeId),
      ];

      cache.writeQuery({
        query: GET_ALL_EMPLOYEES,
        data: { employees: updatedEmployees },
      });
    },
  });
};

export const useUpdateEmployeesProjects = (onComplete?: () => void) => {
  return useMutation(UPDATE_EMPLOYEE_PROJECTS, {
    // Update the Cache
    update: (cache, data) => {
      const cachedData = cache.readQuery<IEmployeesResponse>({
        query: GET_ALL_EMPLOYEES,
      });
      const employees = cachedData?.employees || [];
      const updatedEmployeeId = data.data.updateEmployeeProjects.id;
      const updatedProjects = data.data.updateEmployeeProjects.projects;
      const updatedEmployees = [...employees];

      let existEmpIdx = employees.findIndex(
        (emp) => emp.id === updatedEmployeeId
      );

      if (existEmpIdx !== -1) {
        updatedEmployees[existEmpIdx] = {
          ...employees[existEmpIdx],
          projects: updatedProjects,
        };

        cache.writeQuery({
          query: GET_ALL_EMPLOYEES,
          data: { employees: updatedEmployees },
        });
      }
    },
    // Run a given method on complete
    onCompleted: onComplete,
  });
};

export const useAddProjectToEmployees = () => {
  const [updateEmployeeProjects] = useUpdateEmployeesProjects();
  const { data } = useGetAllEmployees();

  const runAddProjectToEmployees = (
    project: Project,
    employees: Employee[]
  ) => {
    if (data) {
      let variablesArr: {}[] = [];

      // Get all the employees that includes the project inside their project list
      let employeesIncludesTheProject = data.employees.filter((emp) =>
        emp.projects?.some((emp) => emp.id === project.id)
      );

      // Remove the Project from Employee hold him and now they not need too
      employeesIncludesTheProject.forEach((emp) => {
        if (!employees.find((e) => e.id === emp.id)) {
          let empProjects =
            emp.projects
              ?.filter((proj) => proj.id !== project.id)
              .map((proj) => {
                return {
                  id: proj.id,
                  name: proj.name,
                  description: proj.description,
                };
              }) || [];

          variablesArr.push({ id: emp.id, projects: empProjects });
        }
      });

      employees.forEach((emp) => {
        if (!employeesIncludesTheProject.find((e) => e.id === emp.id)) {
          // Get the employee from the data's employees
          let existEmp = data.employees?.find((e) => e.id === emp.id);

          if (existEmp) {
            // Add all the other employees to the project's employee list
            let empProjects =
              existEmp.projects
                ?.filter((proj) => proj.id !== project.id)
                .map((proj) => {
                  return {
                    id: proj.id,
                    name: proj.name,
                    description: proj.description,
                  };
                }) || [];

            // Adding the new employee to the project's employee list
            empProjects?.push({
              id: project.id,
              name: project.name,
              description: project.description,
            });

            variablesArr.push({ id: existEmp.id, projects: empProjects });
          }
        }
      });

      updateEmployeeProjects({
        variables: { employeesWithProjects: variablesArr },
      });
    }
  };

  return { runAddProjectToEmployees: runAddProjectToEmployees };
};
