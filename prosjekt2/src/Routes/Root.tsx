import "../index.css";
import HeaderAndDrawer from "../Components/HeaderAndDrawer";
import PreviewMovies from "./PreviewMovies";

export default function Root() {
  return (
    <div className="notbody">
      <HeaderAndDrawer />
      <PreviewMovies />
    </div>
  );
}
