import List from "@mui/material/List";

import ListItem from "@mui/material/ListItem";
import { FormControlLabel, FormGroup, Slider, Switch } from "@mui/material";
import { FilmOptionType, top100Films } from "../types";
import { useState } from "react";

function valuetext(value: number) {
  return `${value}`;
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
  moviesToFilter: FilmOptionType[],
  lowerLimit: number,
  upperLimit: number
) {
  const filteredMovies = moviesToFilter.filter(
    (movie) => movie.year >= lowerLimit && movie.year <= upperLimit
  );
  return filteredMovies;
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

export default function FilterAndSort() {
  const movies: FilmOptionType[] = top100Films;
  const [sortByYear, setSortByYear] = useState(false);
  const [sortByTitle, setSortByTitle] = useState(false);
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const [range, setRange] = useState<number[]>([
    findYearLimits(movies).lowestYear!,
    findYearLimits(movies).highestYear!,
  ]);
  const marks = createMarks(movies);

  const updateSortByYear = () => {
    setSortByYear(!sortByYear);
    setFilteredMovies(sortMoviesByYear(movies, sortByYear ? "asc" : "desc"));
  };

  const updateSortByTitle = () => {
    setSortByTitle(!sortByTitle);
    setFilteredMovies(sortMoviesByTitle(movies, sortByTitle ? "asc" : "desc"));
  };

  const updateFilterByYear = (_event: Event, newRange: number | number[]) => {
    const newRangeArray: number[] = newRange as number[];
    setRange([newRangeArray[0], newRangeArray[1]]);
    setFilteredMovies(filterByYear(movies, newRangeArray[0], newRangeArray[1]));
  };
  return (
    <List>
      <ListItem key="sortbyyear" disablePadding>
        <FormControlLabel
          control={<Switch defaultChecked onChange={updateSortByYear} />}
          label="Sort by year"
        />
      </ListItem>
      <ListItem key="sortbytitle" disablePadding>
        <FormControlLabel
          control={<Switch defaultChecked onChange={updateSortByTitle} />}
          label="Sort by title"
        />
      </ListItem>
      <ListItem key="rangeyear" disablePadding>
        <Slider
          getAriaLabel={() => "Release year range"}
          value={[range[0], range[1]]}
          onChange={updateFilterByYear}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          marks={marks}
          min={marks[0].value}
          step={1}
          max={marks[marks.length - 1].value}
        />
      </ListItem>
    </List>
  );
}
