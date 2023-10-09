import * as React from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";

export function ReadOnlyRating(value: number | null) {
  return (
    <Box>
      <Rating name="read-only" value={value} readOnly />
    </Box>
  );
}

export function Rate(initValue: number | null) {
  const [value, setValue] = React.useState<number | null>(initValue);

  return (
    <Box>
      <Rating
        name="simple-controlled"
        value={value}
        onChange={(_event, newValue) => {
          setValue(newValue);
        }}
      />
    </Box>
  );
}
