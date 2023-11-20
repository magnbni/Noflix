import { Routes, Route } from "react-router-dom"
import Results from "./Routes/Results"
import "./index.css"
import Root from "./Routes/Root"
import LoginPage from "./Components/LoginPage"

/* 
  Currently two paths are present: The results page, showing the results of a search,
  and the Root page where you search for movies.
*/
function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Root />} />
        <Route path='/search/:id' element={<Results />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </div>
  )
}

export default App
