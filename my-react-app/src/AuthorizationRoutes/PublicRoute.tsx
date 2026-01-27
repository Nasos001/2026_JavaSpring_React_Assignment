// Imports
// ============================================================================================================================================
import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import type { JSX } from "react";

// Main Component
// ============================================================================================================================================
export function PublicRoute({ children }: { children: JSX.Element }) {
  // Retrieve Auth
  const { authenticated, role, loading } = useAuth();

  // If loading, do nothing
  if (loading) return null; // or spinner

  // If logged in, redirect based on role
  if (authenticated) {
    if (role == "NOT_DETERMINED") {
      return <Navigate to="/unknownHome" replace />;
    }
    
    return <Navigate to="/HomePage" replace />;
  }

  // If not logged in, render component
  return children;
}
