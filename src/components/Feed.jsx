import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((state) => state.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      console.log(res?.data?.data);
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      //TODO handle err
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return;

  if (feed.length <= 0)
    return (
      <h1 className="flex justify-center items-center my-10 text-xl">
        No User to show on your Feed!!!
      </h1>
    );

  return (
    feed && (
      <div className="flex justify-center">
        <UserCard user={feed[0]} />
      </div>
    )
  );
};

export default Feed;
