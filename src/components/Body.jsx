if (!navigator.connection?.saveData) {
  import("./Silk");
}
import Footer from "./Footer";
import NavBar from "./NavBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { useEffect, useState } from "react";
import { ToastContainer, Flip } from "react-toastify";
import { lazy, Suspense } from "react";
const Silk = lazy(() => import("./Silk"));
import { useSilk } from "../context/SilkContext";
import { useLoading } from "../context/LoadingContext";

const Body = () => {
  const [silkColor, setSilkColor] = useState("#5227ff");
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { pageColor } = useSilk();
  const {
    loading: pageLoading,
    setLoading: setGlobalLoading,
    error: pageError,
    setError: setGlobalError,
  } = useLoading();

  const fetchUser = async () => {
    if (!userData) {
      try {
        setLoading(true);
        setGlobalLoading(true);
        setError(null);
        setGlobalError(false);
        const res = await axios.get(BASE_URL + "/profile", {
          withCredentials: true,
        });
        dispatch(addUser(res.data));
      } catch (err) {
        console.error("Error fetching user:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to load user data. Please try again.");
          setGlobalError(true);
        }
      } finally {
        setLoading(false);
        setGlobalLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Determine Silk color based on state
  const getSilkColor = () => {
    if (pageError) return "#ef4444"; // red always wins
    if (pageLoading) return "#3b82f6"; // blue while ANY page loads
    return pageColor; // page-specific color
  };

  const SilkFallback = ({ color }) => (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(
      to bottom,
      ${color} 0%,
      rgba(0, 0, 0, 0.7) 100%
    )`,
      }}
    />
  );

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Silk with dynamic color - animation won't pause now! */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Suspense fallback={<SilkFallback color={getSilkColor()} />}>
          <Silk
            key="main-silk"
            speed={5}
            scale={1}
            color={getSilkColor()}
            noiseIntensity={1.5}
            rotation={0}
          />
        </Suspense>
      </div>

      {/* All content sits above Silk */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Flip}
        />

        <NavBar />

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-800"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Loading your profile...
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we fetch your information
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold mb-3 text-red-600 dark:text-red-400">
                Something went wrong
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {error}
              </p>
              <button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                onClick={() => {
                  setError(null);
                  fetchUser();
                }}>
                <svg
                  className="w-5 h-5 mr-2 inline-block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <main className="flex-1">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-full">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </div>
          </main>
        )}
        <Footer />
      </div>
    </div>
  );
};

export default Body;
