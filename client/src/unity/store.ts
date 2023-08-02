import { configureStore } from "@reduxjs/toolkit";
import changeActive from "../features/changeActive";
import userSlice from "../features/userSlice";

export const store = configureStore({
  reducer: {
    isActive: changeActive,
    user: userSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
