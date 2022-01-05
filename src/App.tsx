import { Route, Routes, Navigate } from "react-router-dom";
import { AuthContextProvider } from "./app/context/auth-context";
import PrivateRoute from "./app/routerUtils/PrivateRoute";
import Dashboard from "./app/components/Dashboard";
import Login from "./app/components/Login";
import "./App.css";
import EmployeeInfo from "./app/components/employee/EmployeeInfo";
import ProjectInfo from "./app/components/project/ProjectInfo";
import Navbar from "./app/components/UI/Navbar";

function App() {
  return (
    <AuthContextProvider>
      <Navbar />
      
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* the PrivateRoute restrict the Routes to work just if the user is logged in*/}
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/new-employee" element={<EmployeeInfo />} />
          <Route path="/new-project" element={<ProjectInfo />} />

          <Route path="/*" element={<Navigate replace to="/dashboard" />} />
        </Route>
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
