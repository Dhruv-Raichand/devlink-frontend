import { Link, useNavigate } from "react-router-dom";
import Theme from "./Theme";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { toast, Flip } from "react-toastify";

const NavBar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      notify("Logged Out Successfully!!!");
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="navbar bg-base-300 shadow-lg px-4 sm:px-6 lg:px-8 sticky top-0 z-50 flec justify-between">
      <div className="flex">
        <Link
          to="/"
          className="text-xl sm:text-2xl font-bold hover:text-primary transition-all duration-300">
          <div className="flex gap-2 items-center">
            <img src="/devlink.png" alt="" className="w-10" />
            DevLink
          </div>
        </Link>
      </div>

      {user && (
        <>
          <ul className="md:flex gap-10 mx-auto hidden">
            <li>
              <Link
                to="/"
                className="hover:text-primary cursor-pointer text-lg hover:font-semibold transition-all duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/connections"
                className="hover:text-primary cursor-pointer text-lg hover:font-semibold transition-all duration-300">
                Connections
              </Link>
            </li>
            <li>
              <Link
                to="/requests"
                className="hover:text-primary cursor-pointer text-lg hover:font-semibold transition-all duration-300">
                Requests
              </Link>
            </li>
          </ul>
          <div className="flex gap-2 sm:gap-4 items-center">
            {/* Mobile Menu - Visible on small screens */}
            <div className="dropdown dropdown-end sm:hidden">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-64 p-3 shadow-xl border">
                <li className="mb-2">
                  <div className="flex items-center gap-3 p-2 bg-base-200 rounded-lg">
                    <div className="avatar">
                      <div className="w-8 rounded-full">
                        <img src={user.photoUrl} alt="Profile" />
                      </div>
                    </div>
                    <span className="text-sm font-medium truncate">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="justify-between hover:bg-primary hover:text-primary-content">
                    Profile
                    <span className="badge badge-primary badge-sm">New</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/connections"
                    className="hover:bg-primary hover:text-primary-content">
                    Connections
                  </Link>
                </li>
                <li>
                  <Link
                    to="/requests"
                    className="hover:bg-primary hover:text-primary-content">
                    Requests
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    role="button"
                    onClick={handleLogout}
                    className="text-error hover:bg-error hover:text-error-content">
                    Logout
                  </a>
                </li>
              </ul>
            </div>

            {/* Desktop Menu - Hidden on small screens */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="hidden md:block text-sm lg:text-base">
                Welcome,{" "}
                <span className="font-semibold">{user.firstName}!</span>
              </div>

              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar hover:ring-2 hover:ring-primary transition-all duration-300">
                  <div className="w-10 rounded-full ring-2 ring-base-content ring-opacity-20">
                    <img
                      alt="Profile"
                      src={user.photoUrl}
                      className="rounded-full"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/40x40?text=User";
                      }}
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-64 p-3 shadow-xl border">
                  <li className="mb-2">
                    <div className="flex items-center gap-3 p-2 bg-base-200 rounded-lg pointer-events-none">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img src={user.photoUrl} alt="Profile" />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-xs opacity-60">
                          {user.emailId}
                        </span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="justify-between hover:bg-primary hover:text-primary-content">
                      Profile
                      <span className="badge badge-primary badge-sm">New</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/connections"
                      className="hover:bg-primary hover:text-primary-content">
                      Connections
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/requests"
                      className="hover:bg-primary hover:text-primary-content">
                      Requests
                    </Link>
                  </li>
                  <li className="mt-2 pt-2 border-t border-base-300">
                    <a
                      href="#"
                      role="button"
                      onClick={handleLogout}
                      className="text-error hover:bg-error hover:text-error-content cursor-pointer">
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NavBar;
