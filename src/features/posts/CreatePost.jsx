import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "./postsSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { API_STATUS } from "../../constants";
import { MdPermMedia } from "react-icons/md";
import { BiPaperPlane } from "react-icons/bi";
import { CgSpinnerAlt } from "react-icons/cg";

export const CreatePost = () => {
  const [text, setText] = useState("");

  const dispatch = useDispatch();
  const [uploadedAsset, setUploadedAsset] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = useSelector(state => state.auth.token);
  const currentUser = useSelector(state => state.user.currentUser);
  const status = useSelector(state => state.posts.addStatus);

  const createPost = async e => {
    setLoading(true);
    try {
      e.preventDefault();
      const resultAction = await dispatch(
        addPost({
          text,
          token,
          asset: uploadedAsset ? uploadedAsset.secure_url : undefined
        })
      );
      setLoading(false);
      unwrapResult(resultAction);
      setText("");
      setUploadedAsset(null);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const uploadImage = async () => {
    try {
      await window.cloudinary.openUploadWidget(
        {
          cloudName: "ayan4",
          uploadPreset: "scjlror3",
          cropping: true,
          multiple: false,
          maxVideoFileSize: 5000000
        },
        (error, result) => {
          if (error) {
            console.log(error);
          }
          if (!error && result && result.event === "success") {
            setUploadedAsset(result.info);
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="shadow-md border flex justify-between xs:p-4 p-2 mx-auto rounded-lg w-full">
      <div className="xs:w-24 xs:h-20 w-16 h-14 border shadow xs:mr-4 mr-2 rounded-full overflow-hidden">
        <img src={currentUser.photoUrl} alt="DP" />
      </div>

      <form onSubmit={createPost} className="flex flex-col items-start w-full">
        <textarea
          className="border-b-2 border-gray-300 resize-none outline-none p-2 mb-4 w-full text-xl font-semibold placeholder-gray-400"
          placeholder="What's Happening?"
          onChange={e => setText(e.target.value)}
          value={text}
        ></textarea>

        {uploadedAsset && (
          <div className="border mb-4 overflow-hidden p-2 rounded bg-gray-100">
            <img src={uploadedAsset?.thumbnail_url} alt="uploaded" />
          </div>
        )}

        <div className="flex justify-between w-full">
          <button
            type="button"
            className="flex items-center"
            onClick={uploadImage}
            disabled={loading}
          >
            <MdPermMedia className="text-3xl text-primary mr-1.5" />
            <p className="font-semibold text-primary">Share Media</p>
          </button>

          {status === API_STATUS.LOADING ? (
            <CgSpinnerAlt className="text-primary text-3xl animate-spin mr-4" />
          ) : (
            <button
              className="bg-primary py-1 px-2.5 rounded text-white flex items-center"
              disabled={text.length === 0 || status === API_STATUS.LOADING}
              type="submit"
            >
              <p className="font-semibold">Post</p>
              <BiPaperPlane className="text-lg mt-1 ml-1" />
            </button>
          )}
        </div>
      </form>
    </section>
  );
};
