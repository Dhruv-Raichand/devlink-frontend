import api from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { addFeed, removeUserFromFeed } from "../../store/feedSlice";
import SwipeableCard from "./SwipeableCard";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";
import HintModal from "../ui/HintModal";
import SlideInHint from "../ui/SlideInHint";
import { useNavigate } from "react-router-dom";

const LIMIT = 5;

const Feed = () => {
  const feed = useSelector((state) => state.feed ?? []);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Use a ref for page so it never triggers re-renders or effect deps
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const isFetchingRef = useRef(false);

  const getFeed = async () => {
    // Prevent concurrent fetches
    if (isFetchingRef.current || !hasMoreRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pageRef.current.toString(),
        limit: LIMIT.toString(),
      });

      const res = await api.get(`/feed?${params}`);
      const newUsers = res.data?.data?.data ?? res.data?.data ?? [];
      const pagination = res.data?.data?.pagination ?? res.data?.pagination;

      dispatch(addFeed(newUsers));
      setTotalCount(pagination?.totalUsers ?? 0);

      // Advance page only after successful fetch
      pageRef.current += 1;

      // If we got fewer than limit, no more pages
      if (newUsers.length < LIMIT) {
        hasMoreRef.current = false;
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load feed");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Fetch more when feed runs low — but only if not already fetching
  const fetchMoreIfNeeded = () => {
    if (feed.length <= 2 && !isFetchingRef.current && hasMoreRef.current) {
      getFeed();
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

  // Initial fetch only — no deps that change
  useEffect(() => {
    getFeed();
  }, []);

  // After a card is swiped, check if we need more — but NOT on initial render
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchMoreIfNeeded();
  }, [feed.length]);

  if (loading && feed.length === 0) {
    return <LoadingSpinner message="Finding your matches..." />;
  }

  if (error && feed.length === 0) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => {
          pageRef.current = 1;
          hasMoreRef.current = true;
          getFeed();
        }}
      />
    );
  }

  if (!loading && feed.length === 0) {
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
            onClick={() => {
              pageRef.current = 1;
              hasMoreRef.current = true;
              getFeed();
            }}
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

      {/* Card stack */}
      <div
        className="relative flex justify-center items-center"
        style={{ height: 560 }}>
        {feed.slice(0, 2).map((feedUser, index) => (
          <SwipeableCard
            key={feedUser._id}
            user={feedUser}
            sendRequest={sendRequest}
            stackIndex={index}
            isTop={index === 0}
            disabled={isProcessing}
          />
        ))}
      </div>

      {/* Loading more indicator */}
      {loading && feed.length > 0 && (
        <p className="text-center text-[11px] text-[#4a4760] mt-4 animate-pulse">
          Loading more profiles...
        </p>
      )}

      <p className="text-center text-[11px] text-[#4a4760] mt-4">
        Drag the card or use the buttons
      </p>

      {/* Hints */}
      <HintModal
        id="feed_swipe"
        emoji="👆"
        title="How swiping works"
        body="Drag the card right to like, left to pass. You can also use the buttons below."
        cta="Let's go!"
      />
      <SlideInHint
        id="feed_no_skills"
        condition={!user?.skills?.length}
        icon="⚡"
        title="Add your skills"
        body="You haven't added any skills yet. Developers search by tech stack."
        action={{
          label: "Add skills",
          onClick: () => navigate("/app/profile"),
        }}
      />
    </div>
  );
};

export default Feed;
