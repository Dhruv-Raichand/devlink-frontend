import { useState } from "react";

const UserCard = ({ user, sendRequest, disabled }) => {
  const [imageError, setImageError] = useState(false);

  const getProfileImage = () => {
    if (imageError || !user?.photoUrl) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${user?.firstName || "U"} ${user?.lastName || ""}`,
      )}&background=6d28d9&color=fff&size=400`;
    }
    return user.photoUrl;
  };

  const isPreview = !user?._id;

  return (
    <div className="w-full max-w-sm bg-[#13121c] border border-[#2d2b40] rounded-2xl overflow-hidden shadow-xl">
      {/* Photo */}
      <div className="relative h-72 bg-[#1a1928] overflow-hidden">
        <img
          src={getProfileImage()}
          alt={`${user?.firstName || "User"}`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#13121c]/80 via-transparent to-transparent" />
        {user?.age && (
          <div className="absolute top-3 right-3 bg-[#13121c]/90 border border-[#2d2b40] text-[#e8e6f0] px-2.5 py-1 rounded-full text-[12px] font-medium">
            {user.age}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h2 className="font-['Outfit'] font-bold text-[20px] text-white mb-1">
          {user?.firstName} {user?.lastName}
        </h2>

        {user?.gender && (
          <p className="text-[12px] text-[#6b6880] mb-3 capitalize">
            {user.gender}
          </p>
        )}

        {user?.about && (
          <p className="text-[13px] text-[#9b8ec4] leading-relaxed mb-4 line-clamp-2">
            {user.about}
          </p>
        )}

        {/* Skills */}
        {user?.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {user.skills.slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className="text-[11px] px-2.5 py-1 rounded-full border border-[#2d2b40] bg-[#0d0c16] text-[#9b8ec4]">
                {skill}
              </span>
            ))}
            {user.skills.length > 4 && (
              <span className="text-[11px] px-2.5 py-1 text-[#4a4760]">
                +{user.skills.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Buttons — only in feed mode */}
        {!isPreview && (
          <div className="flex gap-2.5">
            <button
              onClick={() => sendRequest("ignored", user._id)}
              disabled={disabled}
              className="flex-1 bg-[#1a1928] border border-[#2d2b40] hover:border-[#4a4760] text-[#9b8ec4] hover:text-[#e8e6f0] font-medium py-2.5 rounded-xl text-[13px] transition-all disabled:opacity-50 cursor-pointer">
              Pass
            </button>
            <button
              onClick={() => sendRequest("interested", user._id)}
              disabled={disabled}
              className="flex-1 bg-violet-700 hover:bg-violet-600 text-white font-medium py-2.5 rounded-xl text-[13px] transition-all disabled:opacity-50 cursor-pointer border-none">
              Like
            </button>
          </div>
        )}

        {/* Preview indicator */}
        {isPreview && (
          <div className="flex items-center justify-center gap-2 bg-[#1a1928] border border-[#2d2b40] rounded-lg px-3 py-2.5 text-[12px] text-[#6b6880]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            This is how your profile will appear
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
