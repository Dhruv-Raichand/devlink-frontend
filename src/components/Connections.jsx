import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((state) => state.connection);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      console.log(res?.data?.data);
      dispatch(addConnection(res?.data?.data));
    } catch (err) {
      console.error("Error fetching connections:", err);
      setError(err?.response?.dat);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
        <p className="text-lg">Loading your connections...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="text-center max-w-md">
          <div className="text-error text-6xl mb-4">⛓️‍💥</div>
          <h2 className="text-2xl font-bold mb-2 text-error">Oops!</h2>
          <p className="text-base-content/70 mb-4">{error}</p>
          <button className="btn btn-primary" onClick={getConnections}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">⛓️‍💥</div>
          <h1 className="text-3xl font-bold mb-4">No Connections Yet</h1>
          <p className="text-base-content/70 mb-6">
            Start swiping to find your perfect matches and build meaningful
            connections!
          </p>
          <Link to={"/"} className="btn btn-primary btn-lg">
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
          Your Connections 🔗
        </h1>
        <p className="text-base-content/70 text-lg">
          {connections.length}{" "}
          {connections.length === 1 ? "connection" : "connections"} found
        </p>
      </div>

      {/* Connections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            connection;

          return (
            <div
              key={_id}
              className="bg-base-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
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
                  <div className="badge badge-success badge-lg font-semibold shadow-lg">
                    Connected
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2 truncate">
                  {firstName} {lastName}
                </h2>

                {age && gender && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="badge badge-outline">{age} years old</div>
                    <div className="badge badge-outline">{gender}</div>
                  </div>
                )}

                {about && (
                  <p className="text-base-content/70 text-sm line-clamp-3 mb-4">
                    {about}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="btn btn-primary btn-sm flex-1">
                    Message
                  </button>
                  <button className="btn btn-ghost btn-sm">
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
      {connections.length > 0 && (
        <div className="text-center mt-12">
          <button className="btn btn-outline btn-lg">
            Load More Connections
          </button>
        </div>
      )}
    </div>
  );
};

export default Connections;
