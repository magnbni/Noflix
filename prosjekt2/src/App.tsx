import "./App.css";
import { Routes, Route, useNavigate} from "react-router-dom";
import Root from "./Root";
import Results from "./Routes/Results";

function App() {
  const navigate = useNavigate();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('');
  };


  return (
    <div>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/:id" element={<Results />} />
      </Routes>
    </div>
  );
}

export default App;
