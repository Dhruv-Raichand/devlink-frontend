import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const ViewProfile = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(location.state?.targetUser || null);
  const [loading, setLoading] = useState(!location.state?.targetUser);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [github, setGithub] = useState(null);
  const [githubLoading, setGithubLoading] = useState(false);

  useEffect(() => {
    if (location.state?.targetUser) return;
    setLoading(true);
    api
      .get(`/profile/${userId}`)
      .then((res) => setUser(res.data.data))
      .catch((err) =>
        setError(err?.response?.data?.message || "Failed to load profile"),
      )
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    if (!user?.githubUsername) return;
    setGithubLoading(true);
    fetch(`https://api.github.com/users/${user.githubUsername}`)
      .then((r) => r.json())
      .then((data) => {
        // GitHub returns { message: "Not Found" } for invalid usernames
        if (data.message) return;
        setGithub(data);
      })
      .catch(() => {})
      .finally(() => setGithubLoading(false));
  }, [user]);

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
            <div className="mb-6">
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

          {/* Empty state */}
          {!user.about && !user.skills?.length && !user.githubUsername && (
            <p className="text-[13px] text-[#4a4760] text-center py-4">
              This user hasn't added any details yet.
            </p>
          )}

          {/* GitHub section — inside card body */}
          {user.githubUsername && (
            <div className="border-t border-[#1e1d28] pt-5">
              <p className="text-[11px] text-[#4a4760] uppercase tracking-wider mb-3">
                GitHub
              </p>

              {githubLoading && (
                <div className="flex items-center gap-2 text-[13px] text-[#4a4760]">
                  <div className="w-3 h-3 rounded-full border border-[#2d2b40] border-t-violet-600 animate-spin" />
                  Loading GitHub data...
                </div>
              )}

              {!githubLoading && github && (
                <div className="bg-[#0d0c16] border border-[#2d2b40] rounded-xl p-4">
                  {/* Header row */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-[#2d2b40] flex-shrink-0">
                      <img
                        src={github.avatar_url}
                        alt="GitHub avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-white">
                        {github.name || user.githubUsername}
                      </p>
                      {github.bio && (
                        <p className="text-[11px] text-[#6b6880] truncate">
                          {github.bio}
                        </p>
                      )}
                    </div>
                    <a
                      href={`https://github.com/${user.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[11px] text-violet-400 hover:text-violet-300 transition-colors no-underline flex-shrink-0">
                      <GitHubIcon />@{user.githubUsername}
                    </a>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="font-['Outfit'] font-bold text-[16px] text-white">
                        {github.public_repos}
                      </p>
                      <p className="text-[11px] text-[#4a4760]">Repos</p>
                    </div>
                    <div className="text-center">
                      <p className="font-['Outfit'] font-bold text-[16px] text-white">
                        {github.followers}
                      </p>
                      <p className="text-[11px] text-[#4a4760]">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="font-['Outfit'] font-bold text-[16px] text-white">
                        {github.following}
                      </p>
                      <p className="text-[11px] text-[#4a4760]">Following</p>
                    </div>
                    {github.location && (
                      <div className="flex items-center gap-1 ml-auto text-[11px] text-[#6b6880]">
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {github.location}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Username set but GitHub returned nothing valid */}
              {!githubLoading && !github && (
                <p className="text-[12px] text-[#4a4760]">
                  Could not load GitHub profile for{" "}
                  <span className="text-violet-400">
                    @{user.githubUsername}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
