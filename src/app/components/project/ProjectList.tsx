import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useGetAllProjects } from "../../graphQL/project";
import ProjectDataTable from "./ProjectDataTable";
import AddIcon from "@mui/icons-material/AddBox";
import { useState } from "react";
import useModal from "../../hooks/useModal";
import ProjectEditModalContent from "./ProjectEditModalContent";
import ModalPortal from "../UI/ModalPortal";
import { Project } from "../../types/types";
import DeleteModal from "../UI/DeleteModal";

const ProjectList = () => {  
  const { isShowing: showEditModal, toggle: toggleEditModal } = useModal();
  const { isShowing: showDeleteModal, toggle: toggleDeleteModal } = useModal();

  const { loading, error, data } = useGetAllProjects();
  const projects = data && data.projects ? data.projects : [];

  const [selectedProject, setSelectedProject] = useState<
    Project | undefined
  >();

  const onEdit = (projectId: number) => {
    setSelectedProject(projects.find((emp) => emp.id === projectId));
    toggleEditModal();
  };

  const onDelete = (projectId: number) => {
    setSelectedProject(projects.find((emp) => emp.id === projectId));
    toggleDeleteModal();
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
          <IconButton aria-label="settings">
            <AddIcon />
          </IconButton>
        }
      >
        <AddIcon />
      </CardHeader>
      <CardContent>
        <ProjectDataTable projects={projects} 
          editProject={onEdit}
          deleteProject={onDelete} />
      </CardContent>

      <ModalPortal
        header="Edit Employee"
        showModal={showEditModal}
        closeModal={toggleEditModal}
      >
        <ProjectEditModalContent project={selectedProject} />
      </ModalPortal>

      <ModalPortal
        header="Delete Employee"
        showModal={showDeleteModal}
        closeModal={toggleDeleteModal}
      >
        <DeleteModal type="Project" name={selectedProject?.name} />
      </ModalPortal>
    </Card>
  );
};
export default ProjectList;
