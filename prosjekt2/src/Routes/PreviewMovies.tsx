import NestedModal from "../Components/NestedModal";
import { FilmOptionType, top100Films } from "../types";
import "./PreviewMovies.css";

interface category {
  title: string;
  movies: FilmOptionType[];
}

export default function PreviewMovies() {
  const aMovie = top100Films.filter((film) =>
    film.title.toLowerCase().startsWith("a".toLowerCase()),
  );
  const movieBefore1950 = top100Films.filter((film) => {
    return film.year < 1950;
  });

  const categories: category[] = [
    { title: "Movies starting with A", movies: aMovie },
    { title: "Movies before 1980", movies: movieBefore1950 },
  ];

  return (
    <div className="previewMovies">
      {categories.map((category) => (
        <div className="container">
          <h3 className="movies-container-header">{category.title}</h3>
          <div className="movies-container">
            <div className="scrollable-container">
              {category.movies.map((movie) => (
                <div className="card" key={`movie-${movie.title}`}>
                  {NestedModal(movie)}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
