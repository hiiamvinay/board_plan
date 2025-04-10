import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { userId } = useUser();

  if (!userId) {
    // Redirect to login if there's no userId
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;