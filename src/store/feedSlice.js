import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: [],
  reducers: {
    addFeed: (state, action) => {
      return [...state, ...action.payload]; // append, not replace
    },
    removeUserFromFeed: (state, action) => {
      return state.filter((user) => user._id !== action.payload);
    },
    clearFeed: () => [],
  },
});

export const { addFeed, removeUserFromFeed, clearFeed } = feedSlice.actions;

export default feedSlice.reducer;
