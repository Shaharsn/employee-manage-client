import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
  Button,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth-context";
import classes from "./Navbar.module.css";

interface PageInterface {
  name: string;
  link: string;
}

const settings = ["Logout"];
const LOGO = "PROJECT MANAGEMENT";

const ADMIN_PAGES: PageInterface[] = [
  { name: "Dashboard", link: "/dashboard" },
  { name: "New Employee", link: "./new-employee" },
  { name: "New Project", link: "/new-project" },
];

const MANAGER_PAGES: PageInterface[] = [
  { name: "Dashboard", link: "/dashboard" },
];

const DEVELOPER_PAGES: PageInterface[] = [
  { name: "Dashboard", link: "/dashboard" },
];

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const [pages, setPages] = useState<PageInterface[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    
    console.log('role = ' + authContext.userInfo?.role);

    switch (authContext.userInfo?.role) {
      case "ADMIN": {
        setPages(ADMIN_PAGES);
        break;
      }
      case "MANAGER": {
        setPages(MANAGER_PAGES);
        break;
      }
      case "DEVELOPER": {
        setPages(DEVELOPER_PAGES);
        break;
      }
      default: {
        setPages([]);
        break;
      }
    }
  }, [authContext]);

  const [anchorElNav, setAnchorElNav] = React.useState<
    Element | ((element: Element) => Element) | null | undefined
  >(null);
  const [anchorElUser, setAnchorElUser] = React.useState<
    Element | ((element: Element) => Element) | null | undefined
  >(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event?.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event?.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    setAnchorElNav(null);
    authContext.logout();
    navigate("/login", { replace: true });
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            {LOGO}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Link to={page.link}>
                    <Typography textAlign="center">{page.name}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            {LOGO}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Link to={page.link} className={classes.link} key={page.name}>
                <Button
                  className={classes.button}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.name}
                </Button>
              </Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleLogout}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
