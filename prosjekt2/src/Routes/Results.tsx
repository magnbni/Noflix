import "./Results.css";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import NestedModal from "../Components/NestedModal";
import HeaderAndDrawer from "../Components/HeaderAndDrawer";
import { gql, useQuery } from "@apollo/client";
import { MovieEdge, MovieType } from "../types";
import { useState } from "react";
import { useParams } from "react-router-dom";
import leftArrow from "../assets/arrow-left.svg";
import rightArrow from "../assets/arrow-right.svg";
import doubleLeftArrow from "../assets/double-arrow-left.svg";
import doubleRightArrow from "../assets/double-arrow-right.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const getQuery = (sortOption: string, orderDirection: string, id?: string) => {
  let sortValue = "";
  if (sortOption === "title" && orderDirection === "asc") {
    sortValue = "TITLE_ASC";
  } else if (sortOption === "title" && orderDirection === "desc") {
    sortValue = "TITLE_DESC";
  } else if (sortOption === "releaseYear" && orderDirection === "asc") {
    sortValue = "RELEASE_DATE_ASC";
  } else if (sortOption === "releaseYear" && orderDirection === "desc") {
    sortValue = "RELEASE_DATE_DESC";
  } else {
    return gql`
    query {
      allMovies(first: 12, title: "${id}") {
        edges { 
        	node {
            title
            releaseDate
            genres {name}
            overview
            voteAverage
            posterPath
          }
        }
      }
    }
  `;
  }

  return gql`
    query {
      allMovies(first: 12, sort: ${sortValue}, title: "${id}") {
        edges { 
        	node {
            title
            releaseDate
            genres {name}
            overview
            voteAverage
            posterPath
          }
        }
      }
    }
  `;
};

/* 
  This is the Results component that displays search results in a grid like fashion.
*/
export default function Results() {
  const { id } = useParams<string>();

  const sortOrderState = useSelector(
    (state: RootState) => state.sort.sortOrder
  );
  const sortByState = useSelector((state: RootState) => state.sort.sortBy);

  const [loadedCount, setLoadedCount] = useState(1);

  const { loading, error, data } = useQuery(
    getQuery(sortByState, sortOrderState, id)
  );

  const movies: MovieType[] = data?.allMovies.edges.map(
    (edge: MovieEdge) => edge.node
  );

  const handleLoadMore = () => {
    setLoadedCount(loadedCount + 1);
  };

  const handleLoadLess = () => {
    setLoadedCount(loadedCount - 1);
  };

  const handleLoadFirst = () => {
    setLoadedCount(1);
  };

  const handleLoadLast = () => {
    setLoadedCount(999999);
  };

  return (
    <div className="results">
      <HeaderAndDrawer />
      <h2>Search results for: "{id}"</h2>
      {(loading || error) && <p>{error ? error.message : "Loading..."}</p>}
      {data && (
        <div className="row">
          {movies.map((movie: MovieType) => (
            <div className="card" key={`movie-${movie.title}`}>
              <NestedModal movie={movie}></NestedModal>
            </div>
          ))}
        </div>
      )}
      <br />
      <ButtonGroup
        disableElevation
        variant="contained"
        aria-label="Disabled elevation buttons"
        className="buttonGroup"
      >
        <Button
          onClick={() => {
            handleLoadFirst();
          }}
        >
          <img src={doubleLeftArrow} className="loadIcon" />
        </Button>
        <Button
          onClick={() => {
            handleLoadLess();
          }}
        >
          <img src={leftArrow} className="loadIcon" />
        </Button>
        <Button
          onClick={() => {
            handleLoadMore();
          }}
        >
          <img src={rightArrow} className="loadIcon" />
        </Button>
        <Button
          onClick={() => {
            handleLoadLast();
          }}
        >
          <img src={doubleRightArrow} className="loadIcon" />
        </Button>
      </ButtonGroup>
      <br />
    </div>
  );
}
