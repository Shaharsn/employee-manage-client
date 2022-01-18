import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Project } from "../../types/types";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: ["#336fabe0"],
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface IProjectDataTableProps {
  projects: Project[];
  editProject: (project: Project) => void;
  deleteProject: (project: Project) => void;
  showProjectEmployee: (project: Project) => void;
}

const ProjectDataTable = (props: IProjectDataTableProps) => {
  const { projects, editProject, deleteProject, showProjectEmployee } = props;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Description</StyledTableCell>
            <StyledTableCell sx={{ width: 150 }}>
              Assigned Users
            </StyledTableCell>
            <StyledTableCell align="center" sx={{ width: 100 }}>
              Actions
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((proj) => (
            <StyledTableRow
              key={proj.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <StyledTableCell component="th" scope="row">
                {proj.name}
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                {proj.description}
              </StyledTableCell>

              <StyledTableCell component="th" scope="row">
                <Button
                  variant="text"
                  onClick={() => showProjectEmployee(proj)}
                >
                  Users
                </Button>
              </StyledTableCell>

              <StyledTableCell component="th" scope="row" align="center">
                <IconButton aria-label="edit" onClick={() => editProject(proj)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => deleteProject(proj)}
                >
                  <DeleteIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default ProjectDataTable;
