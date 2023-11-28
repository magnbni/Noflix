import "../index.css";
import HeaderAndDrawer from "../Components/HeaderAndDrawer";
import PreviewMovies from "./PreviewMovies";

// Root component, serving as the main entry point for the application
export default function Root() {
  return (
    <div className="notbody">
      {/* Including the HeaderAndDrawer component at the top of the page */}
      <HeaderAndDrawer />

      {/* Including the PreviewMovies component for displaying preview movies */}
      <PreviewMovies />
    </div>
  );
}
