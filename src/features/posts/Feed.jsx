import { CreatePost } from "./CreatePost";
import { PostsList } from "./PostsList";
import { useEffect } from "react";
import { ImSpinner8 } from "react-icons/im";
import { fetchFeed } from "./postsSlice";
import { useDispatch, useSelector } from "react-redux";
import { API_STATUS } from "../../constants";

export const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector(state => state.posts.feed);
  const token = useSelector(state => state.auth.token);
  const feedStatus = useSelector(state => state.posts.feedStatus);

  useEffect(() => {
    if (feedStatus === API_STATUS.IDLE) {
      dispatch(fetchFeed(token));
    }
  }, [token, dispatch, feedStatus]);

  if (feedStatus === API_STATUS.LOADING) {
    return <ImSpinner8 className="animate-spin text-4xl mt-28 mx-auto" />;
  }

  return (
    <div className="mt-4 flex flex-col m-auto sm:w-3/4 lg:w-2/4 w-full px-2 max-w-2xl">
      <CreatePost />
      <PostsList posts={feed} />
    </div>
  );
};
