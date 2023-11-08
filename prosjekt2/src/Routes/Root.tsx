import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import ComboBox from "../Components/ComboBox";
import HeaderAndDrawer from "../Components/HeaderAndDrawer";

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
    <div className="notbody">
      <div className="searchContainer">
        <h1> Search for a movie</h1>
        <ComboBox onMovieSelect={handleMovieSelect} />
      </div>
      <HeaderAndDrawer />
    </div>
  );
}
