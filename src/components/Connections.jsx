import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((state) => state.connection);

  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      console.log(res?.data?.data);
      dispatch(addConnection(res?.data?.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  return (
    <div className="flex flex-col items-center my-12">
      <h1 className="text-3xl font-bold my-6">Connections</h1>
      {connections && (
        <div className="flex w-8/12 justify-center items-center flex-wrap gap-8">
          {connections.map((connection) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } =
              connection;
            return (
              <div
                key={_id}
                className="w-5/12 bg-base-300 flex items-center p-4 rounded-2xl my-2">
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Connections;
