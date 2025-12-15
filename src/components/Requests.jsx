import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequest } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.request);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      console.log(res?.data?.data);
      dispatch(addRequest(res?.data?.data || []));
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(err?.response?.data || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="loading loading-spinner loading-lg text-blue-600 dark:text-blue-400 mb-4"></div>
        <p className="text-lg text-gray-900 dark:text-white">
          Loading your requests...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⛔️💥</div>
          <h2 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">
            Oops!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
            onClick={getRequests}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">⛓️💥</div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            No Connections Yet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start swiping to find your perfect matches and build meaningful
            connections!
          </p>
          <Link
            to={"/"}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg inline-block">
            Start Swiping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8 lg:py-12">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
          Connection Requests 💌
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {requests.length}{" "}
          {requests.length === 1 ? "person wants" : "people want"} to connect
          with you
        </p>
      </div>

      {/* Requests List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
        {requests.map((request) => {
          const { _id, firstName, lastName, about, photoUrl, age, gender } =
            request.fromUserId;

          return (
            <div
              key={_id}
              className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] flex flex-col">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={photoUrl}
                  className="w-full h-48 sm:h-56 object-cover"
                  alt={`${firstName}'s profile`}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x300?text=No+Image";
                  }}
                />
                <div className="absolute top-3 right-3">
                  <div className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                    Connected
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-xl font-bold mb-2 truncate text-gray-900 dark:text-white">
                  {firstName} {lastName}
                </h2>

                {age && gender && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                      {age} years old
                    </div>
                    <div className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                      {gender}
                    </div>
                  </div>
                )}

                {about && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                    {about}
                  </p>
                )}

                {/* Action Buttons pinned to bottom */}
                <div className="flex gap-2 mt-auto">
                  <Link
                    to={"/chat/" + _id}
                    state={{ targetUser: connection }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm flex-1 text-center">
                    Message
                  </Link>
                  <button className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-lg transition-all duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button (if needed for pagination) */}
      {requests.length > 0 && (
        <div className="text-center mt-12">
          <button className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200">
            Load More Connections
          </button>
        </div>
      )}
    </div>
  );
};

export default Requests;
