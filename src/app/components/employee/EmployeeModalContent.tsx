import { useRef } from "react";
import { Employee } from "../../types/types";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, MenuItem } from "@mui/material";

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
  employee: Employee;
}

const EmployeeModalContent = (props: EmployeeEditModalContentInterface) => {
  const empName = useRef<HTMLInputElement | null>(null)
  const empEmail = useRef<HTMLInputElement | null>(null)
  const empRole = useRef<HTMLInputElement | null>(null)


  const onRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event);
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
          ref={empName}
          defaultValue={props.employee?.name}
        />

        <TextField
          required
          id="email"
          label="email"
          type="email"
          size="small"
          ref={empEmail}
          defaultValue={props.employee?.email}
        />

        <TextField
          id="role"
          select
          label="Role"
          value={props.employee?.role}
          ref={empRole}
          onChange={onRoleChange}
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
        <Button variant="contained" sx={{ m: 1 }}>
          Save
        </Button>
      </Box>
    </>
  );
};
export default EmployeeModalContent;
