import { configureStore } from "@reduxjs/toolkit";
import authReducer, { AuthSliceType } from "./AuthSlice";
import tableDataReducer from "./TableData";

function loadFromLocalStorage(): { authSlice: AuthSliceType } | undefined {
  try {
    const serialized = localStorage.getItem("reduxState");
    if (!serialized) return undefined;
    const parsed = JSON.parse(serialized);
    return { authSlice: parsed.authSlice || { email: "", userId: null } };
  } catch {
    return undefined;
  }
}

function saveToLocalStorage(state: { authSlice: AuthSliceType }) {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem("reduxState", serialized);
  } catch {}
}

// store
const preloadedState = loadFromLocalStorage();

export const store = configureStore({
  reducer: {
    authSlice: authReducer,
    tableDataSlice: tableDataReducer,
  },
  preloadedState,
});

// persist on every state change
store.subscribe(() => {
  saveToLocalStorage({
    authSlice: store.getState().authSlice,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
