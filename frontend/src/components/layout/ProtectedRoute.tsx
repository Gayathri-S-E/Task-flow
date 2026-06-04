import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { getProfileApi } from "../../api/user";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (token && !user) {
      getProfileApi()
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          logout();
        });
    }
  }, [token, user, setUser, logout]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (token && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-950">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
