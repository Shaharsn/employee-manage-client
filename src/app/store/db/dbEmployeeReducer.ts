import { Employee } from "../../types/types";

export interface StateEmployeeInterface {
  employees: Employee[];
}

export interface ActionEmployeeInterface {
  type: string;
  item: number | Employee | Employee[];
}

export const EmployeeReducer = (
  state: StateEmployeeInterface,
  action: ActionEmployeeInterface
) => {
  let updatedEmployees = [...state.employees];

  switch (action.type) {
    case "STORE": {
      updatedEmployees = [...(action.item as Employee[])];
      break;
    }
    case "ADD": {
      updatedEmployees = [...updatedEmployees, action.item as Employee];
      break;
    }
    case "UPDATE": {
      const updatedEmp = action.item as Employee;
      const existingEmployeeIndex = updatedEmployees.findIndex(
        (emp) => emp.id === updatedEmp.id
      );
      const existingEmployee = updatedEmployees[existingEmployeeIndex];

      updatedEmployees[existingEmployeeIndex] = {
        ...existingEmployee,
        name: updatedEmp.email,
        email: updatedEmp.email,
        role: updatedEmp.role,
      };
      break;
    }
    case "DELETE": {
      const empIdToRemove = action.item as number;

      updatedEmployees = [
        ...updatedEmployees.filter((emp) => emp.id !== empIdToRemove),
      ];

      break;
    }
    default: {
      break;
    }
  }

  return { employees: updatedEmployees };
};
