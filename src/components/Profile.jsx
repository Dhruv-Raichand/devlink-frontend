import ProfileEdit from "./ProfileEdit";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.user);

  return (
    <div>
      <ProfileEdit user={user} />
    </div>
  );
};

export default Profile;
