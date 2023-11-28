import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import TuningIcon from "../assets/tuning.svg";
import CloseIcon from "../assets/close.svg";
import Login from "../assets/login.svg";
import Logout from "../assets/logout.svg";

import "./HeaderAndDrawer.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alert, ButtonGroup } from "@mui/material";
import FilterAndSort from "./FilterAndSort";
import { RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { authUser } from "../Reducers/UserSlice";
import UserPageIcon from "../assets/user.svg";

const drawerWidth = 320;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export default function HeaderAndDrawer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [searchValue, setSearchValue] = useState<string>("");
  const [, setSelectedMovie] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const authUserState = useSelector((state: RootState) => state.user.authUser);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = (selectedOption: string | null) => {
    if (searchValue !== "") {
      setSelectedMovie(selectedOption);
      navigate(`/search/${searchValue}`);
      window.location.reload();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch(searchValue);
    }
  };

  const handleLogout = () => {
    dispatch(authUser(false));
    setShowSuccessAlert(true);
    // setTimeout(() => {
    //   setShowSuccessAlert(false);
    // }, 3000);
  };

  const handleLogIn = () => {
    navigate("/login");
  };

  const handleUserPage = () => {
    navigate("/user");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <Toolbar className="header">
          <Link to="/" className="logoAndTitle">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Film_reel.svg"
              style={{ height: 45 }}
              className="icon"
              alt="Noflix logo"
            />
            <h1 className="headerName">Noflix</h1>
          </Link>
          {!location.pathname.includes("login") &&
            !location.pathname.includes("user") && (
              <div className="searchHeader" style={{ maxWidth: "350px" }}>
                <TextField
                  id="outlined-basic"
                  label="Search"
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyPress}
                />
              </div>
            )}
          <div className="buttonContainer">
            {location.pathname.includes("search") && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerOpen}
                sx={{ ...(open && { display: "none" }) }}
              >
                <img src={TuningIcon} alt="Menu" className="hammiIconOpen" />
              </IconButton>
            )}
            {!location.pathname.includes("login") && (
              <div>
                {authUserState ? (
                  <ButtonGroup>
                    <IconButton
                      color="inherit"
                      aria-label="Log out"
                      edge="end"
                      onClick={handleLogout}
                      sx={{ ...(open && { display: "none" }) }}
                    >
                      <img
                        src={Logout}
                        alt="Logout"
                        className="hammiIconOpen"
                      />
                    </IconButton>
                    <IconButton
                      color="inherit"
                      aria-label="User page"
                      edge="end"
                      onClick={handleUserPage}
                      sx={{ ...(open && { display: "none" }) }}
                    >
                      <img
                        src={UserPageIcon}
                        alt="User page"
                        className="hammiIconOpen"
                      />
                    </IconButton>
                  </ButtonGroup>
                ) : (
                  <IconButton
                    color="inherit"
                    aria-label="Log in"
                    edge="end"
                    onClick={handleLogIn}
                    sx={{ ...(open && { display: "none" }) }}
                  >
                    <img src={Login} alt="Login" className="hammiIconOpen" />
                  </IconButton>
                )}
              </div>
            )}
          </div>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <img src={CloseIcon} alt="Close menu" className="hammiIconClose" />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <FilterAndSort />
        <Divider />
      </Drawer>

      {showSuccessAlert && (
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 40,
            right: 40,
            zIndex: 9999,
            border: "1px solid #000",
            borderRadius: 4,
          }}
        >
          <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>
            Logout successful!
          </Alert>
        </div>
      )}
    </Box>
  );
}
