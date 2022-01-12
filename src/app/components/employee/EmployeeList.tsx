import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useGetAllEmployees } from "../../graphQL/employeeQueries";
import { useDeleteEmployee } from "../../graphQL/employeeMutations";

import { Employee as IEmployee } from "../../types/types";
import { Employee } from "../../model/objectClasses";
import EmployeeDataTable from "./EmployeeDataTable";
import AddIcon from "@mui/icons-material/AddBox";
import ModalPortal from "../UI/ModalPortal";
import useModal from "../../hooks/useModal";
import { useContext, useEffect, useState } from "react";
import EmployeeModalContent from "./EmployeeModalContent";
import DeleteModal from "../UI/DeleteModal";
import DBContext from "../../store/db/DBContext";

const EmployeeList = () => {
  const dbContext = useContext(DBContext);

  const { isShowing: showEmployeeModal, toggle: toggleEmployeeModal } =
    useModal();
  const { isShowing: showDeleteModal, toggle: toggleDeleteModal } = useModal();
  const { deleteEmployee } = useDeleteEmployee();

  const [modalHeader, setModalHeader] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee>(
    new Employee()
  );

  const { loading, error, data } = useGetAllEmployees();

  useEffect(() => {
    let employees =
      data && data.employees && data.employees.length > 0 ? data.employees : [];

    dbContext.storeEmployeeList(employees);
  }, [data]);

  const onNewEmployee = () => {
    setModalHeader("New Employee");
    setSelectedEmployee(new Employee());
    toggleEmployeeModal();
  };

  const onEdit = (employeeId: number) => {
    const selectedEmp: IEmployee | undefined = dbContext.employees.find(
      (emp) => emp.id === employeeId
    );

    if (selectedEmp) {
      setModalHeader("Edit Employee");
      setSelectedEmployee(selectedEmp);
      toggleEmployeeModal();
    }
  };

  const onDelete = (employeeId: number) => {
    const selectedEmp: IEmployee | undefined = dbContext.employees.find(
      (emp) => emp.id === employeeId
    );

    if (selectedEmp) {
      setSelectedEmployee(selectedEmp);
      toggleDeleteModal();
    }
  };

  const onDeleteConfirm = (employeeId: number) => {
    deleteEmployee(employeeId).then(() => {
      dbContext.deleteEmployee(employeeId);
    });
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    <p>{error}</p>;
  }

  return (
    <>
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
            employees={dbContext.employees}
            editEmployee={onEdit}
            deleteEmployee={onDelete}
          />
        </CardContent>
      </Card>

      <ModalPortal
        header={modalHeader}
        showModal={showEmployeeModal}
        closeModal={toggleEmployeeModal}
      >
        <EmployeeModalContent
          employee={selectedEmployee}
          close={toggleEmployeeModal}
        />
      </ModalPortal>

      <ModalPortal
        header="Delete Employee"
        showModal={showDeleteModal}
        closeModal={toggleDeleteModal}
      >
        <DeleteModal
          type="Employee"
          name={selectedEmployee?.name}
          id={selectedEmployee?.id}
          confirmMethod={onDeleteConfirm}
          closeModal={toggleDeleteModal}
        />
      </ModalPortal>
    </>
  );
};
export default EmployeeList;
