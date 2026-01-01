import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useState } from "react";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageError, setImageError] = useState(false);

  const defaultSkills = [
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
    "CSS",
    "ghhj",
    "fghjn  ",
  ];

  // const getSkillColor = (index) => skillColors[index % skillColors.length];

  const sendRequest = async (status, userId, setIsProcessing) => {
    if (!userId) return;

    try {
      // Start local spinner if provided
      setIsProcessing?.(true);

      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );

      // Remove user from feed (redux)
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Error sending request:", err);
    } finally {
      // Stop spinner
      setIsProcessing?.(false);
    }
  };

  const getGenderDisplay = (gender) => {
    const genderMap = {
      male: "Male",
      female: "Female",
      "non-binary": "Non-binary",
      "prefer-not-to-say": "Prefer not to say",
      other: "Other",
    };
    return genderMap[gender] || gender;
  };

  const getProfileImage = () => {
    if (imageError || !user?.photoUrl) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${user?.firstName || "User"} ${user?.lastName || ""}`
      )}&background=6366f1&color=ffffff&size=400&font-size=0.6`;
    }
    return user.photoUrl;
  };

  return (
    <div className="w-full max-w-sm touch-none bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl">
      {/* Image Container */}
      <div className="relative h-80 overflow-hidden bg-gradient-to-br from-blue-400 to-purple-600">
        <img
          src={getProfileImage()}
          alt={`${user?.firstName || "User"} ${user?.lastName || ""}`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

        {/* Age Badge */}
        {user?.age && (
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            {user.age}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {user?.firstName} {user?.lastName}
          </h2>

          {user?.gender && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {getGenderDisplay(user.gender)}
            </div>
          )}
        </div>

        {/* About Section */}
        {user?.about && (
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
              {user.about.length > 120
                ? `${user.about.substring(0, 120)}...`
                : user.about}
            </p>
          </div>
        )}

        {/* Skills Section */}
        {(user?.skills?.length > 0 || defaultSkills.length > 0) && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {(user?.skills?.length > 0 ? user.skills : defaultSkills)
                .slice(0, 4)
                .map((skill, index) => {
                  const skillBorderColors = [
                    "border-indigo-400 text-indigo-600 dark:border-indigo-400 dark:text-indigo-300",
                    "border-emerald-400 text-emerald-600 dark:border-emerald-400 dark:text-emerald-300",
                    "border-sky-400 text-sky-600 dark:border-sky-400 dark:text-sky-300",
                    "border-amber-400 text-amber-600 dark:border-amber-400 dark:text-amber-300",
                  ];

                  return (
                    <span
                      key={index}
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                        skillBorderColors[index % skillBorderColors.length]
                      } transition-all hover:scale-105 cursor-default`}>
                      {skill}
                    </span>
                  );
                })}

              {(user?.skills?.length || defaultSkills.length) > 4 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                  +{(user?.skills?.length || defaultSkills.length) - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons - Only show if userId exists (not in preview mode) */}
        {user?._id && (
          <div className="flex gap-3">
            <button
              onClick={() => sendRequest("ignored", user._id)}
              disabled={isProcessing}
              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-sm hover:shadow-md flex items-center justify-center">
              {isProcessing ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Ignore
                </>
              )}
            </button>

            <button
              onClick={() => sendRequest("interested", user._id)}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center">
              {isProcessing ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  Interested
                </>
              )}
            </button>
          </div>
        )}

        {/* Preview Mode Indicator */}
        {!user?._id && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-xl text-sm text-center">
            <svg
              className="w-4 h-4 inline-block mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            This is how your profile will appear
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-10 blur-xl"></div>
      <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-pink-400 to-red-600 rounded-full opacity-10 blur-xl"></div>
    </div>
  );
};

export default UserCard;
