import { useNavigate } from "react-router";
import { API_STATUS } from "../../constants";
import { CgSpinnerAlt } from "react-icons/cg";

export const UsersListDropDown = ({ searchResults, status, closeDropDown }) => {
  const navigate = useNavigate();

  if (status === API_STATUS.LOADING) {
    return <CgSpinnerAlt className="text-4xl animate-spin" />;
  }
  if (status === API_STATUS.IDLE) {
    return <p className="text-gray-500">Search Result</p>;
  }

  if (searchResults.length === 0 || status === "success") {
    return <p>No User Found</p>;
  }

  return (
    <div className="autocomplete border border-red-500">
      {searchResults.length > 0 &&
        searchResults.map(user => {
          return (
            <div
              key={user._id}
              className="border-bottom gray-border autocomplete-item cursor-pointer"
              onClick={() => {
                closeDropDown();
                navigate(`/users/${user.userName}`);
              }}
            >
              <div className="flex-horizontal margint-top padding-all">
                <div>
                  <img
                    className="round-img img-size-xs img-margin"
                    src={user.photoUrl}
                    alt="profile-pic"
                  />
                </div>

                <div>
                  <div className="font-bold-1">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="font-size-5 ">@{user.userName}</div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};
