import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { notifyError, notifySuccess } from "../utils/toast";
import { useState, useEffect, useRef } from "react";

const NavBar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      notifySuccess("Logged out successfully!");
      dispatch(removeUser());
      setProfileMenuOpen(false);
      setMobileMenuOpen(false);
      navigate("/");
    } catch (err) {
      console.log(err);
      notifyError("Logout failed. Please try again.");
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const NAV_LINKS = [
    { to: "/app", label: "Home" },
    { to: "/app/connections", label: "Connections" },
    { to: "/app/requests", label: "Requests" },
    // { to: "/app/messages", label: "Messages" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0a0a0f]/90 backdrop-blur-md border-b border-[#1e1d28]">
      <div className="flex items-center justify-between px-6 md:px-10 h-14 py-8">
        {/* ── Logo ── */}
        <Link
          to={user ? "/app" : "/"}
          className="flex items-center gap-2.5 no-underline"
          onClick={() => setMobileMenuOpen(false)}>
          <div className="w-7 h-7 rounded-[7px] overflow-hidden flex-shrink-0">
            <img src="/devlink.png" className="w-full h-full object-contain" />
          </div>
          <span className="font-['Outfit'] font-extrabold text-xl text-white tracking-tight">
            DevLink
          </span>
        </Link>

        {/* ── Unauthenticated: right side buttons ── */}
        {!user && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm text-[#9b8ec4] border border-[#2d2b40] rounded-lg hover:border-violet-800 hover:text-violet-300 transition-all cursor-pointer bg-transparent">
              Sign in
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm font-medium text-white bg-violet-700 rounded-lg hover:bg-violet-600 transition-all cursor-pointer border-none">
              Get started
            </button>
          </div>
        )}

        {/* ── Authenticated: desktop nav + profile ── */}
        {user && (
          <>
            {/* Desktop links */}
            <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all no-underline ${
                      isActive(link.to) ?
                        "text-white bg-[#1a1928]"
                      : "text-[#6b6880] hover:text-[#e8e6f0] hover:bg-[#13121c]"
                    }`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop profile dropdown */}
            <div
              className="hidden md:flex items-center gap-3"
              ref={dropdownRef}>
              <span className="text-sm text-[#6b6880]">{user.firstName}</span>
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#2d2b40] hover:border-violet-600 transition-colors cursor-pointer flex-shrink-0"
                  aria-label="Profile menu">
                  <img
                    src={user.photoUrl}
                    alt={user.firstName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.firstName + " " + user.lastName,
                      )}&background=6d28d9&color=fff`;
                    }}
                  />
                </button>

                {/* Dropdown */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#13121c] border border-[#2d2b40] rounded-xl shadow-xl overflow-hidden z-50">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-[#1e1d28]">
                      <p className="text-[13px] font-medium text-[#e8e6f0] truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[11px] text-[#4a4760] truncate mt-0.5">
                        {user.emailId}
                      </p>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                      <Link
                        to="/app/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#9b8ec4] hover:text-[#e8e6f0] hover:bg-[#1a1928] transition-colors no-underline">
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
                        Edit profile
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="py-1 border-t border-[#1e1d28]">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer bg-transparent border-none text-left">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#6b6880] hover:text-[#e8e6f0] rounded-lg hover:bg-[#13121c] transition-colors cursor-pointer bg-transparent border-none"
              aria-label="Toggle menu">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                {mobileMenuOpen ?
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                : <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="15" y2="18" />
                  </>
                }
              </svg>
            </button>
          </>
        )}
      </div>

      {/* ── Mobile menu (auth only) ── */}
      {user && mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1e1d28] bg-[#0d0c16] px-4 py-3">
          {/* User info */}
          <div className="flex items-center gap-3 px-2 py-3 mb-2 border-b border-[#1e1d28]">
            <img
              src={user.photoUrl}
              alt={user.firstName}
              className="w-9 h-9 rounded-full object-cover border border-[#2d2b40]"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.firstName + " " + user.lastName,
                )}&background=6d28d9&color=fff`;
              }}
            />
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-[#e8e6f0] truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[11px] text-[#4a4760] truncate">
                {user.emailId}
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-0.5 mb-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors no-underline ${
                  isActive(link.to) ?
                    "text-white bg-[#1a1928]"
                  : "text-[#6b6880] hover:text-[#e8e6f0] hover:bg-[#13121c]"
                }`}>
                {link.label}
              </Link>
            ))}
            <Link
              to="/app/profile"
              className="px-3 py-2.5 rounded-lg text-[13px] font-medium text-[#6b6880] hover:text-[#e8e6f0] hover:bg-[#13121c] transition-colors no-underline">
              Edit profile
            </Link>
          </nav>

          {/* Logout */}
          <div className="border-t border-[#1e1d28] pt-2">
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2.5 rounded-lg text-[13px] text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer bg-transparent border-none text-left">
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
