import { Routes, Route } from "react-router-dom";
import Results from "./Routes/Results";
import "./index.css";
import Root from "./Routes/Root";

/* 
  Currently two paths are present: The results page, showing the results of a search,
  and the Root page where you search for movies.
*/
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/search/*" element={<Results />} />
      </Routes>
    </div>
  );
}

export default App;
