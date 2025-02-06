import { configureStore } from "@reduxjs/toolkit";
import userReducer, { initialState } from "./redux/user/slice";

const persistedState = localStorage.getItem('userState')
    ? JSON.parse(localStorage.getItem('userState')!)
    : undefined;

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: { user: persistedState || initialState },
});

store.subscribe(() => {
  localStorage.setItem('userState', JSON.stringify(store.getState()));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };