import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/api";
import { setSkills } from "../../store/skillsSlice";
import { useEffect } from "react";
import { createSocketConnection } from "../../utils/socket";
import { addNotification } from "../../store/notificationSlice";
import { notify } from "../../utils/toast";
import { setOnline, setOffline, setOnlineList } from "../../store/onlineSlice";

const Layout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { loaded } = useSelector((state) => state.skills);

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
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
