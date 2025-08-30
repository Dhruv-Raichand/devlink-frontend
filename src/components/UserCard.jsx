import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const sendRequest = async (status, userId) => {
    try {
      const res = axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      console.log(res);
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="my-13 card bg-base-300 w-96 shadow-sm">
      <figure>
        <img src={user?.photoUrl} alt="avatar" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {user?.firstName} {user?.lastName}
        </h2>
        {user?.age && user?.gender && (
          <p>
            {user?.age}, {user?.gender}
          </p>
        )}
        <p>{user?.about}</p>
        <div className="card-actions justify-around">
          <button
            className="btn btn-primary"
            onClick={() => sendRequest("ignored", user._id)}>
            Ignore
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => sendRequest("interested", user._id)}>
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
