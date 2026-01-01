import Footer from "./Footer";
import NavBar from "./NavBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { useEffect, useState, useRef } from "react";
import { ToastContainer, Flip } from "react-toastify";
import { lazy, Suspense } from "react";
const Silk = lazy(() => import("./Silk"));
import { useSilk } from "../context/SilkContext";
import { useLoading } from "../context/LoadingContext";

const Body = () => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { pageColor } = useSilk();
  const silkContainerRef = useRef(null);
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

  const getSilkColor = () => {
    if (pageError || error) return "#ef4444";
    if (pageLoading || loading) return "#3b82f6";
    return pageColor || "#5227ff";
  };

  const SilkFallback = ({ color }) => (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(to bottom, ${color} 0%, rgba(0, 0, 0, 0.7) 100%)`,
      }}
    />
  );

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Silk Background - FIXED: No overflow hidden */}
      <div
        ref={silkContainerRef}
        className="fixed inset-0 z-0 pointer-events-none">
        <Suspense fallback={<SilkFallback color={getSilkColor()} />}>
          <Silk
            container={silkContainerRef.current}
            key="main-silk"
            speed={5}
            scale={1}
            color={getSilkColor()}
            noiseIntensity={1.5}
            rotation={0}
          />
        </Suspense>
      </div>

      {/* Content Layer - FIXED: Better structure */}
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
            <div className="text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full">
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
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center max-w-md w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
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
                Try Again
              </button>
            </div>
          </div>
        ) : (
          // FIXED: Proper spacing - pt-20 instead of pt-24
          <main className="flex-1">
            <div className="w-full px-4 sm:px-6 lg:px-8 pb-8">
              <Outlet />
            </div>
          </main>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default Body;
