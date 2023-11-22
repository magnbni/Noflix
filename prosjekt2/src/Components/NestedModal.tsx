import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ActionAreaCard from "./ActionAreaCard";
import { grey } from "@mui/material/colors";
import { Rate, ReadOnlyRating } from "./BasicRating";
import { MovieType } from "../types";
import CloseIcon from "../assets/close.svg";
import { RateProps } from "../types";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: grey[600],
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

interface NestedModalProps {
  movie: MovieType | undefined;
}

const USER_RATING_MUTATION = gql`
  mutation userRating($userEmail: String!, $ratings: [RatingInput]!) {
    updateUserRatings(userEmail: $userEmail, ratings: $ratings) {
      success
    }
  }
`;

const GET_USER_RATING = gql`
  query allUsers($userEmail: String!, $movieId: String!) {
    userMovieRating(userEmail: $userEmail, movieId: $movieId) {
      ratingValue
    }
  }
`;

/*
  This is the main modal used for showing the movies on the results page.
*/
const NestedModal: React.FC<NestedModalProps> = ({ movie }) => {
  const [open, setOpen] = React.useState(false);
  const [userRatingMutation] = useMutation(USER_RATING_MUTATION);
  const userEmailState = useSelector((state: RootState) => state.user.email);
  const authUserState = useSelector((state: RootState) => state.user.authUser);
  const [userData, setUserData] = React.useState(null);

  // const { data } = useQuery(GET_USER_RATING, {
  //   variables: {
  //     userEmail: userEmailState,
  //     movieId: movie?.Id,
  //   },
  // });

  useQuery(GET_USER_RATING, {
    variables: {
      userEmail: userEmailState,
      movieId: movie?.Id,
    },
    skip: !open, // Skip the query when 'open' is false
    onCompleted: (data) => {
      // Store the data in the state when the query is completed
      setUserData(data);
    },
  });

  const handleOpen = () => {
    if (movie) {
      setOpen(true);
      setRateProps({
        initValue:
          userData?.userMovieRating == null
            ? 0
            : userData.userMovieRating.ratingValue,
        handleUserRating: handleUserRating,
      });
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleUserRating = async (rating: number | null) => {
    console.log("called");
    try {
      const { data } = await userRatingMutation({
        variables: {
          userEmail: userEmailState,
          ratings: [
            {
              movieId: movie?.Id,
              ratingValue: rating,
            },
          ],
        },
      });

      if (data.updateUserRatings.success) {
        console.log("Is good");
      }
    } catch (error) {
      console.error("Add user rating failed", error);
    }
  };

  const [rateProps, setRateProps] = React.useState<RateProps>({
    initValue:
      userData?.userMovieRating == null
        ? 0
        : userData.userMovieRating.ratingValue,
    handleUserRating: handleUserRating,
  });

  // async function getUserRating(): Promise<number> {
  //   const { data } = await   getUserRatingQuery();
  //   if (data.userMovieRating.ratingValue) {
  //     return data.userMovieRating.ratingValue;
  //   } else {
  //     return 0;
  //   }
  // }

  // React.useEffect(() => {
  //   if (movie) {
  //     setRateProps({
  //       initValue: movie.voteAverage.valueOf() / 2,
  //       handleUserRating: (rate: number) => {
  //         return rate;
  //       },
  //     });
  //   }
  // }, [movie]);

  return (
    <div>
      <div onClick={handleOpen}>{ActionAreaCard(movie)}</div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            ...style,
            width: 400,
            maxWidth: "60%",
            maxHeight: "80%",
            overflow: "scroll",
            backgroundColor: "lightgrey",
            borderRadius: "10px",
          }}
          style={{ backgroundColor: "lightgrey" }}
        >
          <img
            src={CloseIcon}
            alt="close"
            onClick={handleClose}
            style={{
              right: "5px",
              top: "5px",
              position: "absolute",
              width: "25px",
              height: "25px",
            }}
          />
          {movie && (
            <div>
              {movie.posterPath ? (
                <div
                  style={{
                    margin: "auto",
                    width: "240px",
                    height: "350px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage:
                      "url(https://image.tmdb.org/t/p/original//" +
                      movie.posterPath +
                      ")",
                    borderRadius: "4px",
                    border: "2px solid #000000",
                  }}
                />
              ) : (
                <div
                  style={{
                    margin: "auto",
                    width: "240px",
                    height: "350px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "4px",
                    backgroundImage:
                      "url(https://lascrucesfilmfest.com/wp-content/uploads/2018/01/no-poster-available.jpg)",
                  }}
                ></div>
              )}
              <h2 style={{ marginBottom: "0px" }}>{movie.title}</h2>
              <div>
                <p style={{ marginTop: "0px", fontSize: "12px" }}>
                  {movie.releaseDate}
                </p>

                {movie.voteAverage >= 1 && movie.voteAverage <= 10
                  ? ReadOnlyRating(movie.voteAverage / 2)
                  : ReadOnlyRating(null)}
              </div>
              <p>{movie.overview}</p>
              <br />
              {authUserState && (
                <p style={{ marginBottom: "0px" }}>Set your rating:</p>
              )}
              {authUserState && rateProps != undefined && (
                <Rate {...rateProps} />
              )}
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default NestedModal;
