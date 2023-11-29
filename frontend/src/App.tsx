import { Routes, Route } from "react-router-dom";
import Results from "./Routes/Results";
import "./index.css";
import Root from "./Routes/Root";
import LoginPage from "./Components/LoginPage";
import UserPage from "./Routes/UserPage";

/* 
  Currently four paths are present: 
  1. the Root page where a preview of movies is shown,
  2. the login page where you can log in,
  3. the results page, showing the results of a search,
  4. the user page where you can see your rated movies.
*/
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/search/:id" element={<Results />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user/" element={<UserPage />} />
      </Routes>
    </div>
  );
}

export default App;
