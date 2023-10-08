import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ActionAreaCard from "./ActionAreaCard";
import { grey } from "@mui/material/colors";
import { CardMedia } from "@mui/material";
import iguana from "../assets/iguana.png";
import { Rate, ReadOnlyRating } from "./BasicRating";


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

export default function NestedModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div onClick={handleOpen}>
        <ActionAreaCard />
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <div>
            <CardMedia
              component="img"
              height="140"
              image={iguana}
              alt="green iguana"
            />
            <h2>Movie Title</h2>
            <p>Movie rating:</p>
            {ReadOnlyRating(3)}
            <p>Your rating:</p>
            {Rate(2)}
            <p>
              Lizards are a widespread group of squamate reptiles, with over
              6,000 species, ranging across all continents except Antarctica
            </p>
          </div>

          {/* <ChildModal /> */}
        </Box>
      </Modal>
    </div>
  );
}
