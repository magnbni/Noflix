import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Root from "./Root";
import Results from "./Routes/Results";

function App() {
  const navigate = useNavigate();
  navigate("/prosjekt2");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/prosjekt2/lord`);
  };

  return (
    <div>
      <Routes>
        <Route path="/prosjekt2" element={<Root />} />
        <Route path="/prosjekt2/:id" element={<Results />} />
      </Routes>
    </div>
  );
}

export default App;
