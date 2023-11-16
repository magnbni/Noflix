import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SortState {
  sortBy: "" | "title" | "releaseYear" | "rating";
  sortOrder: "asc" | "desc";
  filterYear: [number, number];
}

const initialState: SortState = {
  sortBy: "",
  sortOrder: "asc",
  filterYear: [1900, 2025],
};

export const sortSlice = createSlice({
  name: "sortSlice",
  initialState,
  reducers: {
    sortBy: (
      state,
      action: PayloadAction<"" | "title" | "releaseYear" | "rating">,
    ) => {
      state.sortBy = action.payload;
    },
    sortOrder: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortOrder = action.payload;
    },
    filterYear: (state, action: PayloadAction<[number, number]>) => {
      state.filterYear = action.payload;
    },
  },
});

export const { sortBy, sortOrder, filterYear } = sortSlice.actions;

export default sortSlice.reducer;
