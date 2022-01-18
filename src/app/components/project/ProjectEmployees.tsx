import { Employee, Project } from "../../types/types";
import { useGetAllEmployees } from "../../graphQL/employeeQueries";
import { Button, Checkbox, List, ListItem, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { useAddProjectToEmployees } from "../../graphQL/employeeMutations";
import { useUpdateProjectsEmployees } from "../../graphQL/projectMutations";

interface IProjectEmployeesProps {
  project: Project;
  close: () => void;
}

interface ICheckboxEmployeeList {
  employee: Employee;
  isChecked: boolean;
}

const ProjectEmployees = (props: IProjectEmployeesProps) => {
  const { project, close } = props;

  const [checkboxEmployeeList, setCheckboxEmployeeList] = useState<
    ICheckboxEmployeeList[]
  >([]);

  const {runAddProjectToEmployees} = useAddProjectToEmployees();

  const { data } = useGetAllEmployees(); // Will run from cache if already ran by the Admin dashboard page

  const [updateProjectEmployees] = useUpdateProjectsEmployees(close);

  useEffect(() => {
    if (data) {
      let projectEmployees: string[] = [];
      let allEmployees: ICheckboxEmployeeList[] = [];

      // Storing the project employee IDs
      project.employees?.forEach((emp) => {
        projectEmployees.push(emp.id);
      });

      // Adding all the employees
      data.employees.forEach((emp) => {
        allEmployees.push({ employee: emp, isChecked: false });
      });

      // Checking all the employees that the project already assigned to.
      allEmployees.forEach((emp) => {
        if (projectEmployees.includes(emp.employee.id)) {
          emp.isChecked = true;
        }
      });

      setCheckboxEmployeeList([...allEmployees]);
    }
  }, [data]);

  const handleToggle = (projId: string) => () => {
    const updatedEmployees = [...checkboxEmployeeList];

    const empIdx = checkboxEmployeeList.findIndex(
      (emp) => emp.employee.id === projId
    );
    const currentProj = checkboxEmployeeList[empIdx];

    updatedEmployees[empIdx] = {
      ...currentProj,
      isChecked: !currentProj.isChecked,
    };

    setCheckboxEmployeeList([...updatedEmployees]);
  };

  const saveChanges = () => {
    const checkedEmployees = checkboxEmployeeList
      .filter((emp) => emp.isChecked)
      .map((emp) => {
        return {
          id: emp.employee.id,
          name: emp.employee.name,
          email: emp.employee.email,
          role: emp.employee.role,
        };
      });

    updateProjectEmployees({
      variables: {
        projectsWithEmployees: [{ id: project.id, employees: checkedEmployees }],
      },
    });

    runAddProjectToEmployees(project, checkedEmployees);
  };

  return (
    <>
      <br />
      <List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
        {checkboxEmployeeList.map((emp) => {
          const labelId = `checkbox-list-secondary-label-${emp}`;
          return (
            <ListItem
              key={emp.employee.id}
              secondaryAction={
                <Checkbox
                  edge="end"
                  onChange={handleToggle(emp.employee.id)}
                  checked={emp.isChecked}
                  inputProps={{ "aria-labelledby": labelId }}
                />
              }
              disablePadding
            >
              <ListItemText
                id={emp.employee.id}
                primary={emp?.employee?.name}
              />
            </ListItem>
          );
        })}
      </List>

      <Box textAlign="center">
        <Button variant="contained" sx={{ m: 1 }} onClick={saveChanges}>
          Save
        </Button>
      </Box>
    </>
  );
};
export default ProjectEmployees;
