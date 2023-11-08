import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Rate } from "./BasicRating";
import iguana from "../assets/iguana.png";
import { FilmOptionType } from "../types";

/*
  Custom action card used to present each individual movie.
*/
export default function ActionAreaCard(movie: FilmOptionType) {
  const truncatedTitle =
    movie.title.length > 20 ? movie.title.slice(0, 20) + "..." : movie.title;

  return (
    // Material-UI Card component with custom styles
    <Card sx={{ width: 330, heigth: 350 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={iguana}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {truncatedTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {movie.releaseDate}
          </Typography>
        </CardContent>
        {/* Uses the Rate component to provide a rating. Default value is set to 2 stars
            as of version 1.
        */}
        {Rate(2)}
      </CardActionArea>
    </Card>
  );
}
