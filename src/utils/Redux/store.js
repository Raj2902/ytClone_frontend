import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../Redux/reducer";

export const appStore = configureStore({
  reducer: rootReducer,
});
