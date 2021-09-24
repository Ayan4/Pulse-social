import { LikeButton } from "./LikeButton";
import { TimeAgo } from "./TimeAgo";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { AiOutlineDelete } from "react-icons/ai";
import { deletePost } from "./postsSlice";
import { useState } from "react";
import { CgSpinnerAlt } from "react-icons/cg";

export const PostItem = ({ post, from }) => {
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.user.currentUser);
  const profile = useSelector(state => state.user.userProfile);
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const deletePostHandler = async () => {
    setLoading(true);
    try {
      await dispatch(deletePost({ postId: post._id, token }));
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="shadow-md border rounded-md m-4 p-4 flex my-2 flex-col m-auto w-full">
      <div className="flex justify-between items-start">
        <div className="flex">
          <div className="w-16 h-16 border shadow mr-4 rounded-full overflow-hidden">
            <img
              src={
                from === "feed"
                  ? currentUser.userName === post.userId.userName
                    ? currentUser.photoUrl
                    : post.userId.photoUrl
                  : profile.photoUrl
              }
              alt="profile-pic"
            />
          </div>

          <div className="flex flex-col">
            <span
              className="font-semibold text-black text-lg cursor-pointer"
              onClick={() => navigate(`/users/${post.userId.userName}`)}
            >
              {from === "feed"
                ? currentUser.userName === post.userId.userName
                  ? currentUser.firstName
                  : post.userId.firstName
                : profile.firstName}{" "}
              {from === "feed"
                ? currentUser.userName === post.userId.userName
                  ? currentUser.lastName
                  : post.userId.lastName
                : profile.lastName}
            </span>
            <TimeAgo post={post} />
          </div>
        </div>
        {currentUser._id === post.userId._id && (
          <div>
            {loading ? (
              <CgSpinnerAlt className="animate-spin text-2xl text-gray-700" />
            ) : (
              <AiOutlineDelete
                onClick={deletePostHandler}
                className="text-gray-600 text-2xl cursor-pointer"
              />
            )}
          </div>
        )}
      </div>

      <div className="text-black text-lg mt-2 mb-3">{post.text}</div>

      {post.asset && post.asset.indexOf("video") > -1 && (
        <video controls>
          <source src={post.asset} type="video/mp4" />
          <source src={post.asset} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      )}
      {post.asset && post.asset.indexOf("image") > -1 && (
        <div className="overflow-hidden w-full max-h-96 border rounded-md bg-gray-100">
          <img className="h-full w-auto m-auto" src={post.asset} alt="post" />
        </div>
      )}
      <LikeButton post={post} />
    </div>
  );
};
