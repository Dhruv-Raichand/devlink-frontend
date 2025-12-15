import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import SwipeableCard from "./SwipeableCard";
import { useSilk } from "../context/SilkContext";
import { useLoading } from "../context/LoadingContext";

const Feed = () => {
  const feed = useSelector((state) => state.feed);
  const dispatch = useDispatch();
  const { setSlikColor } = useSilk();
  const { setLoading: setGlobalLoading, setError: setGlobalError } =
    useLoading();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const getFeed = async () => {
    try {
      setLoading(true);
      setGlobalLoading(true);
      setError(null);
      setGlobalError(false);
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      console.log(res?.data?.data);
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.error("Error fetching feed:", err);
      setError("Failed to load feed. Please try again.");
      setGlobalError(true);
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const sendRequest = async (status, userId) => {
    if (!userId) return;

    setIsProcessing(true);
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Error sending request:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-blue-600 dark:text-blue-400 mb-4"></div>
          <p className="text-lg text-gray-900 dark:text-white">
            Finding your perfect matches...
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            This might take a moment
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⛔️💥</div>
          <h2 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
            onClick={getFeed}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!feed || feed.length <= 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <div className="text-center max-w-lg">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            No More Profiles to Show
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
            You've seen all available profiles! Check back later for new matches
            or update your preferences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
              onClick={getFeed}>
              Refresh Feed
            </button>
            <button className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200">
              Update Preferences
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-6">
      {/* Header Section */}
      <div className="text-center mb-6 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
          Find your next coding partner 🚀
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Swipe right to team up on projects, left to explore others.
        </p>
      </div>

      {/* Feed Counter */}
      <div className="text-center mb-2">
        <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 shadow-sm">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {feed.length} profile{feed.length !== 1 ? "s" : ""} remaining
          </span>
          <div className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {feed.length}
          </div>
        </div>
      </div>

      {/* User Card Container */}
      <div className="relative flex justify-center items-start min-h-[80vh]">
        {feed.slice(0, 3).map((user, index) => (
          <SwipeableCard
            key={user._id}
            user={user}
            sendRequest={sendRequest}
            zIndex={feed.length - index}
            scale={1 - index * 0.01}
            topOffset={index * 20}
            transition="transform 0.3s ease"
          />
        ))}
      </div>

      {/* Swipe Instructions */}
      <div className="text-center mt-3">
        <div className="flex justify-center items-center gap-8 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <span className="text-red-600 dark:text-red-400">←</span>
            </div>
            <span>Pass</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400">→</span>
            </div>
            <span>Like</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
