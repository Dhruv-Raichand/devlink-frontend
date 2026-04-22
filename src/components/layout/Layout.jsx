import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Layout = () => (
  <div className="relative min-h-screen bg-[#0a0a0f] flex flex-col">
    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,rgba(109,40,217,0.18),transparent_70%)] z-0" />
    <NavBar />
    <main className="relative z-10 flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
