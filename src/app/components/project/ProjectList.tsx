import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useGetAllProjects } from "../../graphQL/projectQueries";
import { useDeleteProject } from "../../graphQL/projectMutations";
import { Project } from "../../types/types";
import ProjectDataTable from "./ProjectDataTable";
import AddIcon from "@mui/icons-material/AddBox";
import ModalPortal from "../UI/ModalPortal";
import useModal from "../../hooks/useModal";
import { useState } from "react";
import ProjectNewEditForm from "./ProjectNewEditForm";
import DeleteModal from "../UI/DeleteModal";
import ProjectEmployees from "./ProjectEmployees";

const initProject: Project = {
  id: "-1",
  name: "",
  description: "",
};

const initModalInfo: IModalInfo = {
  type: "NEW",
  header: "New Project",
  project: initProject,
};

interface IModalInfo {
  type: string;
  header: string;
  project: Project;
}

const ProjectList = () => {
  const { isShowing: showProjectModal, toggle: toggleProjectModal } =
    useModal();
  const { isShowing: showDeleteModal, toggle: toggleDeleteModal } = useModal();
  const {
    isShowing: showProjectEmployeesModal,
    toggle: toggleProjectEmployeesModal,
  } = useModal();

  const [deleteProject] = useDeleteProject();

  const [modalInfo, setModalInfo] = useState<IModalInfo>(initModalInfo);

  const { loading, error, data } = useGetAllProjects();

  const onNew = () => {
    setModalInfo(initModalInfo);
    toggleProjectModal();
  };

  const onEdit = (selectedProject: Project) => {
    setModalInfo({
      type: "UPDATE",
      header: "Update Project",
      project: selectedProject,
    });
    toggleProjectModal();
  };

  const onDelete = (selectedProject: Project) => {
    setModalInfo({
      type: "DELETE",
      header: "Delete Project",
      project: selectedProject,
    });
    toggleDeleteModal();
  };

  const onDeleteConfirm = () => {
    if (modalInfo.project && modalInfo.project.id) {
      deleteProject({ variables: { id: modalInfo.project.id } });
    }
  };

  const onShowProjectEmployee = (selectedProject: Project) => {
    setModalInfo({
      type: "PROJECT_EMPLOYEES",
      header: selectedProject.name + "'s Employees",
      project: selectedProject,
    });
    toggleProjectEmployeesModal();
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
          title="Projects"
          action={
            <IconButton aria-label="settings" onClick={onNew}>
              <AddIcon />
            </IconButton>
          }
        />

        <CardContent>
          <ProjectDataTable
            projects={data?.projects || []}
            editProject={onEdit}
            deleteProject={onDelete}
            showProjectEmployee={onShowProjectEmployee}
          />
        </CardContent>
      </Card>
      <ModalPortal
        header={modalInfo.header}
        showModal={showProjectModal}
        closeModal={toggleProjectModal}
      >
        <ProjectNewEditForm
          type={modalInfo.type}
          project={modalInfo.project}
          close={toggleProjectModal}
        />
      </ModalPortal>

      <ModalPortal
        header={modalInfo.header}
        showModal={showDeleteModal}
        closeModal={toggleDeleteModal}
      >
        <DeleteModal
          type="Project"
          name={modalInfo.project.name || ""}
          confirmMethod={onDeleteConfirm}
          closeModal={toggleDeleteModal}
        />
      </ModalPortal>

      <ModalPortal
        header={modalInfo.header}
        showModal={showProjectEmployeesModal}
        closeModal={toggleProjectEmployeesModal}
      >
        <ProjectEmployees
          project={modalInfo.project}
          close={toggleProjectEmployeesModal}
        />
      </ModalPortal>
    </>
  );
};
export default ProjectList;
