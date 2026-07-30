import type { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AuthenticatedRoute: FC = () => {
  const { user } = useAuth();

  if (user === undefined) {
    return null;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default AuthenticatedRoute;
