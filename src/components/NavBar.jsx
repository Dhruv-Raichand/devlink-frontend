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
              className="group flex items-center gap-1 group justify-center"
              onClick={() => setMobileMenuOpen(false)}>
              <svg
                fill="currentColor"
                stroke="currentColor"
                className="w-8 h-7 transition-colors group-hover:text-purple-500"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 398.47 398.47"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                enable-background="new 0 0 398.468 398.468"
                stroke-width="0.00398468">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path d="m369.662,28.812c-18.578-18.578-43.314-28.81-69.653-28.812-0.003,0-0.005,0-0.008,0-26.336,0-51.071,10.23-69.646,28.805l-82.738,82.739c-6.124,6.124-11.376,12.99-15.658,20.418-7.428,4.282-14.291,9.531-20.411,15.652l-82.739,82.739c-38.408,38.409-38.408,100.905 0,139.314 19.203,19.202 44.422,28.803 69.647,28.802 25.225-0.001 50.456-9.604 69.661-28.809l82.737-82.739c6.116-6.115 11.364-12.978 15.647-20.409 7.431-4.283 14.298-9.536 20.423-15.661l82.738-82.739c38.405-38.405 38.405-100.895-5.68434e-14-139.3zm-212.152,330.24c-32.563,32.56-85.541,32.563-118.095,0.007-32.561-32.561-32.561-85.541 0-118.101l82.739-82.739c5.63-5.63 11.988-10.401 18.903-14.182 20.166-11.043 44.313-13.258 66.254-6.076 12.511,4.094 23.594,10.91 32.942,20.258 8.275,8.275 14.557,17.899 18.721,28.655l-18.014,18.014c-3.335,3.335-7.232,5.871-11.514,7.529-1.081-11.048-5.912-21.421-13.941-29.449-10.499-10.499-25.017-15.556-39.803-13.873-10.852,1.225-21.08,6.152-28.802,13.873l-82.738,82.739c-18.913,18.914-18.913,49.689 0,68.603 9.147,9.147 21.324,14.184 34.291,14.184 0.003,0 0.006,0 0.009,0 12.968-0.002 25.148-5.042 34.298-14.191l58.208-58.208c8.607,2.373 17.448,3.559 26.272,3.559 7.463,0 14.909-0.85 22.183-2.517l-81.913,81.915zm112.894-183.606c-4.8-10.303-11.342-19.632-19.543-27.833-8.197-8.197-17.53-14.74-27.844-19.547l53.3-53.299c6.313-6.314 14.724-9.791 23.684-9.791 0.002,0 0.005,0 0.006,0 8.962,0.001 17.376,3.481 23.693,9.798 6.315,6.316 9.794,14.728 9.794,23.688 0,8.96-3.479,17.372-9.795,23.688l-53.295,53.296zm-65.504,18.129c5.702,5.702 9.064,13.121 9.677,21.001-7.879-0.616-15.297-3.98-20.998-9.681-5.698-5.699-9.063-13.117-9.683-21.001 7.882,0.618 15.303,3.981 21.004,9.681zm-76.83,29.44c4.807,10.314 11.351,19.646 19.548,27.843 8.201,8.201 17.531,14.744 27.831,19.543l-53.295,53.296c-6.316,6.317-14.73,9.796-23.693,9.798-0.002,0-0.003,0-0.006,0-8.959,0-17.371-3.477-23.684-9.791-13.065-13.066-13.065-34.325 0-47.39l53.299-53.299zm230.985-65.509l-82.738,82.739c-5.634,5.635-11.995,10.408-18.911,14.189-20.168,11.046-44.313,13.258-66.251,6.067-12.494-4.08-23.574-10.893-32.931-20.249-8.269-8.268-14.552-17.896-18.726-28.665l18.011-18.012c3.336-3.337 7.234-5.872 11.516-7.529 1.087,11.054 5.92,21.429 13.947,29.456 9.173,9.173 21.399,14.191 34.205,14.191 1.853,0 3.72-0.105 5.589-0.318 10.856-1.233 21.085-6.163 28.802-13.88l82.738-82.739c9.149-9.149 14.188-21.328 14.188-34.295 0-12.966-5.039-25.146-14.188-34.294-9.149-9.149-21.329-14.189-34.297-14.191-0.003,0-0.006,0-0.009,0-12.966,0-25.145,5.037-34.291,14.184l-58.204,58.203c-15.891-4.376-32.591-4.669-48.464-1.032l81.92-81.92c15.743-15.742 36.709-24.411 59.04-24.411 0.001,0 0.005,0 0.007,0 22.332,0.002 43.303,8.674 59.047,24.419 32.557,32.557 32.557,85.53 5.68434e-14,118.087z"></path>{" "}
                </g>
              </svg>

              <span className="text-2xl font-bold text-white transition-colors group-hover:text-purple-500">
                DevLink
              </span>
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
                      {mobileMenuOpen ?
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      : <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h7"
                        />
                      }
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
