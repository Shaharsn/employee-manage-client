import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  createTheme,
  CssBaseline,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useGetEmployeeByEmail } from "../graphQL/employee";
import AuthContext from "../context/auth-context";
import { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserInfo } from "../model/userInfo";

const Login = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  // Get User from the Employee list (GraphQL)
  const [getEmployee, { loading, error, data }] = useGetEmployeeByEmail("");

  useEffect(() => {
    if (error) {
      console.log(JSON.stringify(error));
      return;
    }

    if (data) {
      console.log(data);

      if (data.employeeByEmail != null && data.employeeByEmail.length > 0) {
        const employee = data.employeeByEmail[0];

        authContext.login(new UserInfo(employee.name, employee.role));
        navigate("/dashboard", { replace: true });
      }
    }
  }, [authContext, data, error, navigate]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const providedEmail = new FormData(event.currentTarget)
      .get("email")
      ?.toString()
      .toLowerCase();

    if (!providedEmail) {
      return;
    }

    getEmployee({ variables: { email: providedEmail } });
  };

  const theme = createTheme();

  if (loading) {
    return <CircularProgress />;
  }

  return authContext.isLoggedIn ? (
    <Navigate replace to="/dashboard" />
  ) : (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
export default Login;
