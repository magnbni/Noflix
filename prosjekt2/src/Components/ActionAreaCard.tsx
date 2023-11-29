import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea, Skeleton } from "@mui/material";
import { ReadOnlyRating } from "./BasicRating";
import { MovieType } from "../types";

/*
  Custom action card used to present each individual movie.
*/

export interface ActionAreaCardProps {
  movie: MovieType | undefined;
}

export default function ActionAreaCard({ movie }: ActionAreaCardProps) {
  const truncatedTitle =
    movie && movie.title
      ? movie.title.length > 19
        ? movie.title.slice(0, 19) + "..."
        : movie.title
      : "";

  const date =
    movie && movie.releaseDate ? (
      movie.releaseDate.length >= 9 ? (
        new Date(movie.releaseDate).toLocaleDateString("en-GB")
      ) : (
        <br />
      )
    ) : (
      ""
    );

  return (
    // Material-UI Card component with custom styles
    <Card sx={{ width: 300, heigth: 350 }} data-testid="ActionAreaCard">
      <CardActionArea>
        <br />
        {movie && (
          <div
            data-testid="movie-poster"
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
        )}
        {!movie && (
          <Skeleton
            data-testid="skeleton-loader"
            variant="rectangular"
            width={240}
            height={350}
            style={{
              margin: "auto",
              borderRadius: "4px",
              border: "2px solid #000000",
            }}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {truncatedTitle === "" ? <Skeleton /> : truncatedTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {date === "" ? <Skeleton /> : date}
          </Typography>
        </CardContent>
        {movie && (
          <div style={{ paddingLeft: "13px", paddingBottom: "10px" }}>
            {movie.voteAverage >= 1 && movie.voteAverage <= 10
              ? ReadOnlyRating(movie.voteAverage / 2)
              : ReadOnlyRating(null)}
          </div>
        )}
        {!movie && (
          <div style={{ paddingLeft: "13px", paddingBottom: "10px" }}>
            <Skeleton variant="rectangular" width={100} height={27} />
          </div>
        )}
      </CardActionArea>
    </Card>
  );
}
