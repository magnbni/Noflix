import { Routes, Route } from "react-router-dom";
import Results from "./Routes/Results";
import "./index.css";
import Root from "./Routes/Root";

function App() {
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
