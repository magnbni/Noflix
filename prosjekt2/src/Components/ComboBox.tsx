import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { ComboBoxProps, FilmOptionType, top100Films } from "../types";
import React from "react";

// The main searchbar of the application, used on the Root homepage
export default function ComboBox({ onMovieSelect }: ComboBoxProps) {
  const [value, setValue] = React.useState<FilmOptionType | null>(null);
  const [inputValue, setInputValue] = React.useState("");

  // For the first version we use the top 100 films as default data, taken from the IMDB database
  const defaultProps = {
    options: top100Films,
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
        <TextField {...params} label="Movies" variant="standard" />
      )}
    />
  );
}
