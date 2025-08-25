import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
  },
});
