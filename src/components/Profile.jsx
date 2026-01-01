import ProfileEdit from "./ProfileEdit";
import { useSelector } from "react-redux";
import { useSilk } from "../context/SilkContext";
import { useEffect } from "react";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const { setPageColor } = useSilk();

  useEffect(() => {
    setPageColor("#6366f1");
    return () => setPageColor(null);
  }, []);

  // Loading state
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          {/* Loading Spinner */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Loading Profile...
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Please wait while we fetch your information
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProfileEdit user={user} />
    </div>
  );
};

export default Profile;
