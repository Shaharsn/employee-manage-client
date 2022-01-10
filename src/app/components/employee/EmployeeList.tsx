import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useGetAllEmployees } from "../../graphQL/employee";
import { Employee as IEmployee } from "../../types/types";
import { Employee } from "../../model/objectClasses";
import EmployeeDataTable from "./EmployeeDataTable";
import AddIcon from "@mui/icons-material/AddBox";
import ModalPortal from "../UI/ModalPortal";
import useModal from "../../hooks/useModal";
import { useState } from "react";
import EmployeeEditModalContent from "./EmployeeModalContent";
import DeleteModal from "../UI/DeleteModal";

const EmployeeList = () => {
  const { isShowing: showEmployeeModal, toggle: toggleEmployeeModal } = useModal();
  const { isShowing: showDeleteModal, toggle: toggleDeleteModal } = useModal();

  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee>(
    new Employee()
  );

  const { loading, error, data } = useGetAllEmployees();
  const employees: IEmployee[] = data && data.employees ? data.employees : [];

  const onNewEmployee = () => {
    setSelectedEmployee(new Employee());
    toggleEmployeeModal();
  }

  const onEdit = (employeeId: number) => {
    const selectedEmp: IEmployee | undefined = employees.find(
      (emp) => emp.id === employeeId
    );

    if (selectedEmp) {
      setSelectedEmployee(selectedEmp);
      toggleEmployeeModal();
    }
  };

  const onDelete = (employeeId: number) => {
    const selectedEmp: IEmployee | undefined = employees.find(
      (emp) => emp.id === employeeId
    );

    if (selectedEmp) {
      setSelectedEmployee(selectedEmp);
      toggleDeleteModal();
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    <p>{error}</p>;
  }

  return (
    <Card sx={{ marginTop: ["40px"] }}>
      <CardHeader
        title="Employees"
        action={
          <IconButton aria-label="settings" onClick={onNewEmployee}>
            <AddIcon />
          </IconButton>
        }
      />

      <CardContent>
        <EmployeeDataTable
          employees={employees}
          editEmployee={onEdit}
          deleteEmployee={onDelete}
        />
      </CardContent>

      <ModalPortal
        header="Edit IEmployee"
        showModal={showEmployeeModal}
        closeModal={toggleEmployeeModal}
      >
        <EmployeeEditModalContent employee={selectedEmployee} />
      </ModalPortal>

      <ModalPortal
        header="Delete IEmployee"
        showModal={showDeleteModal}
        closeModal={toggleDeleteModal}
      >
        <DeleteModal type="Employee" name={selectedEmployee?.name} />
      </ModalPortal>
    </Card>
  );
};
export default EmployeeList;
