import ReactModal from "react-modal";
import { FiEdit } from "react-icons/fi";
import { AiOutlineCamera } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { updateUserProfile } from "../users/userSlice";
import { API_STATUS } from "../../constants";

ReactModal.setAppElement("#root");

function EditProfileModal({ modal, setModal }) {
  const token = useSelector(state => state.auth.token);
  const profile = useSelector(state => state.user.currentUser);
  const updateStatus = useSelector(state => state.user.profileUpdateStatus);
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [photoUrl, setPhotoUrl] = useState(profile.photoUrl);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [websiteLink, setWebsiteLink] = useState(profile.websiteLink);
  const dispatch = useDispatch();

  const saveDetails = () => {
    dispatch(
      updateUserProfile({
        details: { firstName, lastName, photoUrl, bio, location, websiteLink },
        token
      })
    );
  };

  const uploadImage = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: "ayan4",
        uploadPreset: "scjlror3",
        cropping: true,
        multiple: false
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          const url = `https://res.cloudinary.com/ayan4/${result.info.path}`;
          setPhotoUrl(url);
        }
      }
    );
  };

  return (
    <div>
      <ReactModal
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.5)" } }}
        className="border border-white-1 max-w-md bg-white font-poppins rounded-lg relative inset-1/2 transform -translate-x-2/4 -translate-y-1/2 w-3/4"
        isOpen={modal}
        onRequestClose={() => setModal(false)}
      >
        <div className="py-2">
          <div className="flex items-center px-2.5 pb-2 border-b border-white-1">
            <FiEdit className="text-2xl mr-2" />
            <p className="text-black-1 text-lg">Edit Profile</p>
          </div>

          <form
            onSubmit={async e => {
              e.preventDefault();
              await saveDetails();
              setModal(prevState => !prevState);
            }}
            className="py-2 px-4 flex flex-col items-center"
          >
            <div
              onClick={uploadImage}
              className="rounded-full w-32 h-32 group overflow-hidden border shadow relative transition-all cursor-pointer hover:opacity-80"
            >
              <img className="" src={photoUrl} alt="profile-pic"></img>
              <AiOutlineCamera className="absolute text-white inset-1/2 transform -translate-x-2/4 -translate-y-1/2 text-4xl transition-all group-hover:text-black" />
            </div>

            <div class="flex flex-col w-full mb-2">
              <label htmlFor="First Name" className="font-semibold mb-1.5">
                First Name
              </label>
              <input
                type="text"
                className="border-2 border-gray-400 rounded pl-1"
                value={firstName}
                autoFocus={true}
                onChange={e => setFirstName(e.target.value)}
              />
            </div>
            <div class="flex flex-col w-full mb-2">
              <label htmlFor="password" className="font-semibold mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                className="border-2 border-gray-400 rounded pl-1"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </div>

            <div class="flex flex-col w-full mb-2">
              <label htmlFor="password" className="font-semibold mb-1.5">
                Bio
              </label>
              <textarea
                type="text"
                autoCapitalize="sentences"
                autoComplete="on"
                autoCorrect="on"
                maxLength="160"
                spellCheck="true"
                className="border rounded border-gray-400 resize-none outline-none p-1"
                value={bio}
                onChange={e => setBio(e.target.value)}
              />
            </div>

            <div class="flex-col flex w-full mb-2">
              <label htmlFor="password" className="font-semibold mb-1.5">
                Location
              </label>
              <input
                type="text"
                className="border-2 border-gray-400 rounded pl-1"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>

            <div class="flex-col flex w-full mb-2">
              <label htmlFor="password" className="font-semibold mb-1.5">
                Website Link
              </label>
              <input
                type="text"
                className="border-2 border-gray-400 rounded pl-1"
                value={websiteLink}
                onChange={e => setWebsiteLink(e.target.value)}
              />
            </div>

            {updateStatus === API_STATUS.LOADING ? (
              <div className="loader" />
            ) : (
              <div className="w-2/4">
                <button
                  type="submit"
                  className="bg-primary py-1 px-6 w-full mt-4 rounded text-white text-sm font-semibold"
                >
                  Save
                </button>
              </div>
            )}
          </form>
        </div>
      </ReactModal>
    </div>
  );
}

export default EditProfileModal;
