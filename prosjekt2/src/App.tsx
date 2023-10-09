import { Routes, Route } from "react-router-dom";
import Root from "./Root";
import Results from "./Routes/Results";

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
