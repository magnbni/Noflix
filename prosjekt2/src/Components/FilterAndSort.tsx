import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import {
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Switch,
} from "@mui/material";
import "./FilterAndSort.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
  sortBy,
  sortOrder,
  filterYear,
  filterByGenre,
} from "../Reducers/SortSlice";
import { gql, useQuery } from "@apollo/client";
import { GenreEdge } from "../types";

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

const GENRES_QUERY = gql`
  query allGenres {
    allGenres {
      edges {
        node {
          name
          id
        }
      }
    }
  }
`;

export default function FilterAndSort() {
  const dispatch = useDispatch();
  const sortOrderState = useSelector(
    (state: RootState) => state.sort.sortOrder,
  );
  const filterYearState = useSelector(
    (state: RootState) => state.sort.filterYear,
  );
  const genreState = useSelector(
    (state: RootState) => state.sort.filterByGenre,
  );
  const marks = createMarks();

  const updateSortOrder = () => {
    dispatch(sortOrder(sortOrderState == "asc" ? "desc" : "asc"));
  };

  const updateSortBy = (navn: "" | "title" | "release_date" | "rating") => {
    dispatch(sortBy(navn));
  };

  const updateFilterByYear = (_event: Event, newRange: number | number[]) => {
    const newRangeArray: number[] = newRange as number[];
    dispatch(filterYear([newRangeArray[0], newRangeArray[1]]));
  };

  const updateGenre = (newGenre: string) => {
    dispatch(filterByGenre(newGenre));
  };

  const { loading, error, data } = useQuery(GENRES_QUERY);

  return (
    <div className="filter-and-sort-container">
      <div className="filter-section">
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">Sort by</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            defaultValue="Default"
            aria-label="Sort by"
          >
            <FormControlLabel
              value="Default"
              control={
                <Radio onChange={() => updateSortBy("")} aria-label="default" />
              }
              label="Default"
            />
            <FormControlLabel
              value="Title"
              control={
                <Radio
                  onChange={() => updateSortBy("title")}
                  aria-label="title"
                />
              }
              label="Title"
            />
            <FormControlLabel
              value="Year"
              control={
                <Radio
                  onChange={() => updateSortBy("release_date")}
                  aria-label="release date"
                />
              }
              label="Year"
            />
            <FormControlLabel
              value="Rating"
              control={
                <Radio
                  onChange={() => updateSortBy("rating")}
                  aria-label="rating"
                />
              }
              label="Rating"
            />
          </RadioGroup>
        </FormControl>
      </div>

      <div className="ascending-descending-section">
        <label htmlFor="Switch">Descending</label>
        <FormControlLabel
          control={
            <Switch onChange={updateSortOrder} color="default" id="Switch" />
          }
          label={"Ascending"}
          className="switch"
          id="SortOrder"
        />
      </div>

      <div className="range-year-section">
        <FormLabel id="release-year-range-label">Release year</FormLabel>

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
          get-aria-label="Release year range"
        />
      </div>

      <div className="genre-section">
        <FormControl fullWidth>
          <InputLabel>Genre</InputLabel>
          <Select
            label="Genre"
            onChange={(event) => updateGenre(event.target.value as string)}
            value={genreState}
            id="genre"
            name="genre"
          >
            <MenuItem value={"All"}>All</MenuItem>
            {!loading &&
              !error &&
              data &&
              data.allGenres.edges.map((edge: GenreEdge) => (
                <MenuItem value={edge.node.name} key={edge.node.id}>
                  {edge.node.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
}
