import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    api
      .get(`/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus("success");
        setTimeout(() => navigate("/app"), 2000);
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-[#1a1928] border border-[#2d2b40] flex items-center justify-center mx-auto mb-5">
          {status === "verifying" && (
            <div className="w-6 h-6 rounded-full border-2 border-[#2d2b40] border-t-violet-600 animate-spin" />
          )}
          {status === "success" && (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {status === "error" && (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f87171"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </div>

        {status === "verifying" && (
          <>
            <h2 className="font-['Outfit'] font-bold text-[22px] text-white mb-2">
              Verifying your email...
            </h2>
            <p className="text-[13px] text-[#6b6880]">Just a moment.</p>
          </>
        )}
        {status === "success" && (
          <>
            <h2 className="font-['Outfit'] font-bold text-[22px] text-white mb-2">
              Email verified!
            </h2>
            <p className="text-[13px] text-[#6b6880]">
              Redirecting you to DevLink...
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <h2 className="font-['Outfit'] font-bold text-[22px] text-white mb-2">
              Link expired or invalid
            </h2>
            <p className="text-[13px] text-[#6b6880] mb-6">
              Verification links expire after 24 hours.
            </p>
            <button
              onClick={() => navigate("/app")}
              className="px-5 py-2.5 bg-violet-700 hover:bg-violet-600 text-white text-[13px] font-medium rounded-lg transition-all cursor-pointer border-none">
              Go to app
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
