import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addUser: (state, action) => {
      return (state = action.payload);
    },
    removeUser: (state, action) => {
      return (state = null);
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
