import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import { FormControlLabel, FormLabel, Slider, Switch } from "@mui/material";
import "./FilterAndSort.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { sortBy, sortOrder, filterYear } from "../Reducers/SortSlice";

function valuetext(value: number) {
  return `${value}`;
}

function createMarks() {
  const lowerBound: number = 1900;
  const upperBound: number = 2025;
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
  const dispatch = useDispatch();
  const sortOrderState = useSelector(
    (state: RootState) => state.sort.sortOrder,
  );
  const filterYearState = useSelector(
    (state: RootState) => state.sort.filterYear,
  );
  const marks = createMarks();

  const updateSortOrder = () => {
    dispatch(sortOrder(sortOrderState == "asc" ? "desc" : "asc"));
  };

  const updateSortBy = (navn: "" | "title" | "releaseYear" | "rating") => {
    dispatch(sortBy(navn));
  };

  const updateFilterByYear = (_event: Event, newRange: number | number[]) => {
    const newRangeArray: number[] = newRange as number[];
    dispatch(filterYear([newRangeArray[0], newRangeArray[1]]));
  };

  return (
    <List className="list">
      <div style={{ padding: "10px" }}>
        <ListItem key="sortby" disablePadding>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Sort by</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              defaultValue="Default"
            >
              <FormControlLabel
                value="Default"
                control={<Radio onChange={() => updateSortBy("")} />}
                label="Default"
              />
              <FormControlLabel
                value="Title"
                control={<Radio onChange={() => updateSortBy("title")} />}
                label="Title"
              />
              <FormControlLabel
                value="Year"
                control={<Radio onChange={() => updateSortBy("releaseYear")} />}
                label="Year"
              />
              <FormControlLabel
                value="Rating"
                control={<Radio onChange={() => updateSortBy("rating")} />}
                label="Rating"
              />
            </RadioGroup>
          </FormControl>
        </ListItem>
        <ListItem key="sortAsc" disablePadding>
          <p style={{ paddingRight: "10px" }}>Descending</p>
          <FormControlLabel
            control={<Switch onChange={updateSortOrder} color="default" />}
            label={"Ascending"}
            className="switch"
          />
        </ListItem>
      </div>
      <ListItem key="rangeyear">
        <Slider
          getAriaLabel={() => "Release year range"}
          value={[filterYearState[0], filterYearState[1]]}
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
