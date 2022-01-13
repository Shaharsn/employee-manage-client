// GraphQL Mutations

import { gql, useMutation } from "@apollo/client";
import { ProjectsResponse, GET_ALL_PROJECTS } from "./projectQueries";

export const ADD_PROJECT = gql`
  mutation AddProject(
    $id: String!
    $name: String!
    $description: String!
  ) {
    addProject(id: $id, name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: String!
    $name: String
    $description: String
  ) {
    updateProject(id: $id, name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: String!) {
    deleteProject(id: $id) {
      id
    }
  }
`;

// GraphQL Mutations Custom HooK

export const useAddProject = (onComplete: () => void) => {
  return useMutation(ADD_PROJECT, {
    // Update the Cache
    update: (cache, data) => {
      const cachedData = cache.readQuery<ProjectsResponse>({
        query: GET_ALL_PROJECTS,
      });
      const projects = cachedData?.projects || [];
      const newProject = data.data.addProject;
      const updatedProjects = [...projects, newProject];

      cache.writeQuery({
        query: GET_ALL_PROJECTS,
        data: { projects: updatedProjects },
      });
    },
    // Run a given method on complete
    onCompleted: onComplete,
  });
};

export const useUpdateProject = (onComplete: () => void) => {
  return useMutation(UPDATE_PROJECT, {
    // Update the Cache
    update: (cache, data) => {
      const cachedData = cache.readQuery<ProjectsResponse>({
        query: GET_ALL_PROJECTS,
      });
      const projects = cachedData?.projects || [];
      const updatedProject = data.data.updateProject;
      const updatedProjects = [...projects];

      const existProjIdx = projects.findIndex(
        (proj) => proj.id === updatedProject.id
      );
      const existProj = projects[existProjIdx];

      updatedProjects[existProjIdx] = {
        ...existProj,
        name: updatedProject.name,
        description: updatedProject.description,
      };

      cache.writeQuery({
        query: GET_ALL_PROJECTS,
        data: { projects: updatedProjects },
      });
    },
    // Run a given method on complete
    onCompleted: onComplete,
  });
};

export const useDeleteProject = () => {
  return useMutation(DELETE_PROJECT, {
    // Update the Cache
    update: (cache, data) => {
      const cachedData = cache.readQuery<ProjectsResponse>({
        query: GET_ALL_PROJECTS,
      });
      const projects = cachedData?.projects || [];
      console.log(data);
      const removedProjectId = data.data.deleteProject.id;
      const updatedProjects = [
        ...projects.filter((proj) => proj.id !== removedProjectId),
      ];

      cache.writeQuery({
        query: GET_ALL_PROJECTS,
        data: { projects: updatedProjects },
      });
    },
  });
};
