import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import ComboBox from "./ComboBox";
import { useState } from "react";
// import DeleteIcon from '@mui/icons-material/Delete';


// The default Header of our application
export default function Head() {
  const navigate = useNavigate();
  const [, setSelectedMovie] = useState<string | null>(null);
  const handleMovieSelect = (selectedOption: string | null) => {
    if (selectedOption) {
      setSelectedMovie(selectedOption);
      navigate(`/${selectedOption}`);
      window.location.reload();
    }
  };

  return (
    <div className="header">
      <div className="icon">
        <Link to="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Film_reel.svg"
            style={{ height: 45 }}
          />
        </Link>
        <h1 className="headerName"> Noflix</h1>
        {location.pathname !== "/project2" && (
        <div className="searchHeader">
          <ComboBox onMovieSelect={handleMovieSelect} />
        </div>
        )}
      </div>
      {/* <DeleteIcon/> */}
      <div className="home">
        <Link to="/">
          <img
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEgMTN2MTBoLTZ2LTZoLTZ2NmgtNnYtMTBoLTNsMTItMTIgMTIgMTJoLTN6bS0xLTUuOTA3di01LjA5M2gtM3YyLjA5M2wzIDN6Ii8+PC9zdmc+"
            alt="Back to Root"
          />
        </Link>
      </div>
    </div>
  );
}
