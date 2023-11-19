import "./Results.css";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import NestedModal from "../Components/NestedModal";
import HeaderAndDrawer from "../Components/HeaderAndDrawer";
import { gql, useQuery } from "@apollo/client";
import { MovieEdge } from "../types";
import { useState } from "react";
import { useParams } from "react-router-dom";
import leftArrow from "../assets/arrow-left.svg";
import rightArrow from "../assets/arrow-right.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const MOVIES_QUERY = gql`
  query allMovies(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $title: String
    $sort: String
  ) {
    allMovies(
      first: $first
      last: $last
      before: $before
      after: $after
      title: $title
      sort: $sort
    ) {
      edges {
        node {
          title
          releaseDate
          voteAverage
          posterPath
          overview
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

const getSortValue = (sortOption: string, orderDirection: string) => {
  let sortBy = "title";
  if (sortOption && sortOption !== "") {
    sortBy = sortOption.toLowerCase();
  }
  const sortOrder = orderDirection.toLowerCase();

  return `${sortBy}_${sortOrder}`;
};

/* 
  This is the Results component that displays search results in a grid like fashion.
*/
export default function Results() {
  const { id } = useParams<string>();

  const sortOrderState = useSelector(
    (state: RootState) => state.sort.sortOrder,
  );

  const sortByState = useSelector((state: RootState) => state.sort.sortBy);

  const [hasNextPage, setHasNextPage] = useState(true);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const { loading, error, data, fetchMore } = useQuery(MOVIES_QUERY, {
    variables: {
      first: 12,
      sort: getSortValue(sortByState, sortOrderState),
      title: id,
    },
  });

  const [firstItemCursor, setFirstItemCursor] = useState(null);
  const [lastItemCursor, setLastItemCursor] = useState(null);

  if (!loading && !error) {
    const newFirstItemCursor = data.allMovies.edges[0].cursor;
    const newLastItemCursor =
      data.allMovies.edges[data.allMovies.edges.length - 1].cursor;
    if (newFirstItemCursor !== firstItemCursor) {
      setFirstItemCursor(newFirstItemCursor);
    }
    if (newLastItemCursor !== lastItemCursor) {
      setLastItemCursor(newLastItemCursor);
    }
    if (data.allMovies.pageInfo.hasNextPage !== hasNextPage) {
      setHasNextPage(data.allMovies.pageInfo.hasNextPage);
    }
    if (data.allMovies.pageInfo.hasPreviousPage !== hasPreviousPage) {
      setHasPreviousPage(data.allMovies.pageInfo.hasPreviousPage);
    }
  }

  return (
    <div className="results">
      <HeaderAndDrawer />
      {(loading || error) && <p>{error ? error.message : "Loading..."}</p>}
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
          disabled={!hasPreviousPage}
          onClick={() => {
            if (hasPreviousPage) {
              fetchMore({
                variables: {
                  first: undefined,
                  last: 12,
                  before: firstItemCursor,
                  after: undefined,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev;
                  console.log(fetchMoreResult);
                  return fetchMoreResult;
                },
              });
            }
          }}
        >
          <img src={leftArrow} className="loadIcon" />
        </Button>
        <Button
          disabled={!hasNextPage}
          onClick={() => {
            if (hasNextPage) {
              fetchMore({
                variables: {
                  first: 12,
                  last: undefined,
                  before: undefined,
                  after: lastItemCursor,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev;
                  console.log(fetchMoreResult);
                  return fetchMoreResult;
                },
              });
            }
          }}
        >
          <img src={rightArrow} className="loadIcon" />
        </Button>
      </ButtonGroup>
      <br />
    </div>
  );
}
