import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useGetAllEmployees } from "../../graphQL/employeeQueries";
import { useDeleteEmployee } from "../../graphQL/employeeMutations";

import { Employee } from "../../types/types";
import EmployeeDataTable from "./EmployeeDataTable";
import AddIcon from "@mui/icons-material/AddBox";
import ModalPortal from "../UI/ModalPortal";
import useModal from "../../hooks/useModal";
import { useState } from "react";
import EmployeeModalContent from "./EmployeeModalContent";
import DeleteModal from "../UI/DeleteModal";

const initEmployee: Employee = {
  id: "-1",
  name: "",
  email: "",
  role: "",
};

const initModalInfo: ModalInfoInterface = {
  type: "NEW",
  header: "New Employee",
  employee: initEmployee,
};

interface ModalInfoInterface {
  type: string;
  header: string;
  employee: Employee;
}

const EmployeeList = () => {
  const { isShowing: showEmployeeModal, toggle: toggleEmployeeModal } =
    useModal();
  const { isShowing: showDeleteModal, toggle: toggleDeleteModal } = useModal();

  const [deleteEmployee] = useDeleteEmployee();

  const [modalInfo, setModalInfo] = useState<ModalInfoInterface>(initModalInfo);

  const { loading, error, data } = useGetAllEmployees();

  const onNew = () => {
    setModalInfo(initModalInfo);
    toggleEmployeeModal();
  };

  const onEdit = (selectedEmployee: Employee) => {
    setModalInfo({
      type: "UPDATE",
      header: "Update Employee",
      employee: selectedEmployee,
    });
    toggleEmployeeModal();
  };

  const onDelete = (selectedEmployee: Employee) => {
    setModalInfo({
      type: "DELETE",
      header: "Delete Employee",
      employee: selectedEmployee,
    });
    toggleDeleteModal();
  };

  const onDeleteConfirm = () => {
    if (modalInfo.employee && modalInfo.employee.id) {
      deleteEmployee({ variables: { id: modalInfo.employee.id } });
    }
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
            <IconButton aria-label="settings" onClick={onNew}>
              <AddIcon />
            </IconButton>
          }
        />

        <CardContent>
          <EmployeeDataTable
            employees={data?.employees || []}
            editEmployee={onEdit}
            deleteEmployee={onDelete}
          />
        </CardContent>
      </Card>

      <ModalPortal
        header={modalInfo.header}
        showModal={showEmployeeModal}
        closeModal={toggleEmployeeModal}
      >
        <EmployeeModalContent
          type={modalInfo.type}
          employee={modalInfo.employee}
          close={toggleEmployeeModal}
        />
      </ModalPortal>

      <ModalPortal
        header={modalInfo.header}
        showModal={showDeleteModal}
        closeModal={toggleDeleteModal}
      >
        <DeleteModal
          type="Employee"
          name={modalInfo.employee.name || ""}
          confirmMethod={onDeleteConfirm}
          closeModal={toggleDeleteModal}
        />
      </ModalPortal>
    </>
  );
};
export default EmployeeList;
