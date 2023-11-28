import { configureStore } from "@reduxjs/toolkit";
import { sortSlice } from "../src/Reducers/SortSlice";
import { userSlice } from "../src/Reducers/UserSlice";

const localStorageState = window.localStorage;

// Configuring the Redux store with the sorting and user slices
export const store = configureStore({
  reducer: {
    sort: sortSlice.reducer,
    user: userSlice.reducer,
  },
  // Preloading initial state from local storage
  preloadedState: {
    user: {
      authUser: localStorageState.getItem("authUser")
        ? JSON.parse(localStorageState.getItem("authUser")!)
        : false,
      email: localStorageState.getItem("email")
        ? JSON.parse(localStorageState.getItem("email")!)
        : "",
    },
  },
});

// Subscribing to store changes to update local storage
store.subscribe(() => {
  localStorageState.setItem(
    "authUser",
    JSON.stringify(store.getState().user.authUser),
  );
  localStorageState.setItem(
    "email",
    JSON.stringify(store.getState().user.email),
  );
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
