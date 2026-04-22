// AuthLoader.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { addUser } from "../../store/userSlice";

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [checking, setChecking] = useState(!user);
  const [serverDown, setServerDown] = useState(false);

  useEffect(() => {
    if (user) {
      setChecking(false);
      return;
    }

    axios
      .get(BASE_URL + "/profile", { withCredentials: true })
      .then((res) => dispatch(addUser(res.data.data)))
      .catch((err) => {
        // 401 = not logged in — silent redirect is fine
        // anything else = server is likely down
        if (err?.response?.status !== 401 && !err?.response) {
          setServerDown(true);
        }
      })
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#2d2b40] border-t-violet-600 animate-spin" />
      </div>
    );
  }

  if (serverDown) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-[#1a1928] border border-[#2d2b40] flex items-center justify-center mx-auto mb-5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#6b6880]">
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
              <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
          </div>
          <h2 className="font-['Outfit'] font-bold text-[20px] text-white mb-2">
            Can't reach the server
          </h2>
          <p className="text-[13px] text-[#6b6880] mb-6 leading-relaxed">
            The server appears to be offline. Check your connection or try again
            in a moment.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-violet-700 hover:bg-violet-600 text-white text-[13px] font-medium rounded-lg transition-all cursor-pointer border-none">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthLoader;
