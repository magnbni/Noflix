import HeaderAndDrawer from "../Components/HeaderAndDrawer";
import { gql, useQuery } from "@apollo/client";
import NestedModal from "../Components/NestedModal";
import { MovieType } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect } from "react";

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

export default function UserPage() {
  const authUserState = useSelector((state: RootState) => state.user.authUser);
  const email = useSelector((state: RootState) => state.user.email);

  const { loading, error, data, refetch } = useQuery(RATED_MOVIES_QUERY, {
    variables: {
      email: email,
    },
  });

  useEffect(() => {
    refetch({ email });
  }, [email, refetch]);

  if (!authUserState && email === "") {
    return (
      <div className="results">
        <HeaderAndDrawer />
        <h2>Please log in to see your rated movies</h2>
      </div>
    );
  }

  return (
    <div className="results">
      <HeaderAndDrawer />
      <h2>Your rated movies:</h2>
      {
        // if loading, map an array of length 12 of undefined to the NestedModal component
        loading && (
          <div className="row">
            {[...Array(12)].map((_, i) => (
              <div className="card" key={`movie-${i}`}>
                <NestedModal movie={undefined}></NestedModal>
              </div>
            ))}
          </div>
        )
      }
      {error && error.message}
      {data && data.allUsers.edges[0].node.ratedMovies.length > 0 && (
        <div className="row">
          {data.allUsers.edges[0].node.ratedMovies.map((movie: MovieType) => (
            <div
              className="card"
              key={`movie-${movie.title}-${movie.releaseDate}`}
            >
              <NestedModal movie={movie}></NestedModal>
            </div>
          ))}
        </div>
      )}
      {data && data.allUsers.edges[0].node.ratedMovies.length == 0 && (
        <h3>You haven't rated any movies yet :(</h3>
      )}
    </div>
  );
}
