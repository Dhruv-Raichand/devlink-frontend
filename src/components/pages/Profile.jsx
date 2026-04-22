import ProfileEdit from "./ProfileEdit";
import { useSelector } from "react-redux";
import LoadingSpinner from "../ui/LoadingSpinner";

const Profile = () => {
  const user = useSelector((state) => state.user);
  if (!user) return <LoadingSpinner message="Loading profile..." />;
  return <ProfileEdit user={user} />;
};

export default Profile;
