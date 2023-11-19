import { configureStore } from "@reduxjs/toolkit";
import { sortSlice } from "../src/Reducers/SortSlice";
import { userSlice } from "../src/Reducers/UserSlice";

export const store = configureStore({
  reducer: {
    sort: sortSlice.reducer,
    user: userSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
