export type MovieEdge = {
  cursor: string;
  node: MovieType;
};

export interface MovieType {
  title: string;
  releaseDate: string;
  overview: string;
  voteAverage: number;
  posterPath: string;
}
