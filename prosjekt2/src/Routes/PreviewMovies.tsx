import { gql, useQuery } from "@apollo/client";
import NestedModal from "../Components/NestedModal";
import { FilmOptionType } from "../types";
import "./PreviewMovies.css";

interface category {
  title: string;
  movies: FilmOptionType[];
}

const GET_MOVIES_A = gql`
  query {
    allMovies(sort: RELEASE_DATE_DESC, first: 10, title: "A") {
      title
      releaseDate
      overview
      voteAverage
      posterPath
    }
  }
`;
export default function PreviewMovies() {
  const { loading, error, data } = useQuery(GET_MOVIES_A);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  console.log(data);

  const categories: category[] = [
    { title: "Movies containing A in their title", movies: data.allMovies },
  ];

  return (
    <div className="previewMovies">
      {categories.map((category) => (
        <div className="container" key={category.title}>
          <h3 className="movies-container-header">{category.title}</h3>
          <div className="movies-container">
            <div className="scrollable-container">
              {category.movies.map((movie) => (
                <div className="card" key={`movie-${movie.title}`}>
                  <NestedModal movie={movie} /> 
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}