import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { likePost } from "./postsSlice";
import { unlikePost } from "./postsSlice";
import { AiOutlineLike } from "react-icons/ai";

export const LikeButton = ({ post }) => {
  const currentUserId = useSelector(state => state.user.currentUser._id);
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const isLiked = () => {
    return post.likes.includes(currentUserId);
  };

  const likePostByUser = async () => {
    setLoading(true);
    try {
      await dispatch(likePost({ postId: post._id, token }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const unlikePostUser = async () => {
    setLoading(true);
    try {
      await dispatch(unlikePost({ postId: post._id, token }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div
      className={`flex items-center mt-4 ${loading &&
        "animate-pulse pointer-events-none"}`}
    >
      <AiOutlineLike
        onClick={() => {
          isLiked() ? unlikePostUser() : likePostByUser();
        }}
        className={`text-2xl mr-1.5 cursor-pointer ${
          isLiked() ? "text-red-500" : "text-gray-700"
        }`}
      />
      <span>{post.likes.length} likes</span>
    </div>
  );
};
