import { Link } from "react-router-dom";
import "../index.css";

// The default Header of our application
export default function Head() {
  return (
    <div className="header">
      <div className="icon">
        <Link to="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Film_reel.svg"
            style={{ height: 45 }}
          />
        </Link>
        <h1 className="headerName"> Noflix</h1>
      </div>
      <div className="home">
        <Link to="/">
          <img
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjEgMTN2MTBoLTZ2LTZoLTZ2NmgtNnYtMTBoLTNsMTItMTIgMTIgMTJoLTN6bS0xLTUuOTA3di01LjA5M2gtM3YyLjA5M2wzIDN6Ii8+PC9zdmc+"
            alt="Back to Root"
          />
        </Link>
      </div>
    </div>
  );
}
