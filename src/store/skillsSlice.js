import { createSlice } from "@reduxjs/toolkit";

const skillsSlice = createSlice({
  name: "skills",
  initialState: {
    data: [],
    loaded: false,
  },
  reducers: {
    setSkills: (state, action) => {
      state.data = action.payload;
      state.loaded = true;
    },
  },
});

export const { setSkills } = skillsSlice.actions;
export default skillsSlice.reducer;
