import * as React from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { RateProps } from "../types";
import { useQuery, gql } from "@apollo/client";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

/* Returns a read only box of the public rating, so it cannot be changed by the user. */
export function ReadOnlyRating(value: number | null) {
  return (
    <Box>
      <Rating name="read-only" value={value} readOnly />
    </Box>
  );
}

const GET_USER_RATING = gql`
  query allUsers($userEmail: String!, $movieId: String!) {
    userMovieRating(userEmail: $userEmail, movieId: $movieId) {
      ratingValue
    }
  }
`;

/* The rate component used by users. Is implemented within each Actioncard. */
export function Rate(rateProps: RateProps) {
  const [value, setValue] = React.useState<number | null>(null);
  const userEmailState = useSelector((state: RootState) => state.user.email);

  const { refetch } = useQuery(GET_USER_RATING, {
    variables: {
      userEmail: userEmailState,
      movieId: rateProps.movieId,
    },
    skip: rateProps.open, // Skip the query when 'open' is false
    onCompleted: (data) => {
      if (data.userMovieRating) {
        setValue(data.userMovieRating.ratingValue);
      }
      // Store the data in the state when the query is completed
    },
  });

  React.useEffect(() => {
    refetch();
  }, [rateProps.open, refetch]);

  return (
    <Box>
      {value ? (
        <Rating
          name="simple-controlled"
          value={value != null ? value : 0}
          onChange={(_event, newValue) => {
            setValue(newValue);
            if (newValue != null) {
              rateProps.handleUserRating(newValue);
            }
          }}
        />
      ) : (
        <>
          <Rating
            name="simple-controlled"
            value={0}
            onChange={(_event, newValue) => {
              setValue(newValue);
              if (newValue != null) {
                rateProps.handleUserRating(newValue);
              }
            }}
          />
        </>
      )}
    </Box>
  );
}
