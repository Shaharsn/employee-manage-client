import { Employee, Project } from "../../types/types";
import { useGetAllProjects } from "../../graphQL/projectQueries";
import { Button, Checkbox, List, ListItem, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { useUpdateEmployeesProjects } from "../../graphQL/employeeMutations";
import { useAddEmployeeToProjects } from "../../graphQL/projectMutations";

interface IEmployeeProjectsProps {
  employee: Employee;
  close: () => void;
}

interface ICheckboxProjectList {
  project: Project;
  isChecked: boolean;
}

const EmployeeProjects = (props: IEmployeeProjectsProps) => {
  const { employee, close } = props;

  const [checkboxProjectList, setCheckboxProjectList] = useState<
    ICheckboxProjectList[]
  >([]);

  const {runAddEmployeeToProjects} = useAddEmployeeToProjects();

  const { data } = useGetAllProjects(); // Will run from cache if already ran by the Admin dashboard page

  const [updateEmployeeProjects] = useUpdateEmployeesProjects(close);

  useEffect(() => {
    if (data) {
      let employeeProjects: string[] = [];
      let allProjects: ICheckboxProjectList[] = [];

      // Storing the employee project IDs
      employee.projects?.forEach((proj) => {
        employeeProjects.push(proj.id);
      });

      // Adding all the projects
      data.projects.forEach((proj) => {
        allProjects.push({ project: proj, isChecked: false });
      });

      // Checking all the project that the Employee already assigned to.
      allProjects.forEach((proj) => {
        if (employeeProjects.includes(proj.project.id)) {
          proj.isChecked = true;
        }
      });

      setCheckboxProjectList([...allProjects]);
    }
  }, [data]);

  const handleToggle = (projId: string) => () => {
    const updatedProjects = [...checkboxProjectList];

    const projIdx = checkboxProjectList.findIndex(
      (proj) => proj.project.id === projId
    );
    const currentProj = checkboxProjectList[projIdx];

    updatedProjects[projIdx] = {
      ...currentProj,
      isChecked: !currentProj.isChecked,
    };

    setCheckboxProjectList([...updatedProjects]);
  };

  const saveChanges = () => {
    const checkedProjects = checkboxProjectList
      .filter((proj) => proj.isChecked)
      .map((proj) => {
        return {
          id: proj.project.id,
          name: proj.project.name,
          description: proj.project.description,
        };
      });

    updateEmployeeProjects({
      variables: {
        employeesWithProjects: [{ id: employee.id, projects: checkedProjects }],
      },
    });

    runAddEmployeeToProjects(employee, checkedProjects);
  };

  return (
    <>
      <br />
      <List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
        {checkboxProjectList.map((proj) => {
          const labelId = `checkbox-list-secondary-label-${proj}`;
          return (
            <ListItem
              key={proj.project.id}
              secondaryAction={
                <Checkbox
                  edge="end"
                  onChange={handleToggle(proj.project.id)}
                  checked={proj.isChecked}
                  inputProps={{ "aria-labelledby": labelId }}
                />
              }
              disablePadding
            >
              <ListItemText
                id={proj.project.id}
                primary={proj?.project?.name}
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
export default EmployeeProjects;
