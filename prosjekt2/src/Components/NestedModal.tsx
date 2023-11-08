import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ActionAreaCard from "./ActionAreaCard";
import { grey } from "@mui/material/colors";
import { Rate, ReadOnlyRating } from "./BasicRating";
import { FilmOptionType } from "../types";
import CloseIcon from "../assets/close.svg";

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

// This code may be used in future versions of the application, and is thus left as is for now.

// function ChildModal() {
//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => {
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <React.Fragment>
//       <Button onClick={handleOpen}>Open Child Modal</Button>
//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="child-modal-title"
//         aria-describedby="child-modal-description"
//       >
//         <Box sx={{ ...style, width: 200 }}>
//           <h2 id="child-modal-title">Text in a child modal</h2>
//           <p id="child-modal-description">
//             Lorem ipsum, dolor sit amet consectetur adipisicing elit.
//           </p>
//           <Button onClick={handleClose}>Close Child Modal</Button>
//         </Box>
//       </Modal>
//     </React.Fragment>
//   );
// }

/*
  This is the main modal used for showing the movies on the results page.
  
*/
const NestedModal = (movie: FilmOptionType) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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

          <div>
            {/* <CardMedia
              component="img"
              height="200"
              image={iguana}
              alt="green iguana"
            /> */}
            <div
              style={{
                margin: "auto",
                width: "80%",
                height: "200px",
                backgroundSize: "cover",
                backgroundImage:
                  "url(https://image.tmdb.org/t/p/original//" +
                  movie.posterPath +
                  ")",
              }}
            />
            <h2 style={{ marginBottom: "0px" }}>{movie.title}</h2>
            <p style={{ marginTop: "0px", fontSize: "12px" }}>
              {movie.releaseDate}
            </p>
            <p>{movie.overview}</p>
            <br />
            <p style={{ marginBottom: "0px" }}>Movie rating:</p>
            {ReadOnlyRating(movie.voteAverage.valueOf() / 2)}
            <p style={{ marginBottom: "0px" }}>Your rating:</p>
            {Rate(2)}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default NestedModal;
