import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthSliceType = {
  email: string;
  userId: number | null;
};

const initialState: AuthSliceType = {
  email: "",
  userId: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setLogin: (
      state,
      action: PayloadAction<{ userId: number; email: string }>
    ) => {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
    },
    setLogout: (state) => {
      state.userId = null;
      state.email = "";
    },
  },
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;
