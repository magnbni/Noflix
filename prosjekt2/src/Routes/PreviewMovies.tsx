import { gql, useQuery } from "@apollo/client";
import NestedModal from "../Components/NestedModal";
import { MovieEdge, MovieType } from "../types";
import "./PreviewMovies.css";

interface category {
  title: string;
  movies: MovieType[];
}

const MOVIES_QUERY = gql`
  query allMovies(
    $perPage: Int
    $title: String
    $sort: String
    $startYear: Int
    $endYear: Int
    $genre: String
  ) {
    allMovies(
      perPage: $perPage
      title: $title
      sort: $sort
      startYear: $startYear
      endYear: $endYear
      genre: $genre
    ) {
      edges {
        node {
          title
          releaseDate
          voteAverage
          posterPath
          overview
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export default function PreviewMovies() {
  const sortbyTitle = "title_desc";
  const sortbyDate = "release_date_desc";

  const {
    loading: loading_christ,
    error: error_christ,
    data: data_christ,
  } = useQuery(MOVIES_QUERY, {
    variables: {
      per_page: 20,
      sort: sortbyTitle,
      title: "christmas",
    },
  });

  const {
    loading: loadHorror,
    error: errorHorror,
    data: dataHorror,
  } = useQuery(MOVIES_QUERY, {
    variables: {
      per_page: 20,
      genre: "Horror",
    },
  });

  const {
    loading: loadAction,
    error: errorAction,
    data: dataAction,
  } = useQuery(MOVIES_QUERY, {
    variables: {
      per_page: 20,
      genre: "Action",
    },
  });

  const {
    loading: loadRomance,
    error: errorRomance,
    data: dataRomance,
  } = useQuery(MOVIES_QUERY, {
    variables: {
      per_page: 20,
      genre: "Romance",
    },
  });

  const {
    loading: loadNewest,
    error: errorNewest,
    data: dataNewest,
  } = useQuery(MOVIES_QUERY, {
    variables: {
      per_page: 20,
      sort: sortbyDate,
    },
  });

  if (loadHorror || loading_christ || loadAction || loadRomance || loadNewest)
    return "Loading...";
  if (errorHorror) return `Error! ${errorHorror.message}`;
  if (error_christ) return `Error! ${error_christ.message}`;
  if (errorAction) return `Error! ${errorAction.message}`;
  if (errorNewest) return `Error! ${errorNewest.message}`;
  if (errorRomance) return `Error! ${errorRomance.message}`;

  const categories: category[] = [
    {
      title: "Horror movies",
      movies: dataHorror.allMovies.edges.map((edge: MovieEdge) => edge.node),
    },
    {
      title: "Christmas movies",
      movies: data_christ.allMovies.edges.map((edge: MovieEdge) => edge.node),
    },
    {
      title: "Newest movies",
      movies: dataNewest.allMovies.edges.map((edge: MovieEdge) => edge.node),
    },
    {
      title: "Romance movies",
      movies: dataRomance.allMovies.edges.map((edge: MovieEdge) => edge.node),
    },
    {
      title: "Action movies",
      movies: dataAction.allMovies.edges.map((edge: MovieEdge) => edge.node),
    },
  ];
  console.log(categories[0].movies);

  return (
    <div className="previewMovies">
      {categories.map((category) => (
        <div className="container" key={category.title}>
          <h3 className="movies-container-header">{category.title}</h3>
          <div className="movies-container">
            <div className="scrollable-container">
              {category.movies.map((movie, index) => (
                <div className="card" key={`movie-${movie.title || index}`}>
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
