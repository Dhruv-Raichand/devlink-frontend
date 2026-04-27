import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./store/appStore";
import { ToastContainer, Flip } from "react-toastify";

import Landing from "./components/pages/Landing";
import Login from "./components/pages/Login";
import Profile from "./components/pages/Profile";
import Connections from "./components/pages/Connections";
import Feed from "./components/pages/Feed";
import Requests from "./components/pages/Requests";
import Chat from "./components/pages/Chat";
import ChatInbox from "./components/pages/ChatInbox";
import ViewProfile from "./components/pages/ViewProfile";
import NotFound from "./components/pages/NotFound";
import Onboarding from "./components/pages/Onboarding";
import AuthLoader from "./components/layout/AuthLoader";
import PublicRoute from "./components/layout/PublicRoutes";
import ProtectedRoute from "./components/layout/ProtectedRoutes";
import Layout from "./components/layout/Layout";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
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
        <AuthLoader>
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

            {/* Onboarding — protected but outside Layout (no navbar) */}
            <Route
              path="/app/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />

            {/* Main app */}
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
