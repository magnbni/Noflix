// import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import ComboBox from "../Components/ComboBox";
import HeaderAndDrawer from "../Components/HeaderAndDrawer";

// const theme = createTheme({
//   direction: "rtl",
//   // other theme properties
// });

// The "Homepage" of the application is present within Root, and contains the searchbar and logo.
export default function Root() {
  const navigate = useNavigate();
  const [, setSelectedMovie] = useState<string | null>(null);

  const handleMovieSelect = (selectedOption: string | null) => {
    if (selectedOption) {
      setSelectedMovie(selectedOption);
      navigate(`/search/${selectedOption}`);
    }
  };
  return (
    // <ThemeProvider theme={theme}>
      <div>
        <div className="logoDiv">
          <img
            className="logo"
            src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Film_reel.svg"
          />
        </div>
        <h1> Search for a movie</h1>
        <ComboBox onMovieSelect={handleMovieSelect} />
        <HeaderAndDrawer />
      </div>
    // </ThemeProvider>
  );
}
