import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { ReadOnlyRating } from "./BasicRating";
import { MovieType } from "../types";

/*
  Custom action card used to present each individual movie.
*/
export default function ActionAreaCard(movie: MovieType) {
  const truncatedTitle =
    movie.title.length > 19 ? movie.title.slice(0, 19) + "..." : movie.title;
  const date =
    movie.releaseDate.length >= 9 ? (
      new Date(movie.releaseDate).toLocaleDateString("en-GB")
    ) : (
      <br />
    );

  return (
    // Material-UI Card component with custom styles
    <Card sx={{ width: 300, heigth: 350 }}>
      <CardActionArea>
        <br />
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
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {truncatedTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {date}
          </Typography>
        </CardContent>
        <div style={{ paddingLeft: "13px", paddingBottom: "10px" }}>
          {movie.voteAverage >= 1 && movie.voteAverage <= 10
            ? ReadOnlyRating(movie.voteAverage / 2)
            : ReadOnlyRating(null)}
        </div>
      </CardActionArea>
    </Card>
  );
}
