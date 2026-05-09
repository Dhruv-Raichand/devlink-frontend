import { createSlice } from "@reduxjs/toolkit";

const onlineSlice = createSlice({
  name: "online",
  initialState: [], // array of userIds currently online
  reducers: {
    setOnline: (state, action) => {
      if (!state.includes(action.payload)) state.push(action.payload);
    },
    setOffline: (state, action) => {
      return state.filter((id) => id !== action.payload);
    },
    setOnlineList: (_, action) => action.payload,
  },
});

export const { setOnline, setOffline, setOnlineList } = onlineSlice.actions;
export default onlineSlice.reducer;
