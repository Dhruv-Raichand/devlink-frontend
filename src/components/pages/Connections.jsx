import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../../store/connectionSlice";
import { Link } from "react-router-dom";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((state) => state.connection);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getConnections = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      console.log(res.data.data);
      dispatch(addConnection(res.data?.data));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load connections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  if (loading) return <LoadingSpinner message="Loading your connections..." />;
  if (error) return <ErrorMessage message={error} onRetry={getConnections} />;

  if (!connections || connections.length === 0) {
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
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <h1 className="font-['Outfit'] font-bold text-[22px] text-white mb-2">
            No connections yet
          </h1>
          <p className="text-[13px] text-[#6b6880] mb-6 leading-relaxed">
            Start swiping to find your perfect coding partners.
          </p>
          <Link
            to="/app"
            className="px-5 py-2.5 bg-violet-700 hover:bg-violet-600 text-white text-[13px] font-medium rounded-lg transition-all inline-block">
            Start swiping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-10 pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-['Outfit'] font-extrabold text-[28px] text-white tracking-tight mb-1">
          Your connections
        </h1>
        <p className="text-[13px] text-[#6b6880]">
          {connections.length}{" "}
          {connections.length === 1 ? "connection" : "connections"} found
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {connections.map((c) => {
          const { _id, firstName, lastName, photoUrl, about, skills } = c;
          return (
            <div
              key={_id}
              className="bg-[#13121c] border border-[#1e1d28] rounded-xl overflow-hidden hover:border-[#3730a3] transition-all duration-200 flex flex-col">
              {/* Photo */}
              <Link to={`/app/profile/${_id}`} state={{ targetUser: c }}>
                <div className="h-44 bg-[#1a1928] overflow-hidden">
                  <img
                    src={photoUrl}
                    alt={firstName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + " " + lastName)}&background=6d28d9&color=fff&size=300`;
                    }}
                  />
                </div>
              </Link>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="font-['Outfit'] font-bold text-[15px] text-white">
                      {firstName} {lastName}
                    </h2>
                    {about && (
                      <p className="text-[12px] text-[#6b6880] line-clamp-2 mt-0.5">
                        {about}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-900/60 text-emerald-400 flex-shrink-0 ml-2">
                    Connected
                  </span>
                </div>

                {/* Skills */}
                {skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4 mt-2">
                    {skills.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-full border border-[#2d2b40] bg-[#0d0c16] text-[#9b8ec4]">
                        {skill}
                      </span>
                    ))}
                    {skills.length > 3 && (
                      <span className="text-[11px] text-[#4a4760]">
                        +{skills.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <Link
                    to={`/app/messages/${_id}`}
                    state={{ targetUser: c }}
                    className="flex-1 py-2 bg-violet-700 hover:bg-violet-600 text-white text-[12px] font-medium rounded-lg transition-all text-center">
                    Message
                  </Link>
                  <Link
                    to={`/app/profile/${_id}`}
                    state={{ targetUser: c }}
                    className="w-8 h-8 flex items-center justify-center border border-[#2d2b40] rounded-lg text-[#6b6880] hover:text-[#e8e6f0] hover:border-[#4a4760] transition-all">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
