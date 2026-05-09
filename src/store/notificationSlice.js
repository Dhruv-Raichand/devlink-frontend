import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: [],
  reducers: {
    addNotification: (state, action) => {
      state.unshift(action.payload);
    },
    clearNotifications: () => [],
    clearByType: (state, action) => {
      return state.filter((n) => n.type !== action.payload);
    },
  },
});

export const { addNotification, clearNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
