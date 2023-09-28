import { createSlice } from "@reduxjs/toolkit";

export const isLoginSlice = createSlice({
  name: "submit",
  initialState: {
    status: false,
    admin: false,
    userInfo: {},
    userEmail: "",
  },
  reducers: {
    submitted: (state) => {
      state.status = true;
    },
    setAdmin: (state) => {
      state.admin = true;
    },
    notSubmitted: (state) => {
      state.status = false;
    },
    setLoginUser: (state, action) => {
      state.userInfo = action.payload;
    },
    setLoginEmail: (state, action) => {
      state.userEmail = action.payload;
    },
    setNullUser: (state) => {
      state.userInfo = {};
    },
  },
});

export const {
  submitted,
  notSubmitted,
  setLoginUser,
  setNullUser,
  setLoginEmail,
  setAdmin,
} = isLoginSlice.actions;

export default isLoginSlice.reducer;
