import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/requestSlice";
import { toast } from "react-toastify";
import { useSilk } from "../context/SilkContext";
import { useLoading } from "../context/LoadingContext";
import { useApiCall } from "../hooks/useApiCall";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.request);
  const { setPageColor } = useSilk();
  const { setLoading: setGlobalLoading, setError: setGlobalError } =
    useLoading();
  const [processingRequests, setProcessingRequests] = useState(new Set());

  const { loading, error, execute } = useApiCall();

  const notify = (msg, type = "success") => {
    const toastConfig = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    };

    if (type === "success") {
      toast.success(msg, toastConfig);
    } else if (type === "error") {
      toast.error(msg, toastConfig);
    }
  };

  const reviewRequest = async (status, requestId) => {
    if (processingRequests.has(requestId)) return;

    try {
      setProcessingRequests((prev) => new Set(prev).add(requestId));

      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + requestId,
        {},
        { withCredentials: true }
      );

      console.log(res?.data?.data);
      dispatch(removeRequest(requestId));

      // Show success message
      const action = status === "accepted" ? "accepted" : "rejected";
      notify(`Request ${action} successfully!`, "success");
    } catch (err) {
      console.error("Error reviewing request:", err);
      notify(
        err?.response?.data?.message ||
          `Failed to ${status} request. Please try again.`,
        "error"
      );
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const fetchRequests = async () => {
    setGlobalLoading(true);

    const result = await execute(() =>
      axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      })
    );
    setGlobalLoading(false);

    if (result.success) {
      dispatch(addRequest(result?.data?.data?.data || []));
      console.log(result?.data?.data?.data);
      setGlobalError(false);
    } else {
      setGlobalError(true);
    }
    // const errorMessage =
    //   err?.response?.data?.message || "Failed to load requests";
    // setError(errorMessage);
    // console.error("Error fetching requests:", errorMessage);
  };

  useEffect(() => {
    setPageColor("#22c55e");
    fetchRequests();
    return () => setPageColor(null);
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading your requests..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchRequests} />;
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">💌</div>
          <h1 className="text-3xl font-bold mb-4">No New Requests</h1>
          <p className="text-base-content/70 mb-6">
            You don't have any connection requests at the moment. Keep swiping
            to find more matches!
          </p>
          <button className="btn btn-primary btn-lg">Back to Feed</button>
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
        <p className="text-base-content/70 text-lg">
          {requests.length}{" "}
          {requests.length === 1 ? "person wants" : "people want"} to connect
          with you
        </p>
      </div>

      {/* Requests List */}
      <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
        {requests.map((request) => {
          const { _id, firstName, lastName, about, photoUrl, age, gender } =
            request.fromUserId;
          const isProcessing = processingRequests.has(request._id);

          return (
            <div
              key={_id}
              className="bg-base-200 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="avatar">
                    <div className="w-16 sm:w-20 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                      <img
                        src={photoUrl}
                        alt={`${firstName}'s profile`}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/80x80?text=User";
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">
                    {firstName} {lastName}
                  </h2>

                  {age && gender && (
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <div className="badge badge-outline badge-lg">
                        {age} years old
                      </div>
                      <div className="badge badge-outline badge-lg">
                        {gender}
                      </div>
                    </div>
                  )}

                  {about && (
                    <p className="text-base-content/70 text-sm sm:text-base line-clamp-2 pr-4">
                      {about}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:flex-shrink-0">
                  <button
                    className={`btn btn-error btn-lg flex-1 sm:flex-none ${
                      isProcessing ? "loading" : ""
                    }`}
                    onClick={() => reviewRequest("rejected", request._id)}
                    disabled={isProcessing}>
                    {!isProcessing && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                    {isProcessing ? "Processing..." : "Reject"}
                  </button>

                  <button
                    className={`btn btn-success btn-lg flex-1 sm:flex-none ${
                      isProcessing ? "loading" : ""
                    }`}
                    onClick={() => reviewRequest("accepted", request._id)}
                    disabled={isProcessing}>
                    {!isProcessing && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    )}
                    {isProcessing ? "Processing..." : "Accept"}
                  </button>
                </div>
              </div>

              {/* Request timestamp or additional info could go here */}
              <div className="mt-4 pt-4 border-t border-base-300">
                <p className="text-xs text-base-content/50 text-center">
                  💡 Tip: Accept to start chatting, or reject to politely
                  decline
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Refresh Button */}
      <div className="text-center mt-12">
        <button
          className="btn btn-outline btn-lg"
          onClick={fetchRequests}
          disabled={loading}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh Requests
        </button>
      </div>
    </div>
  );
};

export default Requests;
