import "./Results.css";
import NestedModal from "../Components/NestedModal";
import HeaderAndDrawer from "../Components/HeaderAndDrawer";
import { gql, useQuery } from "@apollo/client";
import { FilmOptionType } from "../types";

const GET_MOVIES = gql`
  query {
    allMovies(first: 100) {
      title
      releaseDate
      overview
      voteAverage
      posterPath
    }
  }
`;

/* 
  This is the Results component that displays search results in a grid like fashion.
*/
export default function Results() {
  // const { id } = useParams<string>();

  const { loading, error, data } = useQuery(GET_MOVIES);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  console.log(data);

  return (
    <div className="results">
      <HeaderAndDrawer />
      <div className="row">
        {data.allMovies.map((movie: FilmOptionType) => (
          <div className="card" key={`movie-${movie.title}`}>
            <NestedModal movie={movie}></NestedModal>
          </div>
        ))}
      </div>
    </div>
  );
}
