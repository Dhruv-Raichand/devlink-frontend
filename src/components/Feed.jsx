import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import SwipeableCard from "./SwipeableCard";

const Feed = () => {
  const feed = useSelector((state) => state.feed);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const getFeed = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      console.log(res?.data?.data);
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.error("Error fetching feed:", err);
      setError("Failed to load feed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (status, userId) => {
    if (!userId) return; // Prevent action if no userId (for preview mode)

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
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-lg">Finding your perfect matches...</p>
          <p className="text-sm text-base-content/60 mt-2">
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
          <div className="text-error text-6xl mb-4">⛓️‍💥</div>
          <h2 className="text-2xl font-bold mb-2 text-error">
            Something went wrong
          </h2>
          <p className="text-base-content/70 mb-4">{error}</p>
          <button className="btn btn-primary" onClick={getFeed}>
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            No More Profiles to Show
          </h1>
          <p className="text-base-content/70 text-lg mb-6">
            You've seen all available profiles! Check back later for new matches
            or update your preferences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-primary btn-lg" onClick={getFeed}>
              Refresh Feed
            </button>
            <button className="btn btn-outline btn-lg">
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
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          Find your next coding partner 🚀
        </h1>
        <p className="text-base-content/70">
          Swipe right to team up on projects, left to explore others.
        </p>
      </div>

      {/* Feed Counter */}
      <div className="text-center mb-2">
        <div className="inline-flex items-center gap-2 bg-base-200 rounded-full px-4 py-2">
          <span className="text-sm font-medium">
            {feed.length} profile{feed.length !== 1 ? "s" : ""} remaining
          </span>
          <div className="badge badge-primary badge-sm">{feed.length}</div>
        </div>
      </div>

      {/* User Card Container */}
      <div className="relative flex justify-center items-start min-h-[80vh]">
        {feed.slice(0, 3).map((user, index) => (
          <SwipeableCard
            key={user._id}
            user={user}
            sendRequest={sendRequest}
            zIndex={feed.length - index} // top card is above
            scale={1 - index * 0.01} // slightly smaller for back cards
            topOffset={index * 20} // peek effect
            transition="transform 0.3s ease" // smooth animation
          />
        ))}
      </div>

      {/* Swipe Instructions */}
      <div className="text-center mt-3">
        <div className="flex justify-center items-center gap-8 text-sm text-base-content/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-error/20 rounded-full flex items-center justify-center">
              <span className="text-error">←</span>
            </div>
            <span>Pass</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
              <span className="text-success">→</span>
            </div>
            <span>Like</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
