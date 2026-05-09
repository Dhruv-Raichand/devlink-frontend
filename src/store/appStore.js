import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";
import requestReducer from "./requestSlice";
import skillsReducer from "./skillsSlice";
import notificationReducer from "./notificationSlice";
import onlineReducer from "./onlineSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connection: connectionReducer,
    request: requestReducer,
    skills: skillsReducer,
    notifications: notificationReducer,
    online: onlineReducer,
  },
});
