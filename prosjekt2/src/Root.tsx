import { useState } from "react";
import ComboBox from "./Components/ComboBox";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h1> Search for a movie</h1>
      <ComboBox onMovieSelect={handleMovieSelect} />
    </div>
  );
}
