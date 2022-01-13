import { Project } from "../../types/types";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { useRef } from "react";
import {
  useAddProject,
  useUpdateProject,
} from "../../graphQL/projectMutations";

interface ProjectEditModalContentInterface {
  type: string;
  project: Project;
  close: () => void;
}

const ProjectEditModalContent = (props: ProjectEditModalContentInterface) => {
  const { type, project, close } = props;

  const [addProject] = useAddProject(close);
  const [updateProject] = useUpdateProject(close);

  const projName = useRef<HTMLInputElement | null>(null);
  const projDescription = useRef<HTMLInputElement | null>(null);

  const onSaveNew = () => {
    const newProj: Project = {
      id: String(Math.floor(Math.random() * 10000)),
      name: projName.current?.value,
      description: projDescription.current?.value,
    };

    addProject({ variables: newProj });
  };

  const onSaveUpdate = () => {
    const updatedProj: Project = {
      id: project.id,
      name: projName.current?.value,
      description: projDescription.current?.value,
    };

    updateProject({ variables: updatedProj });
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
          inputRef={projName}
          defaultValue={project?.name}
        />

        <TextField
          required
          id="description"
          label="Description"
          type="description"
          size="small"
          inputRef={projDescription}
          defaultValue={project?.description}
        />
      </Box>

      <Box textAlign="center">
        <Button
          variant="contained"
          sx={{ m: 1 }}
          onClick={type === "NEW" ? onSaveNew : onSaveUpdate}
        >
          Save
        </Button>
      </Box>
    </>
  );
};
export default ProjectEditModalContent;
