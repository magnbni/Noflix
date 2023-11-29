import HeaderAndDrawer from "../Components/HeaderAndDrawer";
import { gql, useQuery } from "@apollo/client";
import NestedModal from "../Components/NestedModal";
import { MovieType } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect } from "react";

// GraphQL query to fetch rated movies for a user
const RATED_MOVIES_QUERY = gql`
  query allUsers($email: String) {
    allUsers(email: $email) {
      edges {
        node {
          ratedMovies {
            Id
            title
            releaseDate
            posterPath
            overview
            voteAverage
          }
        }
      }
    }
  }
`;

// UserPage component
export default function UserPage() {
  // Retrieving user authentication state and email from Redux
  const authUserState = useSelector((state: RootState) => state.user.authUser);
  const email = useSelector((state: RootState) => state.user.email);

  // Fetching rated movies data using GraphQL query
  const { loading, error, data, refetch } = useQuery(RATED_MOVIES_QUERY, {
    variables: {
      email: email,
    },
  });

  // Refetching data when email changes
  useEffect(() => {
    refetch({ email });
  }, [email, refetch]);

  // Conditional rendering based on authentication and data availability
  if (!authUserState && email === "") {
    return (
      <div className="results">
        <HeaderAndDrawer />
        <h2>Please log in to see your rated movies</h2>
      </div>
    );
  }

  // If user is authenticated, display rated movies
  return (
    <div className="results">
      <HeaderAndDrawer />
      <h2>Your rated movies:</h2>
      {/* Loading state: rendering placeholders */}
      {loading && (
        <div className="row">
          {[...Array(12)].map((_, i) => (
            <div className="card" key={`movie-${i}`}>
              <NestedModal movie={undefined}></NestedModal>
            </div>
          ))}
        </div>
      )}

      {/* Error handling */}
      {error && error.message}

      {/* Displaying rated movies if available */}
      {data && data.allUsers.edges[0].node.ratedMovies.length > 0 && (
        <div className="row">
          {data.allUsers.edges[0].node.ratedMovies.map((movie: MovieType) => (
            <div className="card" key={`movie-${movie.Id}`}>
              <NestedModal movie={movie}></NestedModal>
            </div>
          ))}
        </div>
      )}

      {/* Message for the user if no rated movies are found */}
      {data && data.allUsers.edges[0].node.ratedMovies.length == 0 && (
        <h3>You haven't rated any movies yet :(</h3>
      )}
    </div>
  );
}
