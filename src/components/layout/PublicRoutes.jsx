import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const user = useSelector((state) => state.user);

  const onboardingDone = localStorage.getItem("onboarding_complete") === "true";

  if (user) {
    return <Navigate to={onboardingDone ? "/app" : "/app/onboarding"} />;
  }

  return children;
};

export default PublicRoute;
