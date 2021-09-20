import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutButtonClicked } from "../features/auth/authSlice";
import { SearchBar } from "../features/users/SearchBar";
// import logo from "../assets/logo.png";
import { useState } from "react";
import { Sidebar } from "./Sidebar";

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
    <div className="nav navbar-height border-b border-gray-300 flex justify-between py-4 px-2 sticky top-0 bg-white">
      <Link to="/">
        <p className="">Pulse Social</p>
      </Link>

      <SearchBar />

      <div className="border border-green-500 flex justify-between w-1/6">
        {!token ? (
          <Link to="/login">Login</Link>
        ) : (
          <div onClick={() => logout()} className="cursor-pointer">
            logout
          </div>
        )}

        {loggedInUserStatus === "succeeded" && (
          <img
            className="rounded-full w-8 h-8 border cursor-pointer"
            onClick={() => navigate(`/users/${loggedInUserData.userName}`)}
            src={loggedInUserData.photoUrl}
            alt="profile-pic"
          />
        )}

        <div
          className={"cursor-pointer"}
          onClick={() => navigate(`/notification`)}
        >
          notifications
        </div>
      </div>

      <div
        className="mobile-menu margin-right relative-position"
        onClick={() => setSidebarOpen(prevState => !prevState)}
      >
        <span className="material-icons-outlined icon-size-36 cursor-pointer">
          menu
        </span>
      </div>
      {isSidebarOpen && <Sidebar logout={logout} closeSideBar={closeSideBar} />}
    </div>
  );
};
