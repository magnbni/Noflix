import { gql, useQuery } from "@apollo/client";
import NestedModal from "../Components/NestedModal";
import { MovieEdge, MovieType } from "../types";
import "./PreviewMovies.css";
import { ActionAreaCardProps } from "../Components/ActionAreaCard";

// Interface defining the structure of a category
interface category {
  title: string;
  movies: MovieType[];
}

// GraphQL query to fetch movies with different parameters
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
          Id
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

// Main component for previewing movies
export default function PreviewMovies() {
  // Sorting options
  const sortbyTitle = "title_desc";
  const sortbyDate = "release_date_desc";

  // Fetching movies for different categories using GraphQL queries
  const { error: error_christ, data: data_christ } = useQuery(MOVIES_QUERY, {
    variables: {
      per_page: 20,
      sort: sortbyTitle,
      title: "christmas",
    },
  });

  const { error: errorHorror, data: dataHorror } = useQuery(MOVIES_QUERY, {
    variables: {
      per_page: 20,
      genre: "Horror",
    },
  });

  const { error: errorAction, data: dataAction } = useQuery(MOVIES_QUERY, {
    variables: {
      per_page: 20,
      genre: "Action",
    },
  });

  const { error: errorRomance, data: dataRomance } = useQuery(MOVIES_QUERY, {
    variables: {
      per_page: 20,
      genre: "Romance",
    },
  });

  const { error: errorNewest, data: dataNewest } = useQuery(MOVIES_QUERY, {
    variables: {
      per_page: 20,
      sort: sortbyDate,
    },
  });

  // Handling errors for each category
  if (errorHorror) return `Error! ${errorHorror.message}`;
  if (error_christ) return `Error! ${error_christ.message}`;
  if (errorAction) return `Error! ${errorAction.message}`;
  if (errorNewest) return `Error! ${errorNewest.message}`;
  if (errorRomance) return `Error! ${errorRomance.message}`;

  // Function to create an array of undefined values
  const createArrayOfUndefined = (length: number) => {
    const array: ActionAreaCardProps[] = [];
    for (let i = 0; i < length; i++) {
      array.push({ movie: undefined });
    }
    return array;
  };

  // Categories array containing titles and corresponding movies
  const categories: category[] = [
    {
      title: "Horror movies",
      movies: dataHorror
        ? dataHorror.allMovies.edges.map((edge: MovieEdge) => edge.node)
        : createArrayOfUndefined(20),
    },
    {
      title: "Christmas movies",
      movies: data_christ
        ? data_christ.allMovies.edges.map((edge: MovieEdge) => edge.node)
        : createArrayOfUndefined(20),
    },
    {
      title: "Newest movies",
      movies: dataNewest
        ? dataNewest.allMovies.edges.map((edge: MovieEdge) => edge.node)
        : createArrayOfUndefined(20),
    },
    {
      title: "Romance movies",
      movies: dataRomance
        ? dataRomance.allMovies.edges.map((edge: MovieEdge) => edge.node)
        : createArrayOfUndefined(20),
    },
    {
      title: "Action movies",
      movies: dataAction
        ? dataAction.allMovies.edges.map((edge: MovieEdge) => edge.node)
        : createArrayOfUndefined(20),
    },
  ];

  // Rendering each category with its movies
  return (
    <div className="previewMovies">
      {categories.map((category) => (
        <div className="container" key={category.title}>
          <h2 className="movies-container-header">{category.title}</h2>
          <div className="movies-container">
            <div className="scrollable-container">
              {category.movies.map((movie, index) => (
                <div
                  className="card"
                  key={`movie-${movie.Id ? movie.Id : index}`}
                >
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
