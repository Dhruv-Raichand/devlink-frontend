import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import SwipeableCard from "./SwipeableCard";
import { useSilk } from "../context/SilkContext";
import { useLoading } from "../context/LoadingContext";
import { useApiCall } from "../hooks/useApiCall";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const Feed = () => {
  const feed = useSelector((state) => state.feed);
  const dispatch = useDispatch();
  const { setPageColor } = useSilk();
  const { setLoading: setGlobalLoading, setError: setGlobalError } =
    useLoading();
  const { loading, error, execute } = useApiCall();
  const [isProcessing, setIsProcessing] = useState(false);

  const getFeed = async () => {
    setGlobalLoading(true);

    const result = await execute(() =>
      axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      })
    );

    setGlobalLoading(false);

    if (result.success) {
      dispatch(addFeed(result.data?.data?.data));
      setGlobalError(false);
    } else {
      setGlobalError(true);
    }
  };

  const sendRequest = async (status, userId, setIsProcessing) => {
    if (!userId) return;

    try {
      // Start local loading (pass setIsProcessing from the card/button)
      setIsProcessing(true);

      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );

      // Remove user from feed
      dispatch(removeUserFromFeed(userId));

      // Clear any global errors
      setGlobalError(false);
    } catch (err) {
      console.error("Error sending request:", err);
      setGlobalError(true);
    } finally {
      // Stop local loading
      setIsProcessing?.(false);
    }
  };

  useEffect(() => {
    setPageColor("#5227ff");
    getFeed();
    return () => setPageColor(null);
  }, []);

  if (loading) {
    return <LoadingSpinner message="Finding your perfect matches..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={getFeed} />;
  }

  if (!feed || feed.length <= 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] p-4">
        <div className="text-center max-w-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            No More Profiles
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
            You've seen all available profiles! Check back later for new
            matches.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
              onClick={getFeed}>
              Refresh Feed
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-12">
      {/* Header Section - Compact spacing */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-gray-900 dark:text-white">
          Find Your Coding Partner 🚀
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Swipe right to connect, left to pass
        </p>
      </div>

      {/* Feed Counter - Better positioning */}
      <div className="flex justify-center mb-2">
        <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-full px-5 py-2.5 shadow-lg">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {feed.length} profile{feed.length !== 1 ? "s" : ""} remaining
          </span>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full min-w-[24px] text-center">
            {feed.length}
          </div>
        </div>
      </div>

      {/* User Card Container - Fixed height and better centering */}
      <div
        className="relative flex justify-center items-center"
        style={{ minHeight: "600px", maxHeight: "650px" }}>
        {feed.slice(0, 3).map((user, index) => (
          <SwipeableCard
            key={user._id}
            user={user}
            sendRequest={sendRequest}
            zIndex={feed.length - index}
            scale={1 - index * 0.02}
            topOffset={index * 8}
            transition="transform 0.3s ease"
          />
        ))}
      </div>

      {/* Swipe Instructions */}
      <div className="text-center mt-20 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-medium">←</span> Swipe or click to{" "}
        <span className="font-semibold text-gray-700 dark:text-gray-200">
          Ignore
        </span>{" "}
        •{" "}
        <span className="font-semibold text-gray-700 dark:text-gray-200">
          Interested
        </span>{" "}
        <span className="font-medium">→</span>
      </div>
    </div>
  );
};

export default Feed;
