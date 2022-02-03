import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { Employee } from "../types/types";
import { EMPLOYEE_DETAIL_FIELDS } from "./fragments";
import { PROJECT_DETAIL_FIELDS } from "./fragments";

// GraphQL Queries
export const GET_ALL_EMPLOYEES = gql`
  ${EMPLOYEE_DETAIL_FIELDS}
  ${PROJECT_DETAIL_FIELDS}

  query Employees {
    employees {
      ...EmployeeDetailFields
      projects {
        ...ProjectDetailFields
      }
    }
  }
`;

export const GET_EMPLOYEE_BY_ID = gql`
  query EmployeeById($employeeById: String!) {
    employeeById(id: $employeeById) {
      ...EmployeeDetailFields

      projects {
        ...ProjectDetailFields
      }
    }
  }
  
  ${EMPLOYEE_DETAIL_FIELDS}
  ${PROJECT_DETAIL_FIELDS}
`;

export const GET_EMPLOYEE_BY_EMAIL = gql`
  query EmployeeByEmail($email: String!) {
    employeeByEmail(email: $email) {
      ...EmployeeDetailFields
    }
  }
  
  ${EMPLOYEE_DETAIL_FIELDS}
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
  return useQuery<IEmployeeByEmailResponse, IEmployeeByIdInput>(
    GET_EMPLOYEE_BY_ID,
    {
      variables: { employeeById },
    }
  );
};

export const useGetEmployeeByEmail = (email: String) => {
  return useLazyQuery<IEmployeeByEmailResponse, IEmployeeByEmailInput>(
    GET_EMPLOYEE_BY_EMAIL,
    {
      variables: { email },
    }
  );
};
