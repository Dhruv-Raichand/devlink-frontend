import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { toast, Flip } from "react-toastify";
import { useState, useEffect } from "react";

const NavBar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const notify = (msg) =>
    toast.success(msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      transition: Flip,
    });

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      notify("Logged Out Successfully!");
      dispatch(removeUser());
      setProfileMenuOpen(false);
      setMobileMenuOpen(false);
      return navigate("/login");
    } catch (err) {
      console.error(err.message);
      toast.error("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuOpen && !event.target.closest(".profile-dropdown")) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuOpen]);

  return (
    // CHANGED: Static instead of fixed, simplified design
    <nav className="relative z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimalist container with subtle backdrop */}
        <div className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-md border-b border-white/10 dark:border-gray-700/10 rounded-b-3xl">
          <div className="flex items-center justify-between h-20 px-6">
            {/* Logo - Simple text style */}
            <Link
              to="/"
              className="flex items-center gap-3 group"
              onClick={() => setMobileMenuOpen(false)}>
              {/* Simple icon placeholder */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
              </div>
              <span className="text-2xl font-bold text-white">DevLink</span>
            </Link>

            {user && (
              <>
                {/* Desktop Navigation - Minimal style */}
                <ul className="hidden md:flex gap-8">
                  <li>
                    <Link
                      to="/"
                      className="text-white/80 hover:text-white font-medium transition-all duration-300 text-lg">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/connections"
                      className="text-white/80 hover:text-white font-medium transition-all duration-300 text-lg">
                      Connections
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/requests"
                      className="text-white/80 hover:text-white font-medium transition-all duration-300 text-lg">
                      Requests
                    </Link>
                  </li>
                </ul>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                  {/* Desktop Profile */}
                  <div className="hidden sm:block profile-dropdown">
                    <div className="relative">
                      <button
                        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                        className="flex items-center gap-3 text-white/80 hover:text-white transition-all duration-300"
                        aria-label="Profile menu"
                        aria-expanded={profileMenuOpen}>
                        <span className="text-sm font-medium hidden lg:block">
                          {user.firstName}
                        </span>
                        <img
                          src={user.photoUrl}
                          alt={`${user.firstName}'s profile`}
                          className="w-10 h-10 rounded-full ring-2 ring-white/20 hover:ring-white/40 transition-all"
                          onError={(e) => {
                            e.target.src =
                              "https://ui-avatars.com/api/?name=" +
                              encodeURIComponent(
                                user.firstName + " " + user.lastName
                              ) +
                              "&background=5227ff&color=fff";
                          }}
                        />
                      </button>

                      {/* Desktop Profile Dropdown */}
                      {profileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl mb-2">
                            <img
                              src={user.photoUrl}
                              alt="Profile"
                              className="w-12 h-12 rounded-full"
                              onError={(e) => {
                                e.target.src =
                                  "https://ui-avatars.com/api/?name=" +
                                  encodeURIComponent(
                                    user.firstName + " " + user.lastName
                                  ) +
                                  "&background=5227ff&color=fff";
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 dark:text-white truncate">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {user.emailId}
                              </p>
                            </div>
                          </div>

                          <Link
                            to="/profile"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            Profile
                          </Link>

                          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="sm:hidden p-2 text-white/80 hover:text-white rounded-xl transition-colors"
                    aria-label="Toggle menu"
                    aria-expanded={mobileMenuOpen}>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      {mobileMenuOpen ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h7"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          {user && mobileMenuOpen && (
            <div className="md:hidden pb-4 px-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl mb-3">
                <img
                  src={user.photoUrl}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                  onError={(e) => {
                    e.target.src =
                      "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(user.firstName + " " + user.lastName) +
                      "&background=5227ff&color=fff";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-white/60 truncate">
                    {user.emailId}
                  </p>
                </div>
              </div>

              <nav
                className="flex flex-col gap-2"
                aria-label="Mobile navigation">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                  Home
                </Link>
                <Link
                  to="/connections"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                  Connections
                </Link>
                <Link
                  to="/requests"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                  Requests
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                  Profile
                </Link>

                <div className="border-t border-white/10 my-2"></div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl transition-all text-left">
                  Logout
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
