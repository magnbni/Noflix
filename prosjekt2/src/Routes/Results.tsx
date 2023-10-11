import { ReactElement } from "react";
import "./Results.css";
import NestedModal from "../Components/NestedModal";
import { FilmOptionType, top100Films } from "../types";
import { useParams } from "react-router-dom";
import Header from "../Components/Header";

function search(searchWord: string) {
  const movies: FilmOptionType[] = [];
  top100Films.forEach((film) => {
    if (film.title.toLowerCase().includes(searchWord.toLowerCase())) {
      movies.push(film);
    }
  });
  return movies;
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
      <Header />
      <div className="row">{movies}</div>
    </div>
  );
}
