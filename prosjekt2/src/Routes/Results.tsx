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
import PreviewMovies from "./PreviewMovies";

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
  const [dataIsEmpty, setDataIsEmpty] = useState(false);

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
      if (data.allMovies.edges.length === 0) {
        setDataIsEmpty(true);
      } else {
        setDataIsEmpty(false);
      }
    }
  }, [data]);

  return (
    <div className="results">
      <HeaderAndDrawer />
      {dataIsEmpty && (
        <h2>No movies found for "{id}". Maybe you'll like one of these?</h2>
      )}
      {!dataIsEmpty && <h2>Search results for: "{id}"</h2>}
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
      {dataIsEmpty && (
        <div>
          <PreviewMovies />
        </div>
      )}
      {!dataIsEmpty && (
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
              window.scrollTo(0, 0)
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
              window.scrollTo(0, 0)
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
              window.scrollTo(0, 0)
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
              window.scrollTo(0, 0)
              }
            }}
          >
            <img src={doubleRightArrow} className="loadIcon" />
          </Button>
        </ButtonGroup>
      )}
      <br />
    </div>
  );
}
