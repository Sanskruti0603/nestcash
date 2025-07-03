import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import accountSlice from "./accountSlice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    account: accountSlice.reducer,
  },
});

export default store;
