// GraphQL Mutations

import { gql, useMutation } from "@apollo/client";
import { EmployeesResponse, GET_ALL_EMPLOYEES } from "./employeeQueries";

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

// GraphQL Mutations Custom HooK

export const useAddEmployee = (onComplete: () => void) => {
  return useMutation(ADD_EMPLOYEE, {
    // Update the Cache
    update: (cache, data) => {
      const cachedData = cache.readQuery<EmployeesResponse>({
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
      const cachedData = cache.readQuery<EmployeesResponse>({
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
      const cachedData = cache.readQuery<EmployeesResponse>({
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
