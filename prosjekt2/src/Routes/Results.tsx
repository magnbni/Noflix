import "./Results.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { FormControlLabel, Radio, RadioGroup, Slider, Switch } from "@mui/material";
import NestedModal from "../Components/NestedModal";
import HeaderAndDrawer from "../Components/HeaderAndDrawer";
import { gql, useQuery } from "@apollo/client";
import { FilmOptionType } from "../types";
import { useState } from "react";

const GET_MOVIES = gql`
  query {
    allMovies(first: 100) {
      title
      releaseDate
      overview
      voteAverage
      posterPath
    }
  }
`;

const getQuery = (sortOption: string, orderDirection: string) => {
  let sortValue = '';
  if (sortOption === 'title' && orderDirection === 'asc') {
    sortValue = "TITLE_ASC";
  } else if (sortOption === 'title' && orderDirection === 'desc') {
    sortValue = "TITLE_DESC";
  } else if (sortOption === 'releaseYear' && orderDirection === 'asc') {
    sortValue = "RELEASE_DATE_ASC";
  } else if (sortOption === 'releaseYear' && orderDirection === 'desc') {
    sortValue = "RELEASE_DATE_DESC";
  }

  return gql`
    query {
      allMovies(first: 100, sort: ${sortValue}) {
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

  const [sortOption, setSortOption] = useState('title');
  const [orderDirection, setOrderDirection] = useState('desc');

  const { loading, error, data } = useQuery(getQuery(sortOption, orderDirection));

  const updateSort = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortOption(event.target.value);
  };

  const updateOrderDirection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrderDirection(event.target.value);
  }

  // if (loading) return 'Loading...';
  // if (error) return `Error! ${error.message}`;

  console.log(data);

  return (
    <div className="results">
      <HeaderAndDrawer />
        <List className="list">
        <ListItem key="sortoption" disablePadding>
          <RadioGroup row defaultValue="title" onChange={updateSort}>
            <FormControlLabel value="title" control={<Radio color="default" />} label="Sort by Title" />
            <FormControlLabel value="releaseYear" control={<Radio color="default" />} label="Sort by Release Year" />
          </RadioGroup>
        </ListItem>
        <ListItem key="orderdirection" disablePadding>
          <RadioGroup row defaultValue="desc" onChange={updateOrderDirection}>
            <FormControlLabel value="desc" control={<Radio color="default" />} label="Descending" />
            <FormControlLabel value="asc" control={<Radio color="default" />} label="Ascending" />
          </RadioGroup>
        </ListItem>
      </List>
      {(loading || error) && <p>{error ? error.message : 'Loading...'}</p>}
      {data && <div className="row">
        {data.allMovies.map((movie: FilmOptionType) => (
            <div className="card" key={`movie-${movie.title}`}>
              <NestedModal movie={movie}></NestedModal>
            </div>
          ))}
      </div>}
      
    </div>
  );
}
