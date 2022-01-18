import { Employee } from "../../types/types";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, MenuItem } from "@mui/material";
import {
  useAddEmployee,
  useUpdateEmployee,
} from "../../graphQL/employeeMutations";
import { useRef } from "react";

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

interface IEmployeeNewEditFormProps {
  type: string;
  employee: Employee;
  close: () => void;
}

const EmployeeNewEditForm = (props: IEmployeeNewEditFormProps) => {
  const { type, employee, close } = props;

  const [addEmployee] = useAddEmployee(close);
  const [updateEmployee] = useUpdateEmployee(close);

  const empName = useRef<HTMLInputElement | null>(null);
  const empEmail = useRef<HTMLInputElement | null>(null);
  const empRole = useRef<HTMLInputElement | null>(null);

  const onSaveNew = () => {
    const newEmp: Employee = {
      id: String(Math.floor(Math.random() * 10000)),
      name: empName.current?.value,
      email: empEmail.current?.value,
      role: empRole.current?.value,
    };

    addEmployee({ variables: newEmp });
  };

  const onSaveUpdate = () => {
    const updatedEmp: Employee = {
      id: props.employee.id,
      name: empName.current?.value,
      email: empEmail.current?.value,
      role: empRole.current?.value,
    };

    updateEmployee({ variables: updatedEmp });
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
          defaultValue={employee?.name}
        />

        <TextField
          required
          id="email"
          label="email"
          type="email"
          size="small"
          inputRef={empEmail}
          defaultValue={employee?.email}
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
          onClick={type === "NEW" ? onSaveNew : onSaveUpdate}
        >
          Save
        </Button>
      </Box>
    </>
  );
};
export default EmployeeNewEditForm;
