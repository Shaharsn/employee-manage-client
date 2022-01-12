import { useContext, useRef } from "react";
import { Employee as IEmployee } from "../../types/types";
import { Employee } from "../../model/objectClasses";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, MenuItem } from "@mui/material";
import DBContext from "../../store/db/DBContext";
import {
  useAddEmployee,
  useUpdateEmployee,
} from "../../graphQL/employeeMutations";

const roleOptions = [
  {
    value: "ADMIN",
    label: "Admin",
  },
  {
    value: "MANAGER",
    label: "Manager",
  },
  {
    value: "DEVELOPER",
    label: "Developer",
  },
];

interface EmployeeEditModalContentInterface {
  employee: IEmployee;
  close: () => void;
}

const EmployeeModalContent = (props: EmployeeEditModalContentInterface) => {
  const dbContext = useContext(DBContext);

  const { addEmployee } = useAddEmployee();
  const { updateEmployee } = useUpdateEmployee();

  const empName = useRef<HTMLInputElement | null>(null);
  const empEmail = useRef<HTMLInputElement | null>(null);
  const empRole = useRef<HTMLInputElement | null>(null);

  const onSaveAdd = () => {
    const newEmp: Employee = new Employee(
      dbContext.employees.length,
      empName.current?.value,
      empEmail.current?.value,
      empRole.current?.value
    );

    addEmployee(newEmp)
      .then(() => {
        dbContext.addEmployee(newEmp);
        props.close();
      })
      .catch((err) => console.log(err.message));
  };

  const onSaveUpdate = () => {
    const updatedEmp: Employee = new Employee(
      props.employee.id,
      empName.current?.value,
      empEmail.current?.value,
      empRole.current?.value
    );

    updateEmployee(updatedEmp)
      .then(() => {
        dbContext.updateEmployee(updatedEmp);
        props.close();
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "95%" },
        }}
        noValidate
        autoComplete="off"
      >
        <br />
        <TextField
          required
          id="name"
          label="Name"
          type="text"
          size="small"
          inputRef={empName}
          defaultValue={props.employee?.name}
        />

        <TextField
          required
          id="email"
          label="email"
          type="email"
          size="small"
          inputRef={empEmail}
          defaultValue={props.employee?.email}
        />

        <TextField
          id="role"
          select
          label="Role"
          defaultValue={props.employee?.role}
          inputRef={empRole}
          size="small"
        >
          {roleOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box textAlign="center">
        <Button
          variant="contained"
          sx={{ m: 1 }}
          onClick={props.employee.id === -1 ? onSaveAdd : onSaveUpdate}
        >
          Save
        </Button>
      </Box>
    </>
  );
};
export default EmployeeModalContent;
