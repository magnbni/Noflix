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

// GraphQL query to fetch movies with different parameters
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
      totalPages
    }
  }
`;

// Helper function to get the sort value based on sort option and order direction
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
  // Extracting route parameters
  const { id } = useParams<string>();

  // State variables for pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataIsEmpty, setDataIsEmpty] = useState(false);

  // Retrieving sort and filter states from Redux
  const sortOrderState = useSelector(
    (state: RootState) => state.sort.sortOrder
  );
  const sortByState = useSelector((state: RootState) => state.sort.sortBy);
  const filterYearState = useSelector(
    (state: RootState) => state.sort.filterYear
  );
  const genreState = useSelector(
    (state: RootState) => state.sort.filterByGenre
  );

  // GraphQL query to fetch movies based on search criteria
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

  // Updating state variables when data changes
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
      {/* Header and Drawer component */}
      <HeaderAndDrawer />
      {/* Conditional rendering based on whether data is empty */}
      {dataIsEmpty && (
        <h2>No movies found for "{id}". Maybe you'll like one of these?</h2>
      )}
      {!dataIsEmpty && <h2>Search results for: "{id}"</h2>}
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

      {/* Displaying fetched movie data */}
      {data && (
        <div className="row">
          {data.allMovies.edges.map((edge: MovieEdge) => (
            <div className="card" key={`movie-${edge.node.Id}`}>
              <NestedModal movie={edge.node}></NestedModal>
            </div>
          ))}
        </div>
      )}
      <br />

      {/* Rendering PreviewMovies component if data is empty */}
      {dataIsEmpty && (
        <div>
          <PreviewMovies />
        </div>
      )}

      {/* Pagination buttons */}
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
                window.scrollTo(0, 0);
              }
            }}
            aria-label="double left arrow"
          >
            <img
              src={doubleLeftArrow}
              className="loadIcon"
              alt="double left arrow"
            />
          </Button>
          <Button
            disabled={data ? !data.allMovies.pageInfo.hasPreviousPage : true}
            onClick={() => {
              if (data.allMovies.pageInfo.hasPreviousPage) {
                setPage(page - 1);
                window.scrollTo(0, 0);
              }
            }}
            aria-label="left arrow"
          >
            <img src={leftArrow} className="loadIcon" alt="left arrow" />
          </Button>
          <Button disabled className="pageCounterButton">
            {page} of {totalPages}
          </Button>
          <Button
            disabled={data ? !data.allMovies.pageInfo.hasNextPage : true}
            onClick={() => {
              if (data.allMovies.pageInfo.hasNextPage) {
                setPage(page + 1);
                window.scrollTo(0, 0);
              }
            }}
            aria-label="right arrow"
          >
            <img src={rightArrow} className="loadIcon" alt="right arrow" />
          </Button>
          <Button
            disabled={data ? !data.allMovies.pageInfo.hasNextPage : true}
            onClick={() => {
              if (data.allMovies.pageInfo.hasNextPage) {
                setPage(data.allMovies.totalPages);
                window.scrollTo(0, 0);
              }
            }}
            aria-label="double right arrow"
          >
            <img
              src={doubleRightArrow}
              className="loadIcon"
              alt="Double right arrow"
            />
          </Button>
        </ButtonGroup>
      )}
      <br />
    </div>
  );
}
