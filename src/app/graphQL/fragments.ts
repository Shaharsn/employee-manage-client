import { gql } from "@apollo/client";

export const EMPLOYEE_DETAIL_FIELDS = gql`
  fragment EmployeeDetailFields on Employee {
    id
    name
    email
    role
  }
`;

export const PROJECT_DETAIL_FIELDS = gql`
  fragment ProjectDetailFields on Project {
    id
    name
    description
  }
`;
