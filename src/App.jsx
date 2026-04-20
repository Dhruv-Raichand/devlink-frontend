import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Connections from "./components/Connections";
import appStore from "./utils/appStore";
import { Provider } from "react-redux";
import Feed from "./components/Feed";
import Requests from "./components/Requests";
import Chat from "./components/Chat";
import ChatInbox from "./components/ChatInbox";
import ViewProfile from "./components/ViewProfile";
import NotFound from "./components/NotFound";
import { ToastContainer, Flip } from "react-toastify";
import AuthLoader from "./components/AuthLoader";
import PublicRoute from "./components/PublicRoutes";
import ProtectedRoute from "./components/ProtectedRoutes";
import Layout from "./components/Layout";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <AuthLoader>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="dark"
            transition={Flip}
          />

          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Landing />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
              <Route index element={<Feed />} />
              <Route path="profile" element={<Profile />} />
              <Route path="connections" element={<Connections />} />
              <Route path="requests" element={<Requests />} />
              <Route path="messages" element={<ChatInbox />} />
              <Route path="messages/:targetUserId" element={<Chat />} />
              <Route path="profile/:userId" element={<ViewProfile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthLoader>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
