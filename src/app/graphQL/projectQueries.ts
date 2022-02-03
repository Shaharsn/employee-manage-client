import { gql, useQuery } from "@apollo/client";
import { Project } from "../types/types";
import { EMPLOYEE_DETAIL_FIELDS } from "./fragments";
import { PROJECT_DETAIL_FIELDS } from "./fragments";

// GraphQL Queries
export const GET_ALL_PROJECTS = gql`

  query Projects {
    projects {
      ...ProjectDetailFields
      employees {
        ...EmployeeDetailFields
      }
    }
  }
  
  ${EMPLOYEE_DETAIL_FIELDS}
  ${PROJECT_DETAIL_FIELDS}
`;

export const GET_PROJECT_BY_ID = gql`

  query ProjectById($projectById: string!) {
    projectById(id: $projectById) {
      ...ProjectDetailFields

      employees {
        ...EmployeeDetailFields
      }
    }
  }
  
  ${EMPLOYEE_DETAIL_FIELDS}
  ${PROJECT_DETAIL_FIELDS}
`;

//Interfaces
export interface IProjectsResponse {
  projects: [Project];
}

export interface IProjectByIdInput {
  projectById: string;
}

export interface IProjectByIdResponse {
  project: Project;
}

// GraphQL Queries Methods
export const useGetAllProjects = () => {
  return useQuery<IProjectsResponse>(GET_ALL_PROJECTS);
};

// GraphQL Queries Methods
export const useGetProjectById = (projectById: string) => {
  return useQuery<IProjectByIdResponse, IProjectByIdInput>(GET_ALL_PROJECTS, {
    variables: { projectById },
  });
};
