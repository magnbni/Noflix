import { gql, useQuery } from "@apollo/client";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { ComboBoxProps, FilmOptionType } from "../types";
import React from "react";

const getQuery = (sortOption: string, orderDirection: string) => {
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

// The main searchbar of the application, used on the Root homepage
export default function ComboBox({ onMovieSelect }: ComboBoxProps) {
  const [value, setValue] = React.useState<FilmOptionType | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const { data } = useQuery(
    getQuery("title", "desc"),
  );

  // For the first version we use the top 100 films as default data, taken from the IMDB database
  const defaultProps = {
    options: data.allMovies,
    getOptionLabel: (option: FilmOptionType) => option.title,
  };

  return (
    /*
      Uses the Autocomplete component with the defaultprops,
      to give the user the option to autocomplete.
    */
    <Autocomplete
      value={value}
      onChange={(_event: unknown, newValue: FilmOptionType | null) => {
        setValue(newValue);
        setInputValue(newValue?.title || "");
        onMovieSelect(newValue?.title || "");
      }}
      inputValue={inputValue}
      onInputChange={(_event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onKeyDown={(event) => {
        /* 
          When movie is selected, the prop is passed to the parent component Root,
          which in turn routes to the specified movie id search page.
        */
        if (event.key === "Enter") {
          onMovieSelect(inputValue);
        }
      }}
      {...defaultProps}
      id="clear-on-escape"
      renderInput={(params) => (
        <TextField {...params} label="Search for movie" variant="standard" />
      )}
    />
  );
}
