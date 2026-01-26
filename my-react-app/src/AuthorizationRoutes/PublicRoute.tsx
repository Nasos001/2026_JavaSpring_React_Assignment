// PublicRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import type { JSX } from "react";

export function PublicRoute({ children }: { children: JSX.Element }) {
  const { authenticated, role, loading } = useAuth();

  if (loading) return null; // or spinner

  // If logged in → redirect based on role
  if (authenticated) {
    if (role == "NOT_DETERMINED") {
      return <Navigate to="/unknownHome" replace />;
    }
    
    return <Navigate to="/HomePage" replace />;
  }

  // Not authenticated → allow access
  return children;
}
