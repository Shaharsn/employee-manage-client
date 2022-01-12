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
import { useContext, useEffect, useState } from "react";
import useModal from "../../hooks/useModal";
import ProjectEditModalContent from "./ProjectEditModalContent";
import ModalPortal from "../UI/ModalPortal";
import { Project } from "../../types/types";
import DeleteModal from "../UI/DeleteModal";
import DBContext from "../../store/db/DBContext";

const ProjectList = () => {
  const dbContext = useContext(DBContext);

  const { isShowing: showEditModal, toggle: toggleEditModal } = useModal();
  const { isShowing: showDeleteModal, toggle: toggleDeleteModal } = useModal();

  const { loading, error, data } = useGetAllProjects();

  useEffect(() => {
    let projects =
      data && data.projects && data.projects.length > 0 ? data.projects : [];

    dbContext.storeProjectList(projects);
  }, [data]);

  const [selectedProject, setSelectedProject] = useState<Project | undefined>();

  const onEdit = (projectId: number) => {
    setSelectedProject(dbContext.projects.find((emp) => emp.id === projectId));
    toggleEditModal();
  };

  const onDelete = (projectId: number) => {
    setSelectedProject(dbContext.projects.find((emp) => emp.id === projectId));
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
        <ProjectDataTable
          projects={dbContext.projects}
          editProject={onEdit}
          deleteProject={onDelete}
        />
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
        {/*<DeleteModal type="Project" name={selectedProject?.name} id={selectedProject?.id} />*/}
      </ModalPortal>
    </Card>
  );
};
export default ProjectList;
