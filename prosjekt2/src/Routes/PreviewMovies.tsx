import { ApolloError, gql, useQuery } from "@apollo/client";
import NestedModal from "../Components/NestedModal";
import { MovieType } from "../types";
import "./PreviewMovies.css";

interface category {
  title: string;
  movies: MovieType[];
  loading: boolean;
  error: ApolloError | undefined;
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

const GET_MOVIES_CHRISTMAS = gql`
  query {
    allMovies(sort: RELEASE_DATE_DESC, first: 10, title: "Christmas") {
      title
      releaseDate
      overview
      voteAverage
      posterPath
    }
  }
`;

export default function PreviewMovies() {
  const {
    loading: loading_a,
    error: error_a,
    data: data_a,
  } = useQuery(GET_MOVIES_A);
  const {
    loading: loading_christ,
    error: error_christ,
    data: data_christ,
  } = useQuery(GET_MOVIES_CHRISTMAS);

  if (loading_a || loading_christ) return "Loading...";
  if (error_a) return `Error! ${error_a.message}`;
  if (error_christ) return `Error! ${error_christ.message}`;

  const categories: category[] = [
    {
      title: "Movies containing A in their title",
      movies: data_a.allMovies,
      loading: loading_a,
      error: error_a,
    },
    {
      title: "Christmas movies",
      movies: data_christ.allMovies,
      loading: loading_christ,
      error: error_christ,
    },
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
