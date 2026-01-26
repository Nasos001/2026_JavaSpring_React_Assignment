// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import type { JSX } from "react";

export function LoggedInRoute({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles?: string[];
}) {
  const { authenticated, role, loading } = useAuth();

  if (loading) return null; 

  if (!authenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role!)) {
    if (role == "NOT_DETERMINED") {
      return <Navigate to="/unknownHome" replace />;
    }

    return <Navigate to="/home" replace />;
  }

  return children;
}
