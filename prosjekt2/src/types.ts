export interface MovieType {
  title: string;
  releaseDate: string;
  genres: GenreType[];
  overview: string;
  voteAverage: number;
  posterPath: string;
}

export interface GenreType {
  name: string;
}

export interface MovieEdge {
  node: MovieType[];
}
