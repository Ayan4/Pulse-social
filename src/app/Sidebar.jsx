import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const Sidebar = ({ logout, closeSideBar }) => {
  const loggedInUserData = useSelector(state => state.user.currentUser);
  const token = useSelector(state => state.auth.token);
  const navigate = useNavigate();
  return (
    <div className="border border-gray-300 w-32 rounded shadow-lg overflow-hidden">
      <div
        className="border-b border-gray-300 py-1 px-2 text-sm text-gray-600 cursor-pointer bg-white hover:opacity-60"
        onClick={() => {
          closeSideBar();
          navigate(`/users/${loggedInUserData.userName}`);
        }}
      >
        My profile
      </div>
      <div
        className="border-b border-gray-300 py-1 px-2 text-sm text-gray-600 cursor-pointer transition-all bg-white hover:bg-gray-200"
        onClick={() => {
          closeSideBar();
          navigate(`/notification`);
        }}
      >
        Notification
      </div>
      <div
        className="border-b border-gray-300 py-1 px-2 text-sm text-gray-600 cursor-pointer transition-all bg-white hover:bg-gray-200"
        onClick={() => {
          token ? logout() : navigate("/login");
        }}
      >
        {token ? "Logout" : "Login"}
      </div>
    </div>
  );
};
