import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
  error: null,
  role: "admin",
  page_loading: false,
};

export const userSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    loaduser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.error = null;
      state.role = action.payload.role;
    },
    setpageloading: (state, action) => {
      state.page_loading = action.payload;
    },
    logout: (state, action) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
      state.role = null;
      state.page_loading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { loaduser, setpageloading } = userSlice.actions;

export default userSlice.reducer;
