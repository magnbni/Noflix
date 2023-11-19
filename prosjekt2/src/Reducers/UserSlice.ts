import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    authUser: boolean;
    email: string;
}

const initialState: UserState = {
    authUser: false,
    email: "",
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    authUser: (
        state,
        action: PayloadAction<boolean>,
      ) => {
        state.authUser = action.payload;
  
        // If authUser is false, set email to empty
        if (!action.payload) {
          state.email = "";
        }
    },
    email: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    }
  },
});

export const { authUser, email } = userSlice.actions;

export default userSlice.reducer;
