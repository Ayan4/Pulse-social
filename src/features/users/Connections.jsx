import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchConnections,
  followUser,
  unFollowUser,
  connectionsReset
} from "./userSlice";
import { CgSpinnerAlt } from "react-icons/cg";

export const Connections = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const token = useSelector(state => state.auth.token);
  const currentUser = useSelector(state => state.user.currentUser);
  const connectionsList = useSelector(state => state.user.connections);
  const connectionsStatus = useSelector(state => state.user.connectionsStatus);

  const dispatch = useDispatch();

  const isUserInFollowingList = id => {
    return currentUser.following?.includes(id);
  };

  const page = location.pathname.split("/")[3];

  useEffect(() => {
    dispatch(fetchConnections({ pathname: location.pathname, token }));
    return () => {
      dispatch(connectionsReset());
    };
  }, [dispatch, token, location]);

  const handleConnectionAction = userId => {
    isUserInFollowingList(userId)
      ? dispatch(
          unFollowUser({
            profileUserId: userId,
            currentUserId: currentUser._id,
            token
          })
        )
      : dispatch(
          followUser({
            profileUserId: userId,
            currentUserId: currentUser._id,
            token
          })
        );
  };
  return (
    <div className="flex flex-col items-center w-full mx-2 sm:w-2/4 my-8 mx-auto px-2">
      <div className="w-full">
        <button
          className={`rounded w-1/2 py-1.5 font-semibold ${
            page === "followers" ? "bg-primary text-white" : "bg-gray-100"
          }`}
          onClick={() => navigate(`/users/${currentUser.userName}/followers`)}
        >
          Followers
        </button>
        <button
          className={`rounded w-1/2 py-1.5 font-semibold ${
            page === "following" ? "bg-primary text-white" : "bg-gray-100"
          }`}
          onClick={() => navigate(`/users/${currentUser.userName}/following`)}
        >
          Following
        </button>
      </div>

      {connectionsStatus === "loading" && (
        <CgSpinnerAlt className="text-4xl mt-16 animate-spin text-primary" />
      )}

      {connectionsStatus === "succeeded" && (
        <div className="mt-7 w-full">
          {connectionsList.map(user => {
            return (
              <div
                key={user._id}
                className="flex border rounded shadow my-2 p-4"
              >
                <div>
                  <div className="w-24 h-24 mr-2 rounded-full overflow-hidden">
                    <img src={user.photoUrl} alt="profile-pic" />
                  </div>
                </div>

                <div className="flex justify-between items-start w-full">
                  <div className="font-semibold flex text-lg flex-col ml-4">
                    {user.firstName} {user.lastName}{" "}
                    <span className="text-gray-600 font-normal text-base">
                      @{user.userName}
                    </span>
                  </div>

                  {currentUser.userName !== user.userName && (
                    <button
                      className={
                        isUserInFollowingList(user._id)
                          ? "bg-primary text-white rounded font-semibold px-3 py-1"
                          : "border-2 border-primary rounded font-semibold text-primary px-3 py-1"
                      }
                      onClick={() => {
                        handleConnectionAction(user._id);
                      }}
                    >
                      {isUserInFollowingList(user._id) ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
