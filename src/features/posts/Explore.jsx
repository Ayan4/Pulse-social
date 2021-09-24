import React from "react";
import { FaUserFriends } from "react-icons/fa";
import { useNavigate } from "react-router";

function Explore({ users }) {
  const navigate = useNavigate();

  return (
    <div className="border shadow rounded">
      <div className="flex w-full items-center border-b py-2 px-4">
        <FaUserFriends className="text-gray-600 text-xl" />
        <p className="text-lg text-gray-600 font-semibold ml-2">Explore</p>
      </div>
      {users.map(item => (
        <div
          onClick={() => navigate(`/users/${item.userName}`)}
          key={item._id}
          className="flex items-start border-b border-gray-300 p-4 pl-3 hover:bg-gray-100 cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full overflow-hidden mr-3">
            <img
              className="round-img img-size-xs img-margin"
              src={item.photoUrl}
              alt="profile-pic"
            />
          </div>

          <div>
            <div className="font-semibold text-lg">
              {item.firstName} {item.lastName}
            </div>
            <div className="text-sm">@{item.userName}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Explore;
