import "./Results.css";
import NestedModal from "../Components/NestedModal";
import { FilmOptionType, top100Films } from "../types";
import { useParams } from "react-router-dom";
import { useState } from "react";
import HeaderAndDrawer from "../Components/HeaderAndDrawer";

// The main search function. Uses iteration to find the movies, will probably be implemented differently on the backend.
function search(searchWord: string) {
  const movies: FilmOptionType[] = [];
  top100Films.forEach((film) => {
    if (film.title.toLowerCase().includes(searchWord.toLowerCase())) {
      movies.push(film);
    }
  });
  return movies;
}

/* 
  This is the Results component that displays search results in a grid like fashion.
*/
export default function Results() {
  const { id } = useParams<string>();

  const [movies] = useState(search(id ? id : ""));
 

  return (
    <div>
      <HeaderAndDrawer />
      {movies.length == 0 || movies.length == 0 ? (
        <div>
          <h1>Oh no! :(</h1>
          <h2>No results found</h2>
        </div>
      ) : (
        <div className="results">
          {movies.map((movie) => (
            <div className="card" key={`movie-${movie.title}`}>
              <NestedModal movie={movie}></NestedModal>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
