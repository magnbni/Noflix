import "./Results.css";
import NestedModal from "../Components/NestedModal";
import { FilmOptionType, top100Films } from "../types";
import { useParams } from "react-router-dom";
import { useState } from "react";
import HeaderAndDrawer from "../Components/HeaderAndDrawer";
import { gql, useQuery } from '@apollo/client';

// The main search function. Uses iteration to find the movies, will probably be implemented differently on the backend.
function search(searchWord: string) {
  const movies: FilmOptionType[] = [];
  top100Films.forEach((film) => {
    if (film.title.toLowerCase().includes(searchWord.toLowerCase())) {
      movies.push(film);
    }
  });
  return movies;
}

const GET_MOVIES = gql`
  query {allMovies(first: 10) {
    edges {
      node {
        title
        releaseDate
        overview
        voteAverage
        posterPath
      }
    }
  }}
`;

/* 
  This is the Results component that displays search results in a grid like fashion.
*/
export default function Results() {
  const { id } = useParams<string>();

  const [movies] = useState(search(id ? id : ""));

  const { loading, error, data } = useQuery(GET_MOVIES);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div className="results">
      <HeaderAndDrawer />
      <div className="row">
        {data.allMovies.edges.map((movie: any) => (
            <div className="card" key={`movie-${movie.node.title}`}>
              <NestedModal movie={movie.node}></NestedModal>
            </div>
          ))}
      </div>
    </div>
  );
}
