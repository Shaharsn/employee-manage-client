import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { Employee } from "../types/types";
 
// GraphQL Queries
export const GET_ALL_EMPLOYEES = gql`
  query Employees {
    employees {
      id
      name
      email
      role
    }
  }
`;

export const GET_EMPLOYEE_BY_ID = gql`
  query EmployeeById($employeeById: String!) {
    employeeById(id: $employeeById) {
      id
      name
      email
      role
      projects {
        id
        name
        description
      }
    }
  }
`;

export const GET_EMPLOYEE_BY_EMAIL = gql`
  query EmployeeByEmail($email: String!) {
    employeeByEmail(email: $email) {
      id
      name
      email
      role
    }
  }
`;

//Interfaces
export interface EmployeesResponse {
  employees: Employee[];
}

export interface EmployeeResponse {
  employee: Employee;
}

export interface EmployeeByEmailResponse {
  employeeByEmail: Employee[];
}

export interface EmployeeByIdInput {
  employeeById: String;
}

export interface EmployeeByEmailInput {
  email: String;
}

// GraphQL Queries Custom Hooks
export const useGetAllEmployees = () => {
  return useQuery<EmployeesResponse>(GET_ALL_EMPLOYEES);
};

export const useGetEmployeeById = (employeeById: String) => {
  return useQuery<EmployeeByEmailResponse, EmployeeByIdInput>(GET_EMPLOYEE_BY_ID, {
    variables: { employeeById },
  });
};

export const useGetEmployeeByEmail = (email: String) => {
  return useLazyQuery<EmployeeByEmailResponse, EmployeeByEmailInput>(
    GET_EMPLOYEE_BY_EMAIL,
    {
      variables: { email },
    }
  );
};