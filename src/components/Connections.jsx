import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import { useSilk } from "../context/SilkContext";
import { useLoading } from "../context/LoadingContext";
import { useApiCall } from "../hooks/useApiCall"; // NEW!
import LoadingSpinner from "./LoadingSpinner"; // NEW!
import ErrorMessage from "./ErrorMessage"; // NEW!

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((state) => state.connection);
  const { setPageColor } = useSilk();
  const { setLoading: setGlobalLoading, setError: setGlobalError } =
    useLoading();

  // THIS IS THE ONLY NEW THING!
  const { loading, error, execute } = useApiCall();

  const getConnections = async () => {
    setGlobalLoading(true);

    // Just wrap your axios call in execute()
    const result = await execute(() =>
      axios.get(BASE_URL + "/user/connections", { withCredentials: true })
    );

    setGlobalLoading(false);

    if (result.success) {
      dispatch(addConnection(result.data?.data?.data));
      setGlobalError(false);
    } else {
      setGlobalError(true);
    }
  };

  useEffect(() => {
    setPageColor("#f59e0b");
    getConnections();
    return () => setPageColor(null);
  }, []);

  // SIMPLE: Just 3 if statements!
  if (loading) {
    return <LoadingSpinner message="Loading your connections..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={getConnections} />;
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🔗</div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            No Connections Yet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start swiping to find your perfect matches!
          </p>
          <Link
            to="/"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg inline-block">
            Start Swiping
          </Link>
        </div>
      </div>
    );
  }

  // Your existing card display code stays the same!
  return (
    <div className="py-6 sm:py-8 lg:py-12">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Your Connections 🔗
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {connections.length}{" "}
          {connections.length === 1 ? "connection" : "connections"} found
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            connection;
          return (
            <div
              key={_id}
              className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] flex flex-col">
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

                <div className="flex gap-2 mt-auto">
                  <Link
                    to={"/chat/" + _id}
                    state={{ targetUser: connection }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm flex-1 text-center">
                    Message
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
