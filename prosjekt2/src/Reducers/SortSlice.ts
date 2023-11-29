import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Defining the structure of the state for sorting
export interface SortState {
  sortBy: "" | "title" | "release_date" | "rating";
  sortOrder: "asc" | "desc";
  filterYear: [number, number];
  filterByGenre: string;
}

// Initial state for the sorting slice
const initialState: SortState = {
  sortBy: "",
  sortOrder: "asc",
  filterYear: [1900, 2025],
  filterByGenre: "",
};

// Creating a Redux slice for sorting with initial state and reducers
export const sortSlice = createSlice({
  name: "sortSlice",
  initialState,
  // Reducer for updating the sorting and filtering criteria
  reducers: {
    sortBy: (
      state,
      action: PayloadAction<"" | "title" | "release_date" | "rating">,
    ) => {
      state.sortBy = action.payload;
    },
    sortOrder: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortOrder = action.payload;
    },
    filterYear: (state, action: PayloadAction<[number, number]>) => {
      state.filterYear = action.payload;
    },
    filterByGenre: (state, action: PayloadAction<string>) => {
      state.filterByGenre = action.payload;
    },
  },
});

export const { sortBy, sortOrder, filterYear, filterByGenre } =
  sortSlice.actions;

export default sortSlice.reducer;
