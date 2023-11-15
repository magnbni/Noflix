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
import "./HeaderAndDrawer.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

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
  const [searchValue, setSearchValue] = useState<string>("");
  const [, setSelectedMovie] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

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

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <div className="header">
            <div className="icon">
              <Link to="/" className="logoAndTitle">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Film_reel.svg"
                  style={{ height: 45 }}
                  className="icon"
                />
                <h1 className="headerName">Noflix</h1>
              </Link>
            </div>
            <div className="searchHeader">
              <TextField
                id="outlined-basic"
                label="Search"
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  maxWidth: "350px",
                }}
                onChange={handleSearchChange}
                onKeyDown={handleKeyPress}
              />
            </div>
            {location.pathname.includes("project2/search/") && (
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
        {/* <List>
          <FilterAndSort />
        </List> */}
        <Divider />
      </Drawer>
    </Box>
  );
}
