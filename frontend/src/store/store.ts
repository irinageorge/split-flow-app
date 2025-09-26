import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./AuthSlice";

export const store = configureStore({
  reducer: {
    authSlice,
  },
});

// export types for usage in app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
