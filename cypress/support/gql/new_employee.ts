export const new_employee = `
  mutation AddEmployee {
    addEmployee(
        id: "99999", 
        name: "Test User",
        email: "test@test.com",
        role: "DEVELOPER"
    ) {
      id
      name
      email
      role
    }
  }
`;
