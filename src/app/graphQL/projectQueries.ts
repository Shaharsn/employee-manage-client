import { gql, useQuery } from "@apollo/client";
import { Project } from "../types/types";

// GraphQL Queries
export const GET_ALL_PROJECTS = gql`
  query Projects {
    projects {
      id
      name
      description
      employees {
        id
        name
        email
        role
      }
    }
  }
`;

export const GET_PROJECT_BY_ID = gql`
  query ProjectById($projectById: string!) {
    projectById(id: $projectById) {
      id
      name
      description
      employees {
        id
        name
        email
        role
      }
    }
  }
`;

// GraphQL Mutations

export const ADD_PROJECT = gql`
  mutation AddProjectMutation(
    $addProjectId: string!
    $name: string!
    $description: string
  ) {
    addProject(id: $addProjectId, name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProjectMutation(
    $updateProjectId: string!
    $name: string
    $description: string
  ) {
    updateProject(id: $updateProjectId, name: $name, description: $description)
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProjectMutation($deleteProjectId: string!) {
    deleteProject(id: $deleteProjectId)
  }
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
