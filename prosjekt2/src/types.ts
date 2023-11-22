export type MovieEdge = {
  cursor: string;
  node: MovieType;
};

export interface MovieType {
  Id: string;
  title: string;
  releaseDate: string;
  overview: string;
  voteAverage: number;
  posterPath: string;
}

export interface GenreEdge {
  node: GenreType;
}

export interface GenreType {
  name: string;
  id: string;
}

export interface RateProps {
  initValue: number | null;
  handleUserRating: (rating: number) => void;
  movieId: string;
  open: boolean;
}
