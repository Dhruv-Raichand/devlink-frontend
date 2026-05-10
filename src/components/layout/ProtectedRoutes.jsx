// ProtectedRoutes.jsx
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { isOnboardingComplete } from "../../hooks/useOnboarding";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  const location = useLocation();

  if (!user) return <Navigate to="/" />;

  if (location.pathname === "/app/onboarding" && isOnboardingComplete(user)) {
    return <Navigate to="/app" />;
  }

  if (location.pathname !== "/app/onboarding" && !isOnboardingComplete(user)) {
    return <Navigate to="/app/onboarding" />;
  }

  return children;
};

export default ProtectedRoute;
