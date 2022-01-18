// GraphQL Mutations

import { gql, useMutation } from "@apollo/client";
import { Employee, Project } from "../types/types";
import {
  IProjectsResponse,
  GET_ALL_PROJECTS,
  useGetAllProjects,
} from "./projectQueries";

export const ADD_PROJECT = gql`
  mutation AddProject($id: String!, $name: String!, $description: String!) {
    addProject(id: $id, name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: String!, $name: String, $description: String) {
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

export const UPDATE_PROJECT_EMPLOYEES = gql`
  mutation UpdateProjectEmployees(
    $projectsWithEmployees: [ProjectsWithEmployees!]
  ) {
    updateProjectEmployees(projectsWithEmployees: $projectsWithEmployees) {
      id
      employees {
        id
        name
        email
        role
      }
    }
  }
`;

// GraphQL Mutations Custom HooK

export const useAddProject = (onComplete: () => void) => {
  return useMutation(ADD_PROJECT, {
    // Update the Cache
    update: (cache, data) => {
      const cachedData = cache.readQuery<IProjectsResponse>({
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
      const cachedData = cache.readQuery<IProjectsResponse>({
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
      const cachedData = cache.readQuery<IProjectsResponse>({
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

export const useUpdateProjectsEmployees = (onComplete?: () => void) => {
  return useMutation(UPDATE_PROJECT_EMPLOYEES, {
    // Update the Cache
    update: (cache, data) => {
      const cachedData = cache.readQuery<IProjectsResponse>({
        query: GET_ALL_PROJECTS,
      });
      const projects = cachedData?.projects || [];
      const updatedProjectEmployees = data.data.updateProjectEmployees;
      const updatedProjects = [...projects];

      updatedProjectEmployees.forEach((proj: Project) => {
        let existProjIdx = projects.findIndex(
          (proj) => proj.id === updatedProjectEmployees.id
        );
        let existProj = projects[existProjIdx];

        updatedProjects[existProjIdx] = {
          ...existProj,
          employees: updatedProjectEmployees.employees,
        };
      });

      cache.writeQuery({
        query: GET_ALL_PROJECTS,
        data: { projects: updatedProjects },
      });
    },
    // Run a given method on complete
    onCompleted: onComplete,
  });
};

export const useAddEmployeeToProjects = () => {
  const [updateProjectEmployees] = useUpdateProjectsEmployees();
  const { data } = useGetAllProjects();

  const runAddEmployeeToProjects = (
    employee: Employee,
    projects: Project[]
  ) => {
    if (data) {
      let variablesArr: {}[] = [];

      // Get all the projects that includes the employee inside their employee list
      let projectIncludesTheEmployee = data.projects.filter(proj => proj.employees?.some(emp => emp.id === employee.id));

      // Remove the Employee from Projects hold him and now they not need too
      projectIncludesTheEmployee.forEach((proj) => {
        if (!projects.find((p) => p.id === proj.id)) {
          let projEmployees =
            proj.employees
              ?.filter((emp) => emp.id !== employee.id)
              .map((emp) => {
                return {
                  id: emp.id,
                  name: emp.name,
                  email: emp.email,
                  role: emp.role,
                };
              }) || [];

          variablesArr.push({ id: proj.id, employees: projEmployees });
        }
      });

      projects.forEach((proj) => {
        if (!projectIncludesTheEmployee.find((p) => p.id === proj.id)) {
          // Get the project from the data's projects
          let existProj = data.projects?.find((p) => p.id === proj.id);

          if (existProj) {
            // Add all the other employees to the project's employee list
            let projEmployees =
              existProj.employees
                ?.filter((emp) => emp.id !== employee.id)
                .map((emp) => {
                  return {
                    id: emp.id,
                    name: emp.name,
                    email: emp.email,
                    role: emp.role,
                  };
                }) || [];

            // Adding the new employee to the project's employee list
            projEmployees?.push({
              id: employee.id,
              name: employee.name,
              email: employee.email,
              role: employee.role,
            });

            variablesArr.push({ id: existProj.id, employees: projEmployees });
          }
        }
      });

      updateProjectEmployees({
        variables: { projectsWithEmployees: variablesArr },
      });
    }
  };

  return { runAddEmployeeToProjects: runAddEmployeeToProjects };
};
