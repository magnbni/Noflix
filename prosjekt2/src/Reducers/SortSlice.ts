import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SortState {
  sortByTitle: boolean;
  sortAsc: boolean;
}

const initialState: SortState = {
  sortByTitle: true,
  sortAsc: true,
};

export const sortSlice = createSlice({
  name: 'sortSlice',
  initialState,
  reducers: {
    sortByAsc: (state, action: PayloadAction<boolean>) => {
      state.sortAsc = action.payload;
    },
    sortByTitle: (state, action: PayloadAction<boolean>) => {
      state.sortByTitle = action.payload;
    },
  },
});

// Export the actions
export const { sortByAsc, sortByTitle } = sortSlice.actions;

// Export the reducer
export default sortSlice.reducer;
