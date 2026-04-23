import api from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addFeed, removeUserFromFeed } from "../../store/feedSlice";
import SwipeableCard from "./SwipeableCard";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";

const Feed = () => {
  const feed = useSelector((state) => state.feed);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const getFeed = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/feed");
      dispatch(addFeed(res.data?.data?.data ?? res.data?.data ?? []));
      setTotalCount(
        res.data?.data?.pagination?.totalUsers ??
          res.data?.pagination?.totalUsers ??
          0,
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (status, userId) => {
    if (!userId || isProcessing) return;
    try {
      setIsProcessing(true);
      await api.post(`/request/send/${status}/${userId}`);
      dispatch(removeUserFromFeed(userId));
      setTotalCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error sending request:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (loading) return <LoadingSpinner message="Finding your matches..." />;
  if (error) return <ErrorMessage message={error} onRetry={getFeed} />;

  if (!feed || feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-[#1a1928] border border-[#2d2b40] flex items-center justify-center mx-auto mb-5">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#6b6880]">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h1 className="font-['Outfit'] font-bold text-[22px] text-white mb-2">
            No more profiles
          </h1>
          <p className="text-[13px] text-[#6b6880] mb-6 leading-relaxed">
            You've seen everyone for now. Check back later for new developers.
          </p>
          <button
            onClick={getFeed}
            className="px-5 py-2.5 bg-violet-700 hover:bg-violet-600 text-white text-[13px] font-medium rounded-lg transition-all cursor-pointer border-none">
            Refresh feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-10 pb-20">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-['Outfit'] font-extrabold text-[28px] md:text-[32px] text-white tracking-tight mb-2">
          Find your coding partner
        </h1>
        <div className="inline-flex items-center gap-2 bg-[#13121c] border border-[#2d2b40] rounded-full px-4 py-1.5 mt-2">
          <span className="w-5 h-5 rounded-xl bg-violet-700 flex items-center justify-center text-xs font-bold text-white">
            {totalCount}
          </span>
          <span className="text-[12px] text-[#6b6880]">remaining</span>
        </div>
      </div>

      {/* Card stack — only show top 2 for the illusion */}
      <div
        className="relative flex justify-center items-center"
        style={{ height: 560 }}>
        {feed.slice(0, 2).map((user, index) => (
          <SwipeableCard
            key={user._id}
            user={user}
            sendRequest={sendRequest}
            stackIndex={index}
            isTop={index === 0}
            disabled={isProcessing}
          />
        ))}
      </div>

      {/* Pass / Like buttons */}
      {/* <div className="flex items-center justify-center gap-6 mt-8">
        <button
          onClick={() => feed[0] && sendRequest("ignored", feed[0]._id)}
          disabled={isProcessing || !feed[0]}
          className="w-14 h-14 rounded-full bg-[#13121c] border border-[#2d2b40] hover:border-red-800/70 hover:bg-red-950/20 text-[#4a4760] hover:text-red-400 flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer"
          aria-label="Pass">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <button
          onClick={() => feed[0] && sendRequest("interested", feed[0]._id)}
          disabled={isProcessing || !feed[0]}
          className="w-16 h-16 rounded-full bg-violet-700 hover:bg-violet-600 text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer border-none shadow-lg shadow-violet-950/50"
          aria-label="Like">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div> */}

      <p className="text-center text-[11px] text-[#4a4760] mt-4">
        Drag the card or use the buttons
      </p>
    </div>
  );
};

export default Feed;
