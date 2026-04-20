import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const ViewProfile = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(location.state?.targetUser || null);
  const [loading, setLoading] = useState(!location.state?.targetUser);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // If we got user from state, no API call needed
    if (location.state?.targetUser) return;

    setLoading(true);
    axios
      .get(`${BASE_URL}/profile/${userId}`, { withCredentials: true })
      .then((res) => setUser(res.data.data))
      .catch((err) =>
        setError(err?.response?.data?.message || "Failed to load profile"),
      )
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <LoadingSpinner message="Loading profile..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return null;

  const getAvatar = () => {
    if (imageError || !user.photoUrl) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${user.firstName} ${user.lastName}`,
      )}&background=6d28d9&color=fff&size=400`;
    }
    return user.photoUrl;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-20">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-[13px] text-[#6b6880] hover:text-[#e8e6f0] transition-colors cursor-pointer bg-transparent border-none mb-7 p-0">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back
      </button>

      {/* Card */}
      <div className="bg-[#13121c] border border-[#1e1d28] rounded-2xl overflow-hidden">
        {/* Cover */}
        <div className="h-36 bg-gradient-to-br from-violet-950/60 via-[#13121c] to-[#0d0c16] relative">
          {/* Avatar — overlaps cover */}
          <div className="absolute -bottom-11 left-6">
            <div className="w-[88px] h-[88px] rounded-full overflow-hidden border-4 border-[#13121c] bg-[#1a1928]">
              <img
                src={getAvatar()}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          </div>

          {/* Message button top-right */}
          <div className="absolute bottom-4 right-5">
            <Link
              to={`/app/messages/${user._id}`}
              state={{ targetUser: user }}
              className="flex items-center gap-2 px-4 py-2 bg-violet-700 hover:bg-violet-600 text-white text-[13px] font-medium rounded-lg transition-all no-underline">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Message
            </Link>
          </div>
        </div>

        {/* Body */}
        <div className="pt-14 px-6 pb-6">
          {/* Name + meta */}
          <div className="mb-5">
            <h1 className="font-['Outfit'] font-extrabold text-[24px] text-white tracking-tight leading-tight">
              {user.firstName} {user.lastName}
            </h1>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {user.age && (
                <span className="text-[12px] text-[#6b6880]">
                  {user.age} years old
                </span>
              )}
              {user.age && user.gender && (
                <span className="text-[#2d2b40] text-[12px]">·</span>
              )}
              {user.gender && (
                <span className="text-[12px] text-[#6b6880] capitalize">
                  {user.gender}
                </span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#1e1d28] mb-5" />

          {/* About */}
          {user.about && (
            <div className="mb-6">
              <p className="text-[11px] text-[#4a4760] uppercase tracking-wider mb-2">
                About
              </p>
              <p className="text-[14px] text-[#9b8ec4] leading-relaxed">
                {user.about}
              </p>
            </div>
          )}

          {/* Skills */}
          {user.skills?.length > 0 && (
            <div>
              <p className="text-[11px] text-[#4a4760] uppercase tracking-wider mb-3">
                Skills · {user.skills.length}
              </p>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-[12px] px-3 py-1.5 rounded-full border border-[#2d2b40] bg-[#0d0c16] text-[#9b8ec4]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Empty state if no about or skills */}
          {!user.about && !user.skills?.length && (
            <p className="text-[13px] text-[#4a4760] text-center py-4">
              This user hasn't added any details yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
