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

  const cardsPerRow = 3;

  const numRows = Math.ceil(movieHits.length / cardsPerRow);

  const rows: ReactElement<string, string>[] = [];

  for (let i = 0; i < numRows; i++) {
    const startIndex = i * cardsPerRow;
    const endIndex = startIndex + cardsPerRow;
    const rowCards = movies.slice(startIndex, endIndex);
    while (rowCards.length < cardsPerRow) {
      rowCards.push(
        <div className="card" key={`empty-${rowCards.length}`}></div>
      );
    }

    rows.push(
      <div className="row" key={`row-${i}`}>
        {rowCards}
      </div>
    );
  }
  return <div className="comp">{rows}</div>;
}
