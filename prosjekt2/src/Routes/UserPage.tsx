import HeaderAndDrawer from "../Components/HeaderAndDrawer";
import { gql, useQuery } from "@apollo/client";
import NestedModal from "../Components/NestedModal";
import { MovieEdge } from "../types";
import { ButtonGroup, Button } from "@mui/material";
import { useEffect, useState } from "react";
import leftArrow from "../assets/arrow-left.svg";
import rightArrow from "../assets/arrow-right.svg";
import doubleLeftArrow from "../assets/double-arrow-left.svg";
import doubleRightArrow from "../assets/double-arrow-right.svg";

const RATED_MOVIES_QUERY = gql`
  query allUsers($email: String) {
    allUsers(email: $email) {
      edges {
        node {
          ratedMovies {
            title
            releaseDate
            posterPath
            overview
          }
        }
      }
    }
  }
`;

export default function UserPage() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { loading, error, data } = useQuery(RATED_MOVIES_QUERY, {
    variables: {
      email: "hei",
    },
  });
  console.log("user", data);

  useEffect(() => {
    if (data) {
      setTotalPages(data.allMovies.totalPages);
    }
  }, [data]);

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
      {data && (
        <div className="row">
          {data.allMovies.edges.map((edge: MovieEdge) => (
            <div className="card" key={`movie-${edge.node.title}`}>
              <NestedModal movie={edge.node}></NestedModal>
            </div>
          ))}
        </div>
      )}
      <br />
      <ButtonGroup
        variant="contained"
        aria-label="Elevation buttons"
        className="buttonGroup"
      >
        <Button
          disabled={data ? !data.allMovies.pageInfo.hasPreviousPage : true}
          onClick={() => {
            if (data.allMovies.pageInfo.hasPreviousPage) {
              setPage(1);
            }
          }}
        >
          <img src={doubleLeftArrow} className="loadIcon" />
        </Button>
        <Button
          disabled={data ? !data.allMovies.pageInfo.hasPreviousPage : true}
          onClick={() => {
            if (data.allMovies.pageInfo.hasPreviousPage) {
              setPage(page - 1);
            }
          }}
        >
          <img src={leftArrow} className="loadIcon" />
        </Button>
        <Button disabled className="pageCounterButton">
          {page} of {totalPages}
        </Button>
        <Button
          disabled={data ? !data.allMovies.pageInfo.hasNextPage : true}
          onClick={() => {
            if (data.allMovies.pageInfo.hasNextPage) {
              setPage(page + 1);
            }
          }}
        >
          <img src={rightArrow} className="loadIcon" />
        </Button>
        <Button
          disabled={data ? !data.allMovies.pageInfo.hasNextPage : true}
          onClick={() => {
            if (data.allMovies.pageInfo.hasNextPage) {
              setPage(data.allMovies.totalPages);
            }
          }}
        >
          <img src={doubleRightArrow} className="loadIcon" />
        </Button>
      </ButtonGroup>
      <br />
    </div>
  );
}
