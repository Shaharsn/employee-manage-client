import { Container } from "@mui/material";
import EmployeeList from "../employee/EmployeeList";
import ProjectList from "../project/ProjectList";

const Dashboard = () => {
  return (
    <Container maxWidth="xl">
      <EmployeeList />
      <ProjectList />
    </Container>
  );
};
export default Dashboard;
