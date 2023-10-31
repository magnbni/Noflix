import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import ComboBox from "../Components/ComboBox";
import PreviewMovies from "./PreviewMovies";

// The "Homepage" of the application is present within Root, and contains the searchbar and logo.
export default function Root() {
  const navigate = useNavigate();
  const [, setSelectedMovie] = useState<string | null>(null);

  const handleMovieSelect = (selectedOption: string | null) => {
    if (selectedOption) {
      setSelectedMovie(selectedOption);
      navigate(`/${selectedOption}`);
    }
  };
  return (
    <div className="notbody">
      <div className="searchContainer">
        <div className="logoDiv">
          <img
            className="logo"
            src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Film_reel.svg"
          />
        </div>
        <h1> Search for a movie</h1>
        <ComboBox onMovieSelect={handleMovieSelect} />
      </div>
      {PreviewMovies()}
    </div>
  );
}
