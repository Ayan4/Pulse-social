import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutButtonClicked } from "../features/auth/authSlice";
import { SearchBar } from "../features/users/SearchBar";
import logo from "../assets/pulse-logo.svg";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { RiNotificationLine } from "react-icons/ri";
import { FiHome } from "react-icons/fi";
import { BiMenuAltRight } from "react-icons/bi";

export const Navbar = () => {
  const token = useSelector(state => state.auth.token);
  const loggedInUserData = useSelector(state => state.user.currentUser);

  const loggedInUserStatus = useSelector(
    state => state.user.currentUserDataStatus
  );
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeSideBar = () => {
    setSidebarOpen(false);
  };
  const logout = () => {
    localStorage?.removeItem("login");
    navigate("/login");
    dispatch(logoutButtonClicked());
  };

  return (
    <div className="flex justify-between items-center py-4 sm:px-6 px-3 sticky top-0 bg-secondary">
      <Link className="flex items-center" to="/">
        <img className="w-8 mr-1.5" src={logo} alt="logo" />
        <p className="text-primary text-2xl font-semibold hidden sm:block">
          Pulse Social
        </p>
      </Link>

      <SearchBar />

      <div className="flex justify-between items-center">
        <FiHome
          onClick={() => navigate("/")}
          className="cursor-pointer text-3xl text-gray-200 mx-3 hidden sm:block"
        />

        <RiNotificationLine
          className="cursor-pointer text-3xl text-gray-200 mx-3 hidden sm:block"
          onClick={() => navigate(`/notification`)}
        />

        {loggedInUserStatus === "succeeded" && (
          <div className="rounded-full w-10 h-10 cursor-pointer mx-3 sm:mx-3 overflow-hidden">
            <img
              onClick={() => navigate(`/users/${loggedInUserData.userName}`)}
              src={loggedInUserData.photoUrl}
              alt="profile-pic"
            />
          </div>
        )}

        {!token ? (
          <Link to="/login">Login</Link>
        ) : (
          <button
            onClick={logout}
            className="cursor-pointer hidden sm:block text-gray-200 border-gray-200 hover:text-gray-400 text-sm py-1 px-2 border hover:border-gray-400 font-semibold transition-all rounded ml-3"
          >
            logout
          </button>
        )}
      </div>

      <div
        className="sm:hidden relative"
        onClick={() => setSidebarOpen(prevState => !prevState)}
      >
        <BiMenuAltRight className="text-4xl text-white cursor-pointer" />
        <div className="absolute top-12 right-0">
          {isSidebarOpen && (
            <Sidebar logout={logout} closeSideBar={closeSideBar} />
          )}
        </div>
      </div>
    </div>
  );
};
