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
      projects {
        id
        name
        description
      }
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
export interface IEmployeesResponse {
  employees: Employee[];
}

export interface IEmployeeByEmailResponse {
  employeeByEmail: Employee[];
}

export interface IEmployeeByIdInput {
  employeeById: String;
}

export interface IEmployeeByEmailInput {
  email: String;
}

// GraphQL Queries Custom Hooks
export const useGetAllEmployees = () => {
  return useQuery<IEmployeesResponse>(GET_ALL_EMPLOYEES);
};

export const useGetEmployeeById = (employeeById: String) => {
  return useQuery<IEmployeeByEmailResponse, IEmployeeByIdInput>(GET_EMPLOYEE_BY_ID, {
    variables: { employeeById },
  });
};

export const useGetEmployeeByEmail = (email: String) => {
  return useLazyQuery<IEmployeeByEmailResponse, IEmployeeByEmailInput>(
    GET_EMPLOYEE_BY_EMAIL,
    {
      variables: { email },
    }
  );
};