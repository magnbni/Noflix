import { ReactElement } from "react";
import "./Results.css";
import NestedModal from "../Components/NestedModal";
import { FilmOptionType, top100Films } from "../types";
import { useParams } from "react-router-dom";

function search(searchWord: string) {
  const movies: FilmOptionType[] = [];
  top100Films.forEach((film) => {
    if (film.title.toLowerCase().includes(searchWord.toLowerCase())) {
      movies.push(film);
    }
  });
  return movies;
}

function searchByYear(searchYear: number) {
  const movies: FilmOptionType[] = [];
  top100Films.forEach((film) => {
    if (film.year === searchYear) {
      movies.push(film);
    }
  });
  return movies;
}

function sortMovies(movieHits: FilmOptionType[], type: string) {
  if (type == "asc") {
    movieHits.sort((a, b) => {
      if (a.year < b.year) {
        return 1;
      }

      if (a.year > b.year) {
        return -1;
      }

      return 0;
    });
  } else if (type == "desc") {
    movieHits.sort((a, b) => {
      if (a.year > b.year) {
        return 1;
      }

      if (a.year < b.year) {
        return -1;
      }

      return 0;
    });
  }
}

export default function Results() {
  const { id } = useParams<string>();
  let movieHits: FilmOptionType[] = [];

  if (id) {
    movieHits = search(id);
  }

  const movies: ReactElement<string, string>[] = [];
  movieHits.forEach((film) => {
    movies.push(
      <div className="card" key={`movie-${film.title}`}>
        {NestedModal(film)}
      </div>
    );
  });
  return (
    <div className="results">
      <div className="row">{movies}</div>
    </div>
  );
}
