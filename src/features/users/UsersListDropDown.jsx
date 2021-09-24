import { useNavigate } from "react-router";
import { API_STATUS } from "../../constants";
import { CgSpinnerAlt } from "react-icons/cg";

export const UsersListDropDown = ({ searchResults, status, closeDropDown }) => {
  const navigate = useNavigate();

  if (status === API_STATUS.LOADING) {
    return (
      <div className="py-4 flex justify-center">
        <CgSpinnerAlt className="text-4xl animate-spin text-primary" />
      </div>
    );
  }
  if (status === API_STATUS.IDLE) {
    return (
      <div className="flex justify-center">
        <p className="text-gray-400 text-lg font-semibold py-6">
          Search Result
        </p>
      </div>
    );
  }

  if (searchResults.length === 0 || status === "success") {
    return (
      <div className="flex justify-center">
        <p className="text-gray-400 text-lg font-semibold py-6">
          No User Found
        </p>
      </div>
    );
  }

  return (
    <div className="rounded bg-white">
      {searchResults.length > 0 &&
        searchResults.map(user => {
          return (
            <div
              key={user._id}
              className="cursor-pointer"
              onClick={() => {
                closeDropDown();
                navigate(`/users/${user.userName}`);
              }}
            >
              <div className="flex items-start border-b border-gray-300 p-4 pl-3 hover:bg-gray-100">
                <div className="w-14 h-14 rounded-full overflow-hidden mr-3">
                  <img
                    className="round-img img-size-xs img-margin"
                    src={user.photoUrl}
                    alt="profile-pic"
                  />
                </div>

                <div>
                  <div className="font-semibold text-lg">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm">@{user.userName}</div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};
