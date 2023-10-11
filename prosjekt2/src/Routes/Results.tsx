import { ReactElement } from "react";
import "./Results.css";
import NestedModal from "../Components/NestedModal";
import { FilmOptionType, top100Films } from "../types";
import { useParams } from "react-router-dom";
import Head from "../Components/Header";
import Switch from "../Components/Switch";

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

// This may be used in future implementations, and is therefore left as is.

// function searchByYear(searchYear: number) {
//   const movies: FilmOptionType[] = [];
//   top100Films.forEach((film) => {
//     if (film.year === searchYear) {
//       movies.push(film);
//     }
//   });
//   return movies;
// }

// function sortMovies(movies: FilmOptionType[], type: "asc" | "desc") {
//   return movies.slice().sort((a, b) => {
//     if (type === "asc") {
//       return a.year - b.year;
//     } else {
//       return b.year - a.year;
//     }
//   });
// }

/* 
  This is the Results component that displays search results in a grid like fashion.
*/
export default function Results() {
  // Fetch the query from the parameters
  const { id } = useParams<string>();
  let movieHits: FilmOptionType[] = [];
  // Search database for the given query
  if (id) {
    movieHits = search(id);
  }
  if (movieHits.length === 0) {
    return (
      <div>
        <Head></Head>
        <h1>Oh no! :(</h1>
        <h2>No results found for {id}</h2>
      </div>
    );
  }

  // The list of movie-elements.
  const movies: ReactElement<string, string>[] = [];

  // Each movie has its own NestedModal component
  movieHits.forEach((film) => {
    movies.push(
      <div className="card" key={`movie-${film.title}`}>
        {NestedModal(film)}
      </div>,
    );
  });
  return (
    <div className="results">
      <Head></Head>
      {
        // Currently functional, will be implemented in future iterations.
        Switch()
      }
      <div className="row">{movies}</div>
    </div>
  );
}
