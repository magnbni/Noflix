import "./Results.css";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import NestedModal from "../Components/NestedModal";
import HeaderAndDrawer from "../Components/HeaderAndDrawer";
import { gql, useQuery } from "@apollo/client";
import { MovieEdge } from "../types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import leftArrow from "../assets/arrow-left.svg";
import rightArrow from "../assets/arrow-right.svg";
import doubleLeftArrow from "../assets/double-arrow-left.svg";
import doubleRightArrow from "../assets/double-arrow-right.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const MOVIES_QUERY = gql`
  query allMovies(
    $page: Int
    $perPage: Int
    $title: String
    $sort: String
    $startYear: Int
    $endYear: Int
    $genre: String
  ) {
    allMovies(
      page: $page
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
      totalPages
    }
  }
`;

const getSortValue = (sortOption: string, orderDirection: string) => {
  const sortBy = sortOption.toLowerCase();
  const sortOrder = orderDirection.toLowerCase();
  if (!["title", "release_date", "rating"].includes(sortBy)) {
    return "";
  }
  if (!["asc", "desc"].includes(sortOrder)) {
    return "";
  }
  return `${sortBy}_${sortOrder}`;
};

/* 
  This is the Results component that displays search results in a grid like fashion.
*/
export default function Results() {
  const { id } = useParams<string>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const sortOrderState = useSelector(
    (state: RootState) => state.sort.sortOrder,
  );

  const sortByState = useSelector((state: RootState) => state.sort.sortBy);

  const filterYearState = useSelector(
    (state: RootState) => state.sort.filterYear,
  );

  const genreState = useSelector(
    (state: RootState) => state.sort.filterByGenre,
  );

  const { loading, error, data } = useQuery(MOVIES_QUERY, {
    variables: {
      page: page,
      per_page: 12,
      sort: getSortValue(sortByState, sortOrderState),
      title: id,
      startYear: filterYearState[0],
      endYear: filterYearState[1],
      genre: genreState,
    },
  });

  useEffect(() => {
    if (data) {
      setTotalPages(data.allMovies.totalPages);
    }
  });

  return (
    <div className="results">
      <HeaderAndDrawer />
      <h2>Search results for: "{id}"</h2>
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
        <Button disabled style={{ color: "#000000" }}>
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
