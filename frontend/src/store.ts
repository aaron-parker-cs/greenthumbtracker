import { configureStore } from "@reduxjs/toolkit";
import userReducer, { initialState as userInitialState } from "./redux/user/slice";
import { api } from "./redux/api";

// Load user state from local storage
const persistedState = localStorage.getItem("userState")
  ? JSON.parse(localStorage.getItem("userState")!)
  : undefined;

export const store = configureStore({
  reducer: {
    user: userReducer,
    // Merge the RTK Query reducer
    [api.reducerPath]: api.reducer,
  },
  // Rehydrate just the user state (or whichever slices you want)
  preloadedState: {
    user: persistedState || userInitialState,
  },
  middleware: (getDefaultMiddleware) =>
    // Add the RTK Query middleware so queries and mutations work
    getDefaultMiddleware().concat(api.middleware),
});

// Persist the user slice to local storage on every state change
store.subscribe(() => {
  const { user } = store.getState();
  localStorage.setItem("userState", JSON.stringify(user));
});

// Export types for the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;