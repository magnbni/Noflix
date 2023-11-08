import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { FormControlLabel, Slider, Switch } from "@mui/material";
import { FilmOptionType, top100Films } from "../types";
import { useState } from "react";
import { grey } from '@mui/material/colors';
import "./FilterAndSort.css";

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
  const [range, setRange] = useState<number[]>([
    findYearLimits(movies).lowestYear!,
    findYearLimits(movies).highestYear!,
  ]);
  const marks = createMarks(movies);

  const updateSortByYear = () => {
    setSortByYear(!sortByYear);
  };

  const updateSortByTitle = () => {
    setSortByTitle(!sortByTitle);
  };

  const updateFilterByYear = (_event: Event, newRange: number | number[]) => {
    const newRangeArray: number[] = newRange as number[];
    setRange([newRangeArray[0], newRangeArray[1]]);
  };

  return (
    <List className="list">
      <ListItem key="sortbyyear" disablePadding>
        <FormControlLabel
          control={<Switch defaultChecked onChange={updateSortByYear} color="default" />}
          label="Sort by year"
          className="switch"
        />
      </ListItem>
      <ListItem key="sortbytitle" disablePadding>
        <FormControlLabel
          control={<Switch defaultChecked onChange={updateSortByTitle} color="default"/>}
          label="Sort by title"
          className="switch"
        />
      </ListItem>
      <ListItem key="rangeyear">
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
          className="slider"
        />
      </ListItem>
    </List>
  );
}
