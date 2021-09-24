import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "./userSlice";
import { userProfileReset } from "./userSlice";
import { userPostsReset } from "../posts/postsSlice";
import { useNavigate, useParams } from "react-router-dom";
import { followUser, unFollowUser } from "./userSlice";
import { fetchPostsOfUser } from "../posts/postsSlice";
import { PostsList } from "../posts/PostsList";
import EditProfileModal from "../modals/EditProfileModal";
import { API_STATUS } from "../../constants";
import { ImSpinner8 } from "react-icons/im";
import { MdDateRange } from "react-icons/md";
import { RiMapPinLine } from "react-icons/ri";
import { AiOutlineLink } from "react-icons/ai";
import { CgSpinnerAlt } from "react-icons/cg";

export const UserProfile = () => {
  const status = useSelector(state => state.user.userProfileStatus);
  const postStatus = useSelector(state => state.posts.userProfilePostsStatus);
  const userPosts = useSelector(state => state.posts.userPosts);
  const profile = useSelector(state => state.user.userProfile);
  const followStatus = useSelector(state => state.user.followStatus);
  const unfollowStatus = useSelector(state => state.user.unfollowStatus);
  const currentUser = useSelector(state => state.user.currentUser);
  const token = useSelector(state => state.auth.token);
  const [modal, setModal] = useState(false);
  const { userName } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserProfile({ userName, token }));
    return () => {
      dispatch(userProfileReset());
    };
  }, [dispatch, userName, token]);

  useEffect(() => {
    dispatch(fetchPostsOfUser({ userName, token }));
    return () => {
      dispatch(userPostsReset());
    };
  }, [dispatch, userName, token]);

  const isUserInFollowingList = () => {
    return currentUser.following?.includes(profile._id);
  };

  const handleConnectionAction = () => {
    if (isUserInFollowingList()) {
      dispatch(
        unFollowUser({
          profileUserId: profile._id,
          currentUserId: currentUser._id,
          token
        })
      );
    } else {
      dispatch(
        followUser({
          profileUserId: profile._id,
          currentUserId: currentUser._id,
          token
        })
      );
    }
  };

  if (status === API_STATUS.LOADING) {
    return (
      <ImSpinner8 className="animate-spin text-4xl mt-28 mx-auto text-primary" />
    );
  }
  const createdAt = profile.createdAt;
  const date = new Date(createdAt).toDateString();

  return (
    <div className="flex flex-col items-center w-full m-auto sm:w-3/4 lg:w-2/4 max-w-2xl px-2">
      <EditProfileModal modal={modal} setModal={setModal} />
      <div className="flex p-4 py-5 m-4 w-full shadow border rounded">
        <div>
          <div className="rounded-full w-24 h-24 sm:w-32 sm:h-32 overflow-hidden border shadow">
            <img src={profile.photoUrl} alt="profile-pic" />
          </div>
        </div>

        <div className="ml-6 w-full">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-2xl font-semibold">
                {profile.firstName} {profile.lastName}
              </p>
              <p className="text-base text-gray-600">@{profile.userName}</p>
            </div>

            {currentUser.userName === userName && (
              <button
                onClick={() => setModal(true)}
                className="px-2 py-1 text-primary text-sm font-semibold border border-primary rounded transition-all hover:opacity-70"
              >
                Edit Profile
              </button>
            )}
            {followStatus === "loading" || unfollowStatus === "loading" ? (
              <CgSpinnerAlt className="text-2xl animate-spin text-primary mr-5" />
            ) : (
              currentUser.userName !== userName && (
                <button
                  className="py-0.5 px-2 text-white font-semibold bg-primary rounded-md"
                  onClick={handleConnectionAction}
                >
                  {isUserInFollowingList() ? "Following" : "Follow"}
                </button>
              )
            )}
          </div>

          <div className="flex">
            <div
              className="cursor-pointer mr-4"
              onClick={() => navigate(`/users/${profile.userName}/followers`)}
            >
              <div className="font-bold-1">
                <span className="font-semibold mr-1">
                  {profile.followers?.length}
                </span>
                Followers
              </div>
            </div>

            <div
              className="cursor-pointer"
              onClick={() => navigate(`/users/${profile.userName}/following`)}
            >
              <div>
                <span className="font-semibold mr-1">
                  {profile.following?.length}
                </span>
                Following
              </div>
            </div>
          </div>

          <div className="my-3">{profile.bio}</div>

          {profile.websiteLink?.length > 0 && (
            <div className="flex items-center text-gray-600 mb-2">
              <AiOutlineLink className="mt-0.5 mr-1 text-lg" />
              <a
                className="hover:text-blue-400"
                href={profile.websiteLink}
                target="_blank"
                rel="noreferrer"
              >
                {profile.websiteLink}
              </a>
            </div>
          )}

          <div className="flex">
            {profile.location?.length > 0 && (
              <div className="flex items-center mr-4 text-gray-600">
                <RiMapPinLine className="mt-0.5 mr-1 text-lg" />
                {profile.location}
              </div>
            )}

            <div className="flex items-center text-gray-600">
              <MdDateRange className="text-lg mr-1" />
              {date}
            </div>
          </div>
        </div>
      </div>

      {postStatus === "succeeded" && (
        <div className="w-full">
          <PostsList posts={userPosts} />
        </div>
      )}
    </div>
  );
};
