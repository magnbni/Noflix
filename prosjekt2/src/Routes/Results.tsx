import "./Results.css";
import NestedModal from "../Components/NestedModal";
import { FilmOptionType, top100Films } from "../types";
import { useParams } from "react-router-dom";
import Head from "../Components/Header";
import { FormControlLabel, FormGroup, Slider, Switch } from "@mui/material";
import React from "react";

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

interface markType {
  value: number;
  label: string;
}

function findYearLimits(movies: FilmOptionType[]) {
  let lowestYear: number | null = null;
  let highestYear: number | null = null;

  movies.forEach((movie: FilmOptionType) => {
    if (lowestYear === null || movie.year < lowestYear) {
      lowestYear = movie.year;
    }

    if (highestYear === null || movie.year > highestYear) {
      highestYear = movie.year;
    }
  });

  return { lowestYear, highestYear };
}

function sortMoviesByYear(movies: FilmOptionType[], type: "asc" | "desc") {
  return movies.slice().sort((a, b) => {
    if (type === "asc") {
      return a.year - b.year;
    } else {
      return b.year - a.year;
    }
  });
}

function sortMoviesByTitle(movies: FilmOptionType[], type: "asc" | "desc") {
  return movies.slice().sort((a, b) => {
    if (type === "asc") {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });
}

function filterByYear(
  movies: FilmOptionType[],
  lowerLimit: number,
  upperLimit: number
) {
  return movies.filter((movie) => {
    return movie.year >= lowerLimit && movie.year <= upperLimit;
  });
}

function filterByGenre(movies: FilmOptionType[], genre: string) {}

function valuetext(value: number) {
  return `${value}`;
}

function createMarks(movies: FilmOptionType[]) {
  const lowerBound: number =
    findYearLimits(movies).lowestYear != null
      ? findYearLimits(movies).lowestYear!
      : 1900;
  const upperBound: number =
    findYearLimits(movies).highestYear != null
      ? findYearLimits(movies).highestYear!
      : new Date().getFullYear();
  const marks = [];
  marks.push({
    value: lowerBound,
    label: lowerBound.toString(),
  });
  for (
    let i = lowerBound - (lowerBound % 50);
    i <= upperBound - (upperBound % 50);
    i += 50
  ) {
    marks.push({
      value: i,
      label: i.toString(),
    });
  }

  marks.push({
    value: upperBound,
    label: upperBound.toString(),
  });

  return marks;
}

/* 
  This is the Results component that displays search results in a grid like fashion.
*/
export default function Results() {
  const { id } = useParams<string>();
  const [sortByYear, setSortByYear] = React.useState(false);
  const [sortByTitle, setSortByTitle] = React.useState(false);
  const [movies, setMovies] = React.useState(search(id ? id : ""));
  const [marks, _setMarks] = React.useState<markType[]>(createMarks(movies));
  const [range, setRange] = React.useState<number[]>([
    marks[0].value,
    marks[marks.length - 1].value,
  ]);
  const [genre, setGenre] = React.useState("All");

  const updateSortByYear = () => {
    setSortByYear(!sortByYear);
    setMovies(sortMoviesByYear(movies, sortByYear ? "asc" : "desc"));
  };

  const updateSortByTitle = () => {
    setSortByTitle(!sortByTitle);
    setMovies(sortMoviesByTitle(movies, sortByTitle ? "asc" : "desc"));
  };

  const updateFilterByYear = (_event: Event, newRange: number | number[]) => {
    let newRangeArray: number[] = newRange as number[];
    setRange(newRangeArray);
    setMovies(filterByYear(movies, newRangeArray[0], newRangeArray[1]));
  };

  if (movies.length === 0) {
    return (
      <div>
        <Head></Head>
        <h1>Oh no! :(</h1>
        <h2>No results found for {id}</h2>
      </div>
    );
  }

  // The list of movie-elements.

  // Each movie has its own NestedModal component

  return (
    <div className="results">
      <Head></Head>
      <FormGroup>
        <FormControlLabel
          control={<Switch defaultChecked onChange={updateSortByYear} />}
          label="Sort by year"
        />
        <FormControlLabel
          control={<Switch defaultChecked onChange={updateSortByTitle} />}
          label="Sort by title"
        />
        <Slider
          getAriaLabel={() => "Release year range"}
          value={range}
          onChange={updateFilterByYear}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          marks={marks}
          min={marks[0].value}
          step={1}
          max={marks[marks.length - 1].value}
        />
      </FormGroup>
      <div className="row">
        {movies.map((movie) => (
          <div className="card" key={`movie-${movie.title}`}>
            {NestedModal(movie)}
          </div>
        ))}
      </div>
    </div>
  );
}
