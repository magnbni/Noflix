import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Rate } from "./BasicRating";
import iguana from "../assets/iguana.png";
import { FilmOptionType } from "../types";

export default function ActionAreaCard(movie: FilmOptionType) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={iguana}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {movie.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {movie.year}
          </Typography>
        </CardContent>
      {Rate(2)}

      </CardActionArea>
    </Card>
  );
}
