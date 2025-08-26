import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { ToastContainer, toast } from "react-toastify";

const ProfileEdit = ({ user }) => {
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [about, setAbout] = useState(user?.about);
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl);
  const [age, setAge] = useState(user?.age);
  const [gender, setGender] = useState(user?.gender);

  const notify = (msg) => toast(msg);

  const dispatch = useDispatch();

  const handleProfileEdit = async () => {
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          about,
          photoUrl,
          age,
          gender,
        },
        { withCredentials: true }
      );
      notify("Profile Updated Successfully !");
      dispatch(addUser(res.data.data));
    } catch (err) {
      notify(err.response.data);
      console.error(err.message);
    }
  };

  return (
    <div className="flex justify-center gap-8">
      <ToastContainer />
      <div className="card bg-base-300 shadow-sm my-13">
        <div className="card-body flex flex-col justify-center items-center ">
          <h2 className="card-title">Profile Edit</h2>
          <div className="min-w-80">
            <fieldset className="fieldset w-full my-2">
              <legend className="fieldset-legend">First Name</legend>
              <input
                type="text"
                className="input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Type here"
              />
            </fieldset>
            <fieldset className="fieldset w-full my-2">
              <legend className="fieldset-legend">Last Name</legend>
              <input
                type="text"
                className="input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Type here"
              />
            </fieldset>
            <fieldset className="fieldset w-full my-2">
              <legend className="fieldset-legend">About</legend>
              <input
                type="text"
                className="input"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Type here"
              />
            </fieldset>
            <fieldset className="fieldset w-full my-2">
              <legend className="fieldset-legend">Photo Url</legend>
              <input
                type="text"
                className="input"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="Type here"
              />
            </fieldset>
            <fieldset className="fieldset w-full my-2">
              <legend className="fieldset-legend">Age</legend>
              <input
                type="text"
                className="input"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Type here"
              />
            </fieldset>
            <fieldset className="fieldset w-full my-2">
              <legend className="fieldset-legend">Gender</legend>
              <input
                type="text"
                className="input"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                placeholder="Type here"
              />
            </fieldset>
          </div>
          <div className="card-actions justify-center">
            <button className="btn btn-primary m-2" onClick={handleProfileEdit}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
      <UserCard user={{ firstName, lastName, about, photoUrl, age, gender }} />
    </div>
  );
};

export default ProfileEdit;
