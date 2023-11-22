import * as React from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { RateProps } from "../types";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { IconButton } from "@mui/material";
import trash from "../assets/trash.svg";
import "./BasicRating.css";

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

const DELETE_USER_RATING = gql`
  mutation deleteUserRatings($userEmail: String!, $movieId: String!) {
    deleteUserRatings(userEmail: $userEmail, movieId: $movieId) {
      success
    }
  }
`;

/* The rate component used by users. Is implemented within each Actioncard. */
export function Rate(rateProps: RateProps) {
  const [value, setValue] = React.useState<number | null>(null);
  const userEmailState = useSelector((state: RootState) => state.user.email);
  const [deleteRatingMutation] = useMutation(DELETE_USER_RATING);

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

  const handleRemove = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    try {
      const { data } = await deleteRatingMutation({
        variables: {
          userEmail: userEmailState,
          movieId: rateProps.movieId,
        },
      });
      if (data.deleteUserRatings.success) {
        console.log("Rating successfully deleted.");
        setValue(0);
      }
    } catch (error) {
      console.error("Deleting rating failed", error);
    }
  };

  React.useEffect(() => {
    refetch();
  }, [value, rateProps.open, refetch]);

  return (
    <div className="boxcontainer">
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
      <br />
      {value != null && value > 0 ? (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={handleRemove}
        >
          <img src={trash} alt="Menu" className="trashIcon" />
        </IconButton>
      ) : (
        <></>
      )}
    </div>
  );
}
