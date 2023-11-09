import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Rate } from "./BasicRating";
import { MovieType } from "../types";

/*
  Custom action card used to present each individual movie.
*/
export default function ActionAreaCard(movie: MovieType) {
  const truncatedTitle =
    movie.title.length > 20 ? movie.title.slice(0, 20) + "..." : movie.title;

  return (
    // Material-UI Card component with custom styles
    <Card sx={{ width: 300, heigth: 350 }}>
      <CardActionArea>
        <div
          style={{
            paddingTop: "20px",
            margin: "auto",
            width: "240px",
            height: "350px",
            backgroundSize: "cover", // Ensure the entire picture is viewable
            backgroundPosition: "center", // Center the image
            backgroundImage:
              "url(https://image.tmdb.org/t/p/original//" +
              movie.posterPath +
              ")",
          }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {truncatedTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {movie.releaseDate}
          </Typography>
        </CardContent>
        {Rate(movie.voteAverage.valueOf() / 2)}
      </CardActionArea>
    </Card>
  );
}
