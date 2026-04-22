import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../../store/requestSlice";
import { notifySuccess, notifyError } from "../../utils/toast";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";
import { Link } from "react-router-dom";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.request);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(new Set());

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequest(res.data?.data || []));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const reviewRequest = async (status, requestId) => {
    if (processing.has(requestId)) return;
    try {
      setProcessing((prev) => new Set(prev).add(requestId));
      await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeRequest(requestId));
      notifySuccess(`Request ${status} successfully!`);
    } catch (err) {
      notifyError(
        err?.response?.data?.message || `Failed to ${status} request`,
      );
    } finally {
      setProcessing((prev) => {
        const s = new Set(prev);
        s.delete(requestId);
        return s;
      });
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <LoadingSpinner message="Loading requests..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchRequests} />;

  if (!requests || requests.length === 0) {
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
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <h1 className="font-['Outfit'] font-bold text-[22px] text-white mb-2">
            No requests yet
          </h1>
          <p className="text-[13px] text-[#6b6880] mb-6 leading-relaxed">
            When someone likes your profile, their request will appear here.
          </p>
          <Link
            to="/app"
            className="px-5 py-2.5 bg-violet-700 hover:bg-violet-600 text-white text-[13px] font-medium rounded-lg transition-all inline-block">
            Back to feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-10 pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-['Outfit'] font-extrabold text-[28px] text-white tracking-tight mb-1">
          Connection requests
        </h1>
        <p className="text-[13px] text-[#6b6880]">
          {requests.length}{" "}
          {requests.length === 1 ? "person wants" : "people want"} to connect
          with you
        </p>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {requests.map((request) => {
          const { _id, firstName, lastName, about, photoUrl, age, gender } =
            request.fromUserId;
          const isPending = processing.has(request._id);

          return (
            <div
              key={_id}
              className="bg-[#13121c] border border-[#1e1d28] rounded-xl p-4 hover:border-[#2d2b40] transition-all">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-[#2d2b40]">
                  <img
                    src={photoUrl}
                    alt={firstName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + " " + lastName)}&background=6d28d9&color=fff`;
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="font-['Outfit'] font-bold text-[15px] text-white">
                    {firstName} {lastName}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    {age && (
                      <span className="text-[11px] text-[#6b6880]">
                        {age} y/o
                      </span>
                    )}
                    {gender && (
                      <span className="text-[11px] text-[#4a4760]">
                        · {gender}
                      </span>
                    )}
                  </div>
                  {about && (
                    <p className="text-[12px] text-[#6b6880] line-clamp-1 mt-1">
                      {about}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => reviewRequest("rejected", request._id)}
                    disabled={isPending}
                    className="px-3 py-2 text-[12px] font-medium text-red-400 border border-red-900/60 bg-red-950/30 hover:bg-red-950/60 rounded-lg transition-all disabled:opacity-50 cursor-pointer">
                    {isPending ? "..." : "Reject"}
                  </button>
                  <button
                    onClick={() => reviewRequest("accepted", request._id)}
                    disabled={isPending}
                    className="px-3 py-2 text-[12px] font-medium text-white bg-violet-700 hover:bg-violet-600 rounded-lg transition-all disabled:opacity-50 cursor-pointer border-none">
                    {isPending ? "..." : "Accept"}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-[#4a4760] mt-3 text-center">
                Accept to start chatting · Reject to decline
              </p>
            </div>
          );
        })}
      </div>

      {/* Refresh */}
      <div className="text-center mt-10">
        <button
          onClick={fetchRequests}
          disabled={loading}
          className="px-5 py-2.5 border border-[#2d2b40] text-[#9b8ec4] hover:border-violet-800 hover:text-violet-300 text-[13px] rounded-lg transition-all cursor-pointer bg-transparent">
          Refresh requests
        </button>
      </div>
    </div>
  );
};

export default Requests;
