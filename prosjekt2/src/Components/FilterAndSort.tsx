import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
// import { FormControlLabel, Slider, Switch } from "@mui/material";
import { FormControlLabel, Switch } from "@mui/material";
// import { MovieType } from "../types";
import "./FilterAndSort.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { sortByAsc, sortByTitle } from "../Reducers/SortSlice";

// function valuetext(value: number) {
//   return `${value}`;
// }

// function findYearLimits(movies: MovieType[]) {
//   let lowestYear: number | null = null;
//   let highestYear: number | null = null;

//   movies.forEach((movie: MovieType) => {
//     if (lowestYear === null || parseInt(movie.releaseDate) < lowestYear) {
//       lowestYear = parseInt(movie.releaseDate);
//     }

//     if (highestYear === null || parseInt(movie.releaseDate) > highestYear) {
//       highestYear = parseInt(movie.releaseDate);
//     }
//   });

//   return { lowestYear, highestYear };
// }

// function createMarks(movies: MovieType[]) {
//   const lowerBound: number =
//     findYearLimits(movies).lowestYear != null
//       ? findYearLimits(movies).lowestYear!
//       : 1900;
//   const upperBound: number =
//     findYearLimits(movies).highestYear != null
//       ? findYearLimits(movies).highestYear!
//       : new Date().getFullYear();
//   const marks = [];
//   marks.push({
//     value: lowerBound,
//     label: lowerBound.toString(),
//   });
//   for (
//     let i = lowerBound - (lowerBound % 50);
//     i <= upperBound - (upperBound % 50);
//     i += 50
//   ) {
//     marks.push({
//       value: i,
//       label: i.toString(),
//     });
//   }

//   marks.push({
//     value: upperBound,
//     label: upperBound.toString(),
//   });

//   return marks;
// }

export default function FilterAndSort() {
  const dispatch = useDispatch();
  const sortAscState = useSelector(
    (state: RootState) => state.sort.sortAsc
  );
  const sortByTitleState = useSelector(
    (state: RootState) => state.sort.sortByTitle
  );

  const updateSortAsc = () => {
    dispatch(sortByAsc(!sortAscState));
  };

  const updateSortByTitle = () => {
   dispatch(sortByTitle(!sortByTitleState));
  };

//   const updateFilterByYear = (_event: Event, newRange: number | number[]) => {
//     const newRangeArray: number[] = newRange as number[];
//     setRange([newRangeArray[0], newRangeArray[1]]);
//   };

  return (
    <List className="list">
      <ListItem key="sortAsc" disablePadding>
        <FormControlLabel
          control={
            <Switch
              defaultChecked
              onChange={updateSortAsc}
              color="default"
            />
          }
          label={sortAscState ? "Ascending" : "Descending"}
          className="switch"
        />
      </ListItem>
      <ListItem key="sortbytitle" disablePadding>
        <FormControlLabel
          control={
            <Switch
              defaultChecked
              onChange={updateSortByTitle}
              color="default"
            />
          }
          label={sortByTitleState ? "Title" : "Year"}

          className="switch"
        />
      </ListItem>
      {/* <ListItem key="rangeyear">
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
      </ListItem> */}
    </List>
  );
}
