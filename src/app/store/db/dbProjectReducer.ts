import { Project } from "../../types/types";

export interface StateProjectInterface {
  projects: Project[];
}

export interface ActionProjectInterface {
  type: string;
  item: number | Project | Project[];
}

export const ProjectReducer = (
  state: StateProjectInterface,
  action: ActionProjectInterface
) => {
  let updatedProjects = [...state.projects];

  switch (action.type) {
    case "STORE": {
      updatedProjects = [...(action.item as Project[])];
      break;
    }
    case "ADD": {
      updatedProjects = [...updatedProjects, action.item as Project];
      break;
    }
    case "UPDATE": {
      break;
    }
    case "DELETE": {
      break;
    }
    default: {
      break;
    }
  }

  return { projects: updatedProjects };
};
