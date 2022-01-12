import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../store/auth/AuthContext";

const PrivateRoute = () => {
  const authContext = useContext(AuthContext);

  return authContext.isLoggedIn ? <Outlet /> : <Navigate replace to="/login" />;
};
export default PrivateRoute;
