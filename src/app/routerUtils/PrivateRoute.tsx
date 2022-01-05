import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/auth-context";

const PrivateRoute = () => {
  const authContext = useContext(AuthContext);

  return authContext.isLoggedIn ? <Outlet /> : <Navigate replace to="/login" />;
};
export default PrivateRoute;
