import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SortState {
  sortBy: "" | "title" | "release_date" | "rating";
  sortOrder: "asc" | "desc";
  filterYear: [number, number];
  filterByGenre: string;
}

const initialState: SortState = {
  sortBy: "",
  sortOrder: "asc",
  filterYear: [1900, 2025],
  filterByGenre: "",
};

export const sortSlice = createSlice({
  name: "sortSlice",
  initialState,
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
