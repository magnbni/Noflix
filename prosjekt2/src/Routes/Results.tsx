import "./Results.css";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import NestedModal from "../Components/NestedModal";
import HeaderAndDrawer from "../Components/HeaderAndDrawer";
import { gql, useQuery } from "@apollo/client";
import { MovieEdge } from "../types";
import { useState, useEffect } from "react";
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
    $startYear: Int
    $endYear: Int
  ) {
    allMovies(
      first: $first
      last: $last
      before: $before
      after: $after
      title: $title
      sort: $sort
      startYear: $startYear
      endYear: $endYear
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

  const filterYearState = useSelector(
    (state: RootState) => state.sort.filterYear,
  );

  const { loading, error, data, fetchMore, refetch } = useQuery(MOVIES_QUERY, {
    variables: {
      first: 12,
      sort: getSortValue(sortByState, sortOrderState),
      title: id,
      startYear: filterYearState[0],
      endYear: filterYearState[1],
    },

  });

  // useEffect(() => {
  //   refetch({
  //     first: 12,
  //     sort: getSortValue(sortByState, sortOrderState),
  //     title: id,
  //     startYear: filterYearState[0],
  //     endYear: filterYearState[1],
  //   });
  // }),
  // [id, refetch];

  if (!loading && !error) {
    console.log("prev: " + data.allMovies.pageInfo.hasPreviousPage);
    console.log("next: " + data.allMovies.pageInfo.hasNextPage);
  }

  return (
    <div className="results">
      <HeaderAndDrawer />
      <h2>Search results for: "{id?.toUpperCase()}"</h2>
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
          disabled={data ? !data.allMovies.pageInfo.hasPreviousPage: true}
          onClick={() => {
            if (data.allMovies.pageInfo.hasPreviousPage) {
              fetchMore({
                variables: {
                  first: undefined,
                  last: 12,
                  before: data.allMovies.edges[0].cursor,
                  after: undefined,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev;
                  return fetchMoreResult;
                },
              });
            }
          }}
        >
          <img src={leftArrow} className="loadIcon" />
        </Button>
        <Button
          disabled={data ? !data.allMovies.pageInfo.hasNextPage : true}
          onClick={() => {
            if (data.allMovies.pageInfo.hasNextPage) {
              fetchMore({
                variables: {
                  first: 12,
                  last: undefined,
                  before: undefined,
                  after: data.allMovies.edges[11].cursor,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev;
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
