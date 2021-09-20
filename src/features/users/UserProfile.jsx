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

export const UserProfile = () => {
  const status = useSelector(state => state.user.userProfileStatus);
  const postStatus = useSelector(state => state.posts.userProfilePostsStatus);
  const userPosts = useSelector(state => state.posts.userPosts);
  const profile = useSelector(state => state.user.userProfile);
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
    isUserInFollowingList()
      ? dispatch(
          unFollowUser({
            profileUserId: profile._id,
            currentUserId: currentUser._id,
            token
          })
        )
      : dispatch(
          followUser({
            profileUserId: profile._id,
            currentUserId: currentUser._id,
            token
          })
        );
  };

  if (status === API_STATUS.LOADING) {
    return <ImSpinner8 className="animate-spin text-4xl mt-28 mx-auto" />;
  }
  const createdAt = profile.createdAt;
  const date = new Date(createdAt).toDateString();

  return (
    <div className="flex flex-col items-center w-full m-auto sm:w-3/4 lg:w-2/4 max-w-2xl">
      <EditProfileModal modal={modal} setModal={setModal} />
      <div className="flex p-4 m-4 w-full shadow border rounded">
        <div>
          <div className="rounded-full w-32 h-32 overflow-hidden border shadow">
            <img src={profile.photoUrl} alt="profile-pic" />
          </div>
        </div>

        <div className="ml-6 w-full">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-2xl font-semibold">
                {profile.firstName} {profile.lastName}
              </p>
              <p className="text-lg">{profile.userName}</p>
            </div>

            {currentUser.userName === userName && (
              <button
                onClick={() => setModal(true)}
                className="px-2 py-0.5 text-primary text-xs font-semibold border border-primary rounded"
              >
                Edit Profile
              </button>
            )}
            {currentUser.userName !== userName && (
              <button
                className="py-0.5 px-2 text-primary font-semibold bg-primary rounded-md"
                onClick={handleConnectionAction}
              >
                {isUserInFollowingList() ? "Following" : "Follow"}
              </button>
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
        <div>
          <PostsList posts={userPosts} />
        </div>
      )}
    </div>
  );
};
