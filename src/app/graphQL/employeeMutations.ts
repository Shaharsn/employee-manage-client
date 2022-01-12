// GraphQL Mutations

import { gql, useMutation } from "@apollo/client";
import { Employee } from "../types/types";

export const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $addEmployeeId: String!
    $name: String!
    $email: String!
    $role: String!
  ) {
    addEmployee(id: $addEmployeeId, name: $name, email: $email, role: $role) {
      id
      name
      email
      role
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $updateEmployeeId: String!
    $name: String
    $email: String
    $role: String
  ) {
    updateEmployee(
      id: $updateEmployeeId
      name: $name
      email: $email
      role: $role
    )
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($deleteEmployeeId: String!) {
    deleteEmployee(id: $deleteEmployeeId)
  }
`;

export interface NewUpdateEmployee {
  addEmployeeId: String;
  name: String;
  email: String;
  role: String;
}

export interface DeleteEmployee {
  deleteEmployeeId: String;
}

export const useAddEmployee = () => {
  const [addEmployee, { data, loading, error }] = useMutation(ADD_EMPLOYEE);

  const runAddEmployee = (newEmployee: Employee) => {
    return addEmployee({
      variables: {
        addEmployeeId: String(newEmployee.id),
        name: newEmployee.name,
        email: newEmployee.email,
        role: newEmployee.role,
      },
    });
  };

  return {
    addEmployee: runAddEmployee,
    data: data,
    loading: loading,
    error: error,
  };
};
/*
export const useAddEmployee = (newEmployee: Employee, onComplete: (employee: Employee) => {}) => {
  return useMutation<EmployeeResponse, NewUpdateEmployee>(ADD_EMPLOYEE, {
    variables: {
      addEmployeeId: String(newEmployee.id),
      name: newEmployee.name,
      email: newEmployee.email,
      role: newEmployee.role,
    },
    onCompleted(data) {
        onComplete(data.employee);
    }
  });
};
*/

export const useUpdateEmployee = () => {
  const [updateEmployee, { data, loading, error }] =
    useMutation(UPDATE_EMPLOYEE);

  const runUpdateEmployee = (newEmployee: Employee) => {
    return updateEmployee({
      variables: {
        updateEmployeeId: String(newEmployee.id),
        name: newEmployee.name,
        email: newEmployee.email,
        role: newEmployee.role,
      },
    });
  };

  return {
    updateEmployee: runUpdateEmployee,
    data: data,
    loading: loading,
    error: error,
  };
};

export const useDeleteEmployee = () => {
  const [deleteEmployee, { data, loading, error }] =
    useMutation(DELETE_EMPLOYEE);

  const runDeleteEmployee = (employeeId: number) => {
    return deleteEmployee({
      variables: {
        deleteEmployeeId: String(employeeId),
      },
    });
  };

  return {
    deleteEmployee: runDeleteEmployee,
    data: data,
    loading: loading,
    error: error,
  };
};
