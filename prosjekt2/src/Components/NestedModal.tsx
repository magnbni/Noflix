import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ActionAreaCard from "./ActionAreaCard";
import { grey } from "@mui/material/colors";
import { CardMedia } from "@mui/material";
import iguana from "../assets/iguana.png";
import { Rate, ReadOnlyRating } from "./BasicRating";
import { FilmOptionType } from "../types";

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
export default function NestedModal(movie: FilmOptionType) {
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
        >
          <div>
            <CardMedia
              component="img"
              height="200"
              image={iguana}
              alt="green iguana"
            />
            <h2 style={{ marginBottom: "0px" }}>{movie.title}</h2>
            <p style={{ marginTop: "0px", fontSize: "12px" }}>{movie.year}</p>
            <p>
              Lizards are a widespread group of squamate reptiles, with over
              6,000 species, ranging across all continents except
              AntarcticaLizards are a widespread group of squamate reptiles,
              with over 6,000 species, ranging across all continents except
              AntarcticaLizards are a widespread group of squamate reptiles,
              with over 6,000 species, ranging across all continents except
              Antarctica
            </p>
            <br />
            <p style={{ marginBottom: "0px" }}>Movie rating:</p>
            {ReadOnlyRating(3)}
            <p style={{ marginBottom: "0px" }}>Your rating:</p>
            {Rate(2)}
          </div>

          {/* <ChildModal /> */}
        </Box>
      </Modal>
    </div>
  );
}
