import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
// import ComboBox from "../Components/ComboBox";
import HeaderAndDrawer from "../Components/HeaderAndDrawer";
import { TextField } from "@mui/material";
// import PreviewMovies from "./PreviewMovies";

export default function Root() {
  const navigate = useNavigate();
  const [, setSelectedMovie] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

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
    console.log(event.key);
    if (event.key === "Enter") {
      handleSearch(searchValue);
    }
  };

  return (
    <div className="notbody">
      <HeaderAndDrawer />


      <div className="searchContainer">
        <h1> Search for a movie</h1>
        <div>
          <TextField onChange={handleSearchChange} onKeyDown={handleKeyPress} />
          <button
            onClick={() => {
              handleSearch(searchValue);
            }}
          >
            Search
          </button>
        </div>
      </div>
      {/* {PreviewMovies()} */}
    </div>
  );
}
