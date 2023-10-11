import * as React from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";

/* Returns a read only box of the public rating, so it cannot be changed by the user. */
export function ReadOnlyRating(value: number | null) {
  return (
    <Box>
      <Rating name="read-only" value={value} readOnly />
    </Box>
  );
}

/* The rate component used by users. Is implemented within each Actioncard. */
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
