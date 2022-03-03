export const new_project = `
  mutation AddProject {
    addProject(
        id: "99999", 
        name: "Test Project",
        description: "Test Description"
    ) {
      id
      description
    }
  }
`;