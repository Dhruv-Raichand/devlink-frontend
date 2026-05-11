import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { isOnboardingComplete } from "../../hooks/useOnboarding";

const PublicRoute = ({ children }) => {
  const user = useSelector((state) => state.user);

  if (user) {
    return (
      <Navigate to={isOnboardingComplete(user) ? "/app" : "/app/onboarding"} />
    );
  }

  return children;
};

export default PublicRoute;
