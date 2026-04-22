import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const ChatInbox = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(BASE_URL + "/chat/recent", { withCredentials: true })
      .then((res) => setChats(res.data?.data || []))
      .catch((err) =>
        setError(
          err?.response?.data?.message || "Failed to load conversations",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading conversations..." />;
  if (error) return <ErrorMessage message={error} />;

  const filtered = chats.filter((c) =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()),
  );

  if (chats.length === 0) {
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
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h1 className="font-['Outfit'] font-bold text-[22px] text-white mb-2">
            No conversations yet
          </h1>
          <p className="text-[13px] text-[#6b6880] mb-6 leading-relaxed">
            Connect with developers and send them a message to get started.
          </p>
          <Link
            to="/app/connections"
            className="px-5 py-2.5 bg-violet-700 hover:bg-violet-600 text-white text-[13px] font-medium rounded-lg transition-all inline-block no-underline">
            Go to connections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-10 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-['Outfit'] font-extrabold text-[28px] text-white tracking-tight mb-1">
          Messages
        </h1>
        <p className="text-[13px] text-[#6b6880]">
          {chats.length} {chats.length === 1 ? "conversation" : "conversations"}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a4760]"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversations..."
          className="w-full bg-[#13121c] border border-[#2d2b40] text-[#e8e6f0] placeholder-[#3a3850] rounded-lg pl-9 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-violet-600 transition-colors"
        />
      </div>

      {/* List */}
      <div className="flex flex-col">
        {filtered.length === 0 ?
          <p className="text-center text-[13px] text-[#4a4760] py-10">
            No results for "{search}"
          </p>
        : filtered.map((c) => (
            <Link
              key={c.userId}
              to={`/app/messages/${c.userId}`}
              state={{
                targetUser: {
                  _id: c.userId,
                  firstName: c.firstName,
                  lastName: c.lastName,
                  photoUrl: c.photoUrl,
                },
              }}
              className="flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-[#13121c] border border-transparent hover:border-[#1e1d28] transition-all no-underline group">
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full overflow-hidden border border-[#2d2b40] flex-shrink-0">
                <img
                  src={c.photoUrl}
                  alt={c.firstName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      c.firstName + " " + c.lastName,
                    )}&background=6d28d9&color=fff`;
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                  <p className="text-[14px] font-medium text-[#e8e6f0] group-hover:text-white transition-colors truncate">
                    {c.firstName} {c.lastName}
                  </p>
                  <span className="text-[11px] text-[#4a4760] flex-shrink-0">
                    {formatTime(c.lastMessageAt)}
                  </span>
                </div>
                <p className="text-[12px] text-[#4a4760] truncate">
                  {c.lastMessage || "No messages yet"}
                </p>
              </div>

              {/* Arrow */}
              <svg
                className="text-[#2d2b40] group-hover:text-[#6b6880] transition-colors flex-shrink-0 ml-1"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))
        }
      </div>
    </div>
  );
};

export default ChatInbox;
