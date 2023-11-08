import "./Results.css";
import NestedModal from "../Components/NestedModal";
import HeaderAndDrawer from "../Components/HeaderAndDrawer";
import { gql, useQuery } from '@apollo/client';

const GET_MOVIES = gql`
  query {allMovies(first: 10) {
    edges {
      node {
        title
        releaseDate
        overview
        voteAverage
        posterPath
      }
    }
  }}
`;

/* 
  This is the Results component that displays search results in a grid like fashion.
*/
export default function Results() {
  // const { id } = useParams<string>();

  const { loading, error, data } = useQuery(GET_MOVIES);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div className="results">
      <HeaderAndDrawer />
      <div className="row">
        {data.allMovies.edges.map((movie: any) => (
            <div className="card" key={`movie-${movie.node.title}`}>
              <NestedModal movie={movie.node}></NestedModal>
            </div>
          ))}
      </div>
    </div>
  );
}
