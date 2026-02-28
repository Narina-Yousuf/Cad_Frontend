import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import type { Role } from "../../types/auth.types";

interface ProtectedRouteProps {
  allowedRole?: Role;
}

export const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  // 1. Prevent "Flash of Login Page" while app initializes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 2. If no token exists, redirect to signup but save the attempted location
  if (!token) {
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  // 3. If a specific role is required (e.g., DOCTOR) but user is a PATIENT
  if (allowedRole && user?.role !== allowedRole) {
    // Redirect to their respective correct dashboard instead of just "/"
    const fallbackPath =
      user?.role === "DOCTOR" ? "/doctor/dashboard" : "/patient/dashboard";
    return <Navigate to={fallbackPath} replace />;
  }

  // 4. Authorized: Render the requested page
  return <Outlet />;
};
