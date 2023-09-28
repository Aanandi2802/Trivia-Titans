import { configureStore } from "@reduxjs/toolkit";
import sampleReducers from "./sample.reducers";
import isLoginReducers from "./isLogin.reducers";

const store = configureStore({
  reducer: {
    sample: sampleReducers,
    loginStatus: isLoginReducers,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});

export default store;
