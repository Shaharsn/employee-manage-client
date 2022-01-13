import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useGetAllProjects } from "../../graphQL/projectQueries";
import ProjectDataTable from "./ProjectDataTable";
import AddIcon from "@mui/icons-material/AddBox";
import useModal from "../../hooks/useModal";
import ModalPortal from "../UI/ModalPortal";
import { Project } from "../../types/types";
import DeleteModal from "../UI/DeleteModal";
import ProjectEditModalContent from "./ProjectModalContent";
import { useState } from "react";
import { useDeleteProject } from "../../graphQL/projectMutations";

const initProject: Project = {
  id: "-1",
  name: "",
  description: "",
};

const initModalInfo: ModalInfoInterface = {
  type: "NEW",
  header: "New Project",
  project: initProject,
};

interface ModalInfoInterface {
  type: string;
  header: string;
  project: Project;
}

const ProjectList = () => {
  const { isShowing: showProjectModal, toggle: toggleProjectModal } =
    useModal();
  const { isShowing: showDeleteModal, toggle: toggleDeleteModal } = useModal();

  const [deleteProject] = useDeleteProject();

  const [modalInfo, setModalInfo] = useState<ModalInfoInterface>(initModalInfo);

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

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    <p>{error}</p>;
  }

  return (
    <Card sx={{ marginTop: ["40px"] }}>
      <CardHeader
        title="Projects"
        action={
          <IconButton aria-label="settings" onClick={onNew}>
            <AddIcon />
          </IconButton>
        }
      >
        <AddIcon />
      </CardHeader>
      <CardContent>
        <ProjectDataTable
          projects={data?.projects || []}
          editProject={onEdit}
          deleteProject={onDelete}
        />
      </CardContent>

      <ModalPortal
        header={modalInfo.header}
        showModal={showProjectModal}
        closeModal={toggleProjectModal}
      >
        <ProjectEditModalContent
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
        />{" "}
      </ModalPortal>
    </Card>
  );
};
export default ProjectList;
