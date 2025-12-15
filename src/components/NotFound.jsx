import { useNavigate } from "react-router-dom";
import { lazy, Suspense } from "react";
const Silk = lazy(() => import("./Silk"));

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 dark:from-gray-900 dark:via-red-900 dark:to-orange-900 overflow-hidden">
      {/* Background Silk */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <Suspense fallback={<div>Loading BG...</div>}>
          <Silk speed={5} scale={1} color="#ff274b" noiseIntensity={1.8} />
        </Suspense>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-md bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center shadow-inner">
          <svg
            className="w-12 h-12 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7 7H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold mb-3 text-red-600 dark:text-red-400">
          Page Not Found
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          The page you're looking for doesn't exist or the link may be broken.
        </p>

        <button
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-[1.03] shadow-lg"
          onClick={() => navigate("/")}>
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
