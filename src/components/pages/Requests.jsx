import api from "../../utils/api";
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

  const [tab, setTab] = useState("received");
  const [sentRequests, setSentRequests] = useState([]);
  const [loadingReceived, setLoadingReceived] = useState(false);
  const [loadingSent, setLoadingSent] = useState(false);
  const [errorReceived, setErrorReceived] = useState(null);
  const [errorSent, setErrorSent] = useState(null);
  const [processing, setProcessing] = useState(new Set());

  const fetchReceived = async () => {
    setLoadingReceived(true);
    setErrorReceived(null);
    try {
      const res = await api.get("/user/requests/received");
      dispatch(addRequest(res.data?.data || []));
    } catch (err) {
      setErrorReceived(
        err?.response?.data?.message || "Failed to load requests",
      );
    } finally {
      setLoadingReceived(false);
    }
  };

  const fetchSent = async () => {
    setLoadingSent(true);
    setErrorSent(null);
    try {
      const res = await api.get("/user/requests/sent");
      setSentRequests(res.data?.data || []);
    } catch (err) {
      setErrorSent(
        err?.response?.data?.message || "Failed to load sent requests",
      );
    } finally {
      setLoadingSent(false);
    }
  };

  useEffect(() => {
    fetchReceived();
    fetchSent();
  }, []);

  const reviewRequest = async (status, requestId) => {
    if (processing.has(requestId)) return;
    try {
      setProcessing((prev) => new Set(prev).add(requestId));
      await api.post(`/request/review/${status}/${requestId}`);
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

  const withdrawRequest = async (requestId) => {
    if (processing.has(requestId)) return;
    try {
      setProcessing((prev) => new Set(prev).add(requestId));
      await api.delete(`/request/withdraw/${requestId}`);
      setSentRequests((prev) => prev.filter((r) => r._id !== requestId));
      notifySuccess("Request withdrawn");
    } catch (err) {
      notifyError(err?.response?.data?.message || "Failed to withdraw request");
    } finally {
      setProcessing((prev) => {
        const s = new Set(prev);
        s.delete(requestId);
        return s;
      });
    }
  };

  const TabButton = ({ id, label, count }) => (
    <button
      onClick={() => setTab(id)}
      className={`flex-1 py-2 text-[13px] font-medium rounded-md transition-all cursor-pointer border-none ${
        tab === id ?
          "bg-violet-700 text-white"
        : "bg-transparent text-[#6b6880] hover:text-[#9b8ec4]"
      }`}>
      {label}
      {count > 0 && (
        <span
          className={`ml-2 text-[11px] px-1.5 py-0.5 rounded-full ${
            tab === id ?
              "bg-violet-500 text-white"
            : "bg-[#2d2b40] text-[#6b6880]"
          }`}>
          {count}
        </span>
      )}
    </button>
  );

  const AvatarLink = ({ to, state, photoUrl, firstName, lastName }) => (
    <Link to={to} state={state} className="flex-shrink-0">
      <div className="w-12 h-12 rounded-full overflow-hidden border border-[#2d2b40] hover:border-violet-600 transition-colors">
        <img
          src={photoUrl}
          alt={firstName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              firstName + " " + lastName,
            )}&background=6d28d9&color=fff`;
          }}
        />
      </div>
    </Link>
  );

  const UserMeta = ({ to, state, firstName, lastName, age, gender, about }) => (
    <div className="flex-1 min-w-0">
      <Link
        to={to}
        state={state}
        className="font-['Outfit'] font-bold text-[15px] text-white hover:text-violet-300 transition-colors no-underline">
        {firstName} {lastName}
      </Link>
      <div className="flex items-center gap-2 mt-0.5">
        {age && <span className="text-[11px] text-[#6b6880]">{age} y/o</span>}
        {age && gender && <span className="text-[11px] text-[#4a4760]">·</span>}
        {gender && (
          <span className="text-[11px] text-[#4a4760] capitalize">
            {gender}
          </span>
        )}
      </div>
      {about && (
        <p className="text-[12px] text-[#6b6880] line-clamp-1 mt-1">{about}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 pt-10 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-['Outfit'] font-extrabold text-[28px] text-white tracking-tight mb-1">
          Requests
        </h1>
        <p className="text-[13px] text-[#6b6880]">
          Manage your connection requests
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#13121c] border border-[#1e1d28] rounded-lg p-1 mb-6">
        <TabButton
          id="received"
          label="Received"
          count={requests?.length || 0}
        />
        <TabButton id="sent" label="Sent" count={sentRequests?.length || 0} />
      </div>

      {/* ── RECEIVED TAB ── */}
      {tab === "received" && (
        <div>
          {loadingReceived && <LoadingSpinner message="Loading requests..." />}

          {!loadingReceived && errorReceived && (
            <ErrorMessage message={errorReceived} />
          )}

          {!loadingReceived && !errorReceived && requests?.length === 0 && (
            <EmptyState
              icon={<HeartIcon />}
              title="No received requests"
              desc="When someone likes your profile, their request will appear here."
              action={{ to: "/app", label: "Back to feed" }}
            />
          )}

          {!loadingReceived && !errorReceived && requests?.length > 0 && (
            <div className="flex flex-col gap-3">
              {requests.map((request) => {
                const {
                  _id,
                  firstName,
                  lastName,
                  about,
                  photoUrl,
                  age,
                  gender,
                } = request.fromUserId;
                const isPending = processing.has(request._id);
                const profileLink = `/app/profile/${_id}`;
                const profileState = { targetUser: request.fromUserId };

                return (
                  <div
                    key={request._id}
                    className="bg-[#13121c] border border-[#1e1d28] rounded-xl p-4 hover:border-[#2d2b40] transition-all">
                    <div className="flex items-center gap-4">
                      <AvatarLink
                        to={profileLink}
                        state={profileState}
                        photoUrl={photoUrl}
                        firstName={firstName}
                        lastName={lastName}
                      />
                      <UserMeta
                        to={profileLink}
                        state={profileState}
                        firstName={firstName}
                        lastName={lastName}
                        age={age}
                        gender={gender}
                        about={about}
                      />
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── SENT TAB ── */}
      {tab === "sent" && (
        <div>
          {loadingSent && <LoadingSpinner message="Loading sent requests..." />}

          {!loadingSent && errorSent && <ErrorMessage message={errorSent} />}

          {!loadingSent && !errorSent && sentRequests.length === 0 && (
            <EmptyState
              icon={<SendIcon />}
              title="No sent requests"
              desc="Profiles you've liked will appear here until they accept or reject."
              action={{ to: "/app", label: "Find developers" }}
            />
          )}

          {!loadingSent && !errorSent && sentRequests.length > 0 && (
            <div className="flex flex-col gap-3">
              {sentRequests.map((request) => {
                const {
                  _id,
                  firstName,
                  lastName,
                  about,
                  photoUrl,
                  age,
                  gender,
                } = request.toUserId;
                const isPending = processing.has(request._id);
                const profileLink = `/app/profile/${_id}`;
                const profileState = { targetUser: request.toUserId };

                return (
                  <div
                    key={request._id}
                    className="bg-[#13121c] border border-[#1e1d28] rounded-xl p-4 hover:border-[#2d2b40] transition-all">
                    <div className="flex items-center gap-4">
                      <AvatarLink
                        to={profileLink}
                        state={profileState}
                        photoUrl={photoUrl}
                        firstName={firstName}
                        lastName={lastName}
                      />
                      <UserMeta
                        to={profileLink}
                        state={profileState}
                        firstName={firstName}
                        lastName={lastName}
                        age={age}
                        gender={gender}
                        about={about}
                      />
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-950/40 border border-amber-900/50 text-amber-400">
                          Pending
                        </span>
                        <button
                          onClick={() => withdrawRequest(request._id)}
                          disabled={isPending}
                          className="px-3 py-2 text-[12px] font-medium text-[#6b6880] border border-[#2d2b40] hover:border-red-900/60 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-all disabled:opacity-50 cursor-pointer bg-transparent">
                          {isPending ? "..." : "Withdraw"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Refresh — only show on error */}
      {tab === "received" && errorReceived && !loadingReceived && (
        <div className="text-center mt-6">
          <button
            onClick={fetchReceived}
            className="px-5 py-2.5 border border-[#2d2b40] text-[#9b8ec4] hover:border-violet-800 hover:text-violet-300 text-[13px] rounded-lg transition-all cursor-pointer bg-transparent">
            Try again
          </button>
        </div>
      )}

      {tab === "sent" && errorSent && !loadingSent && (
        <div className="text-center mt-6">
          <button
            onClick={fetchSent}
            className="px-5 py-2.5 border border-[#2d2b40] text-[#9b8ec4] hover:border-violet-800 hover:text-violet-300 text-[13px] rounded-lg transition-all cursor-pointer bg-transparent">
            Try again
          </button>
        </div>
      )}
    </div>
  );
};

const EmptyState = ({ icon, title, desc, action }) => (
  <div className="flex flex-col items-center justify-center min-h-[40vh] px-4">
    <div className="text-center max-w-sm">
      <div className="w-16 h-16 rounded-full bg-[#1a1928] border border-[#2d2b40] flex items-center justify-center mx-auto mb-5 text-[#6b6880]">
        {icon}
      </div>
      <h2 className="font-['Outfit'] font-bold text-[20px] text-white mb-2">
        {title}
      </h2>
      <p className="text-[13px] text-[#6b6880] mb-6 leading-relaxed">{desc}</p>
      <Link
        to={action.to}
        className="px-5 py-2.5 bg-violet-700 hover:bg-violet-600 text-white text-[13px] font-medium rounded-lg transition-all inline-block no-underline">
        {action.label}
      </Link>
    </div>
  </div>
);

const HeartIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SendIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export default Requests;
