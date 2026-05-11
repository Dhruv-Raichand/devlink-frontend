import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/api";
import { setSkills } from "../../store/skillsSlice";
import { useEffect, useState } from "react";
import { createSocketConnection } from "../../utils/socket";
import { addNotification } from "../../store/notificationSlice";
import { notify } from "../../utils/toast";
import { setOnline, setOffline, setOnlineList } from "../../store/onlineSlice";

const Layout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { loaded } = useSelector((state) => state.skills);
  const [resendCooldown, setResendCooldown] = useState(false);
  const [verifyBannerDismissed, setVerifyBannerDismissed] = useState(
    () => localStorage.getItem("verify_banner_dismissed") === "true",
  );

  const dismissVerifyBanner = () => {
    localStorage.setItem("verify_banner_dismissed", "true");
    setVerifyBannerDismissed(true);
  };

  const handleResendVerification = async () => {
    if (resendCooldown) return;
    try {
      await api.post("/auth/resend-verification");
      notify("Verification email sent!");
      setResendCooldown(true);
      setTimeout(() => setResendCooldown(false), 60000); // 1 min cooldown
    } catch {
      notify("Failed to send. Try again shortly.");
    }
  };

  useEffect(() => {
    if (!user?._id) return;

    const socket = createSocketConnection();

    socket.emit("register", user._id);

    socket.on("onlineList", (list) => dispatch(setOnlineList(list)));

    socket.on("userOnline", (userId) => dispatch(setOnline(userId)));
    socket.on("userOffline", (userId) => dispatch(setOffline(userId)));

    socket.on("newNotification", (notification) => {
      dispatch(addNotification(notification));

      if (notification.type === "message") {
        notify(`💬 ${notification.from}: ${notification.text}`);
      } else if (notification.type === "request") {
        notify(`🔔 ${notification.from} sent you a connection request`);
      } else if (notification.type === "request_accepted") {
        console.log("Request accepted notification received:", notification);
        notify(`🎉 ${notification.from} accepted your connection request`);
      }
    });

    return () => {
      socket.off("newNotification");
      socket.off("userOnline");
      socket.off("userOffline");
      socket.off("onlineList");
    };
  }, [user]);

  useEffect(() => {
    if (!loaded) {
      api.get("/skills").then((res) => {
        dispatch(setSkills(res.data?.data || []));
      });
    }
  }, [loaded]);

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] flex flex-col">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,rgba(109,40,217,0.18),transparent_70%)] z-0" />
      <NavBar />
      {user && !user.emailVerified && !verifyBannerDismissed && (
        <div className="relative z-20 bg-amber-950/40 border-b border-amber-900/40 px-4 py-2.5 flex items-center justify-center gap-3">
          <p className="text-[12px] text-amber-400">
            Please verify your email address. Check your inbox for a
            verification link.
          </p>
          <button
            onClick={handleResendVerification}
            disabled={resendCooldown}
            className="text-[12px] text-amber-300 underline underline-offset-2 cursor-pointer bg-transparent border-none hover:text-amber-200 disabled:opacity-50">
            {resendCooldown ? "Sent!" : "Resend"}
          </button>
          <button
            onClick={dismissVerifyBanner}
            className="text-[#6b6880] hover:text-[#9b8ec4] transition-colors cursor-pointer bg-transparent border-none p-0 ml-1"
            aria-label="Dismiss">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
