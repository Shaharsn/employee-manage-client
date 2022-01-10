import { Project } from "../../types/types";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

interface ProjectEditModalContentInterface {
  project: Project | undefined;
}

const ProjectEditModalContent = (props: ProjectEditModalContentInterface) => {
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
          defaultValue={props.project?.name}
        />

        <TextField
          required
          id="email"
          label="email"
          type="email"
          size="small"
          defaultValue={props.project?.description}
        />
      </Box>

      <Box textAlign="center">
        <Button variant="contained" sx={{ m: 1 }}>
          Save
        </Button>
      </Box>
    </>
  );
};
export default ProjectEditModalContent;
