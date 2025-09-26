import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthSliceType {
  auth: {
    email: string;
    userId: number | null;
  };
}

const initialState: AuthSliceType = {
  auth: {
    email: "",
    userId: null,
  },
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    addAuthDetails: (
      state,
      action: PayloadAction<{ email: string; userId: number }>
    ) => {
      state.auth = action.payload;
    },
  },
});

export const { addAuthDetails } = authSlice.actions;
export default authSlice.reducer;
