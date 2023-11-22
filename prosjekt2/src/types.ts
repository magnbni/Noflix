export type MovieEdge = {
  cursor: string;
  node: MovieType;
};

export type UserEdge = {
  cursor: string;
  node: UserType;
};

export interface MovieType {
  Id: string;
  title: string;
  releaseDate: string;
  overview: string;
  voteAverage: number;
  posterPath: string;
}

export interface UserType {
  email: string;
  password: string;
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
