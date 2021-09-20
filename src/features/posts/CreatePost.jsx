import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "./postsSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { API_STATUS } from "../../constants";
import { MdPermMedia } from "react-icons/md";
import { BiPaperPlane } from "react-icons/bi";

export const CreatePost = () => {
  const [text, setText] = useState("");

  const dispatch = useDispatch();
  const [uploadedAsset, setUploadedAsset] = useState(null);

  const token = useSelector(state => state.auth.token);
  const currentUser = useSelector(state => state.user.currentUser);
  const status = useSelector(state => state.posts.addStatus);
  // const error = useSelector(state => state.posts.error);

  const createPost = async e => {
    try {
      e.preventDefault();
      const resultAction = await dispatch(
        addPost({
          text,
          token,
          asset: uploadedAsset ? uploadedAsset.secure_url : undefined
        })
      );
      unwrapResult(resultAction);
      setText("");
      setUploadedAsset(null);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = () => {
    window.cloudinary.openUploadWidget(
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
  };

  return (
    <section className="shadow-md border flex justify-between xs:p-4 p-2 mx-auto rounded-lg w-full">
      <div className="xs:w-24 xs:h-20 w-16 h-14 border shadow xs:mr-4 mr-2 rounded-full overflow-hidden">
        <img src={currentUser.photoUrl} alt="DP" />
      </div>

      <form onSubmit={createPost} className="flex-column w-full">
        <textarea
          className="border-b-2 border-gray-300 resize-none outline-none p-2 mb-4 w-full text-xl font-semibold placeholder-gray-400"
          placeholder="What's Happening?"
          onChange={e => setText(e.target.value)}
          value={text}
        ></textarea>

        <div className="flex justify-between">
          <button
            type="button"
            className="flex items-center"
            onClick={uploadImage}
          >
            <MdPermMedia className="text-3xl text-primary mr-1.5" />
            <p className="font-semibold text-primary">Share Media</p>
          </button>

          {status === API_STATUS.LOADING ? (
            <div className="loader" />
          ) : (
            <button
              className="bg-primary py-1.5 px-2.5 rounded text-white flex items-center"
              disabled={text.length === 0 || status === API_STATUS.LOADING}
              type="submit"
            >
              <p className="font-semibold">POST</p>
              <BiPaperPlane className="text-lg mt-1 ml-1" />
            </button>
          )}
        </div>
      </form>

      {uploadedAsset && (
        <img src={uploadedAsset?.thumbnail_url} alt="uploaded" />
      )}
    </section>
  );
};
