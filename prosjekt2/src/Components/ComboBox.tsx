import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { FilmOptionType, top100Films } from "../types";

export default function ComboBox() {
  const defaultProps = {
    options: top100Films,
    getOptionLabel: (option: FilmOptionType) => option.title,
  };
  const [value, setValue] = React.useState<FilmOptionType | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  console.log("value: ", value);

  return (
    <Autocomplete
      value={value}
      onChange={(_event: unknown, newValue: FilmOptionType | null) => {
        setValue(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(_event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          search(inputValue);
        }
      }}
      {...defaultProps}
      id="clear-on-escape"
      clearOnEscape
      renderInput={(params) => (
        <TextField {...params} label="Movies" variant="standard" />
      )}
    />
  );
}


