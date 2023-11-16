// store.js
import { configureStore } from "@reduxjs/toolkit";
import { sortSlice } from "../src/Reducers/SortSlice";

export const store = configureStore({
  reducer: {
    sort: sortSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
