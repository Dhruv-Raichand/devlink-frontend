import api from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { addFeed, removeUserFromFeed, clearFeed } from "../../store/feedSlice";
import SwipeableCard from "./SwipeableCard";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";
import HintModal from "../ui/HintModal";
import SlideInHint from "../ui/SlideInHint";
import { useNavigate } from "react-router-dom";

const LIMIT = 5;

const FILTER_SKILLS = [
  "React",
  "Node.js",
  "TypeScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "Docker",
  "AWS",
  "Flutter",
];

const Feed = () => {
  const feed = useSelector((state) => state.feed ?? []);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const isFetchingRef = useRef(false);
  // Keep a ref to current skills so getFeed always reads latest value
  const skillsRef = useRef([]);

  const getFeed = async () => {
    if (isFetchingRef.current || !hasMoreRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pageRef.current.toString(),
        limit: LIMIT.toString(),
      });

      // Use skillsRef so this always reads the latest selected skills
      if (skillsRef.current.length > 0) {
        params.append("skills", skillsRef.current.join(","));
      }

      const res = await api.get(`/user/feed?${params}`);
      const newUsers = res.data?.data?.data ?? res.data?.data ?? [];
      const pagination = res.data?.data?.pagination ?? res.data?.pagination;

      dispatch(addFeed(newUsers));
      setTotalCount(pagination?.totalUsers ?? 0);
      pageRef.current += 1;

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

  const resetAndFetch = () => {
    dispatch(clearFeed());
    pageRef.current = 1;
    hasMoreRef.current = true;
    isFetchingRef.current = false;
    getFeed();
  };

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) => {
      const next =
        prev.includes(skill) ?
          prev.filter((s) => s !== skill)
        : [...prev, skill];
      skillsRef.current = next;
      return next;
    });
  };

  const clearFilters = () => {
    setSelectedSkills([]);
    skillsRef.current = [];
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

  // Initial fetch
  useEffect(() => {
    getFeed();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    resetAndFetch();
  }, [selectedSkills.join(",")]); // stable dep — only fires when skills actually change

  // Fetch more when feed runs low
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (feed.length <= 2 && !isFetchingRef.current && hasMoreRef.current) {
      getFeed();
    }
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
            {selectedSkills.length > 0 ?
              "No matches for these skills"
            : "No more profiles"}
          </h1>
          <p className="text-[13px] text-[#6b6880] mb-6 leading-relaxed">
            {selectedSkills.length > 0 ?
              "Try removing some filters to see more developers."
            : "You've seen everyone for now. Check back later."}
          </p>
          {selectedSkills.length > 0 ?
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 bg-violet-700 hover:bg-violet-600 text-white text-[13px] font-medium rounded-lg transition-all cursor-pointer border-none">
              Clear filters
            </button>
          : <button
              onClick={resetAndFetch}
              className="px-5 py-2.5 bg-violet-700 hover:bg-violet-600 text-white text-[13px] font-medium rounded-lg transition-all cursor-pointer border-none">
              Refresh feed
            </button>
          }
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-10 pb-20">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="font-['Outfit'] font-extrabold text-[28px] md:text-[32px] text-white tracking-tight mb-2">
          Find your coding partner
        </h1>
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="inline-flex items-center gap-2 bg-[#13121c] border border-[#2d2b40] rounded-full px-4 py-1.5">
            <span className="w-5 h-5 rounded-lg bg-violet-700 flex items-center justify-center text-xs font-bold text-white">
              {totalCount}
            </span>
            <span className="text-[12px] text-[#6b6880]">remaining</span>
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] transition-all cursor-pointer ${
              showFilters || selectedSkills.length > 0 ?
                "border-violet-600 bg-violet-950/40 text-violet-300"
              : "border-[#2d2b40] bg-[#13121c] text-[#6b6880] hover:border-[#4a4760] hover:text-[#9b8ec4]"
            }`}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            Filter
            {selectedSkills.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] flex items-center justify-center font-bold">
                {selectedSkills.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Skill filter chips */}
      {showFilters && (
        <div className="bg-[#13121c] border border-[#1e1d28] rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] text-[#4a4760] uppercase tracking-wider">
              Filter by skill
            </p>
            {selectedSkills.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-[11px] text-[#6b6880] hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none">
                Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTER_SKILLS.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`text-[12px] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  selectedSkills.includes(skill) ?
                    "border-violet-600 bg-violet-950/40 text-violet-300"
                  : "border-[#2d2b40] bg-[#0d0c16] text-[#6b6880] hover:border-[#4a4760] hover:text-[#9b8ec4]"
                }`}>
                {skill}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active filters summary (when panel is closed) */}
      {!showFilters && selectedSkills.length > 0 && (
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <span className="text-[11px] text-[#4a4760]">Filtering by:</span>
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border border-violet-600 bg-violet-950/40 text-violet-300">
              {skill}
              <button
                onClick={() => toggleSkill(skill)}
                className="text-violet-400 hover:text-white cursor-pointer bg-transparent border-none p-0 leading-none ml-0.5">
                ×
              </button>
            </span>
          ))}
        </div>
      )}

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

      {loading && feed.length > 0 && (
        <p className="text-center text-[11px] text-[#4a4760] mt-4 animate-pulse">
          Loading more profiles...
        </p>
      )}

      <p className="text-center text-[11px] text-[#4a4760] mt-4">
        Drag the card or use the buttons
      </p>

      <HintModal
        id="feed_swipe"
        emoji="👆"
        title="How swiping works"
        body="Drag the card right to like, left to pass. Use the Filter button to find developers by tech stack."
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
