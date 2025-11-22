import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Connections from "./components/Connections";
import appStore from "./utils/appStore";
import { Provider } from "react-redux";
import Feed from "./components/Feed";
import Requests from "./components/Requests";
import Chat from "./components/Chat";
import NotFound from "./components/NotFound";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route index element={<Feed />} />
              <Route path="login" element={<Login />} />
              <Route path="profile" element={<Profile />} />
              <Route path="connections" element={<Connections />} />
              <Route path="requests" element={<Requests />} />
              <Route path="chat/:targetUserId" element={<Chat />} />
            </Route>
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
