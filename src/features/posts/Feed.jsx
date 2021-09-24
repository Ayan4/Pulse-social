import { CreatePost } from "./CreatePost";
import { PostsList } from "./PostsList";
import { useEffect } from "react";
import { ImSpinner8 } from "react-icons/im";
import { fetchFeed } from "./postsSlice";
import { fetchAllUsers } from "../users/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { API_STATUS } from "../../constants";
import Explore from "./Explore";

export const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector(state => state.posts.feed);
  const users = useSelector(state => state.user.allUsers);
  const token = useSelector(state => state.auth.token);
  const feedStatus = useSelector(state => state.posts.feedStatus);

  useEffect(() => {
    if (feedStatus === API_STATUS.IDLE) {
      dispatch(fetchFeed(token));
      dispatch(fetchAllUsers(token));
    }
  }, [token, dispatch, feedStatus]);

  if (feedStatus === API_STATUS.LOADING) {
    return (
      <ImSpinner8 className="animate-spin text-4xl mt-28 mx-auto text-primary" />
    );
  }

  return (
    <div className="mt-4 flex justify-center m-auto w-full px-2">
      <div className="w-2/5 mr-4 max-w-sm hidden sm:block">
        <Explore users={users} />
      </div>
      <div className="sm:w-3/5 w-full max-w-2xl">
        <CreatePost />
        <PostsList posts={feed} />
      </div>
    </div>
  );
};
