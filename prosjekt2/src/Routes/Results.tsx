import "./Results.css";
import NestedModal from "../Components/NestedModal";
import { FilmOptionType, top100Films } from "../types";
import { useParams } from "react-router-dom";
import Head from "../Components/Header";
import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import React from "react";

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

// function filterByYear(searchYear: number) {
//   const movies: FilmOptionType[] = [];
//   top100Films.forEach((film) => {
//     if (film.year === searchYear) {
//       movies.push(film);
//     }
//   });
//   return movies;
// }

function sortMovies(movies: FilmOptionType[], type: "asc" | "desc") {
  return movies.slice().sort((a, b) => {
    if (type === "asc") {
      return a.year - b.year;
    } else {
      return b.year - a.year;
    }
  });
}

/* 
  This is the Results component that displays search results in a grid like fashion.
*/
export default function Results() {
  const { id } = useParams<string>();
  const [sort, setSort] = React.useState(false);
  const [movies, setMovies] = React.useState(search(id ? id : ""));

  const updateSort = () => {
    setSort(!sort);
    setMovies(sortMovies(movies, sort ? "asc" : "desc"));
  };

  if (movies.length === 0) {
    return (
      <div>
        <Head></Head>
        <h1>Oh no! :(</h1>
        <h2>No results found for {id}</h2>
      </div>
    );
  }

  // The list of movie-elements.

  // Each movie has its own NestedModal component

  return (
    <div className="results">
      <Head></Head>
      <FormGroup>
        <FormControlLabel
          control={<Switch defaultChecked onChange={updateSort} />}
          label="Sort by year"
        />
      </FormGroup>
      <div className="row">
        {movies.map((movie) => (
          <div className="card" key={`movie-${movie.title}`}>
            {NestedModal(movie)}
          </div>
        ))}
      </div>
    </div>
  );
}
