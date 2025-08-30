import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.request);
  const [error, setError] = useState("");

  const reviewRequest = async (status, requestId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + requestId,
        {},
        { withCredentials: true }
      );
      console.log(res?.data?.data);
      dispatch(removeRequest(res?.data?.data?._id));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      console.log(res?.data?.data);
      dispatch(addRequest(res?.data?.data));
    } catch (err) {
      setError(err?.response?.data?.message);
      console.error(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-20">Requests</h1>
      {error && <h2 className="text-2xl m-4 text-center">{error}</h2>}
      {requests && (
        <div className="flex flex-col items-center my-4">
          {requests.map((request) => {
            const { _id, firstName, lastName, about, photoUrl, age, gender } =
              request.fromUserId;
            return (
              <div
                key={_id}
                className="w-5/12 bg-base-300 flex items-center p-4 rounded-2xl my-2 relative">
                <div className="">
                  <img
                    src={photoUrl}
                    className="w-20 rounded-full m-2"
                    alt="profile"
                  />
                </div>
                <div className="px-4">
                  <h2 className="text-xl">{firstName + " " + lastName}</h2>
                  {age && gender && <p>{age + ", " + gender}</p>}
                  <p>{about}</p>
                </div>
                <div className="right-8 absolute">
                  <button
                    className="btn btn-primary mx-3 text-lg py-6 px-6"
                    onClick={() => reviewRequest("rejected", request._id)}>
                    Reject
                  </button>
                  <button
                    className="btn btn-secondary mx-3 text-lg py-6 px-6"
                    onClick={() => reviewRequest("accepted", request._id)}>
                    Accept
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Requests;
