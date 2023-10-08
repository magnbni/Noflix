import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import ComboBox from "./Components/ComboBox";

function App() {

  return (
    <div>
      <h1> Search for a movie</h1>
      <ComboBox />
    </div>
  );
}

export default App;
