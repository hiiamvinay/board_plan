
import { Navigate } from "react-router-dom";
import { useAdmin } from "./AdminContext";

const AdminProtectedRoute = ({ children }) => {
  const { adminId } = useAdmin();

  if (!adminId) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;