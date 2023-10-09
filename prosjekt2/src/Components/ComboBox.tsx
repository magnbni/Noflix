import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { FilmOptionType, top100Films } from "../types";
import React from "react";

interface ComboBoxProps {
  onMovieSelect: (selectedOption: string | null) => void;
}

export default function ComboBox({ onMovieSelect }: ComboBoxProps) {
  const [value, setValue] = React.useState<FilmOptionType | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  
  const defaultProps = {
    options: top100Films,
    getOptionLabel: (option: FilmOptionType) => option.title,
  };

  return (
    <Autocomplete
      value={value}
      onChange={(_event: unknown, newValue: FilmOptionType | null) => {
        setValue(newValue);
        setInputValue(newValue?.title || "");
        onMovieSelect(newValue?.title || ""); // Call the callback function with selected movie
      }}
      inputValue={inputValue}
      onInputChange={(_event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          onMovieSelect(inputValue); // Call the callback function with selected movie
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
