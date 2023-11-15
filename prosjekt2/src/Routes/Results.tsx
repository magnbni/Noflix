import "./Results.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import NestedModal from "../Components/NestedModal";
import HeaderAndDrawer from "../Components/HeaderAndDrawer";
import { gql, useQuery } from "@apollo/client";
import { MovieType } from "../types";
import { useState } from "react";
import { useParams } from "react-router-dom";
import leftArrow from "../assets/arrow-left.svg";
import rightArrow from "../assets/arrow-right.svg";
import doubleLeftArrow from "../assets/double-arrow-left.svg";
import doubleRightArrow from "../assets/double-arrow-right.svg";

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
  }

  return gql`
    query {
      allMovies(first: 12, sort: ${sortValue}, title: "${id}") {
        title
        releaseDate
        overview
        voteAverage
        posterPath
      }
    }
  `;
};

/* 
  This is the Results component that displays search results in a grid like fashion.
*/
export default function Results() {
  const { id } = useParams<string>();

  const [sortOption, setSortOption] = useState("title");
  const [orderDirection, setOrderDirection] = useState("desc");
  const [loadedCount, setLoadedCount] = useState(1);

  const { loading, error, data } = useQuery(
    getQuery(sortOption, orderDirection, id),
  );

  const updateSort = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortOption(event.target.value);
  };

  const updateOrderDirection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrderDirection(event.target.value);
  };

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
      <List className="list">
        <ListItem key="sortoption" disablePadding>
          <RadioGroup row defaultValue="title" onChange={updateSort}>
            <FormControlLabel
              value="title"
              control={<Radio color="default" />}
              label="Sort by Title"
            />
            <FormControlLabel
              value="releaseYear"
              control={<Radio color="default" />}
              label="Sort by Release Year"
            />
          </RadioGroup>
        </ListItem>
        <ListItem key="orderdirection" disablePadding>
          <RadioGroup row defaultValue="desc" onChange={updateOrderDirection}>
            <FormControlLabel
              value="desc"
              control={<Radio color="default" />}
              label="Descending"
            />
            <FormControlLabel
              value="asc"
              control={<Radio color="default" />}
              label="Ascending"
            />
          </RadioGroup>
        </ListItem>
      </List>
      {(loading || error) && <p>{error ? error.message : "Loading..."}</p>}
      {data && (
        <div className="row">
          {data.allMovies.map((movie: MovieType) => (
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
