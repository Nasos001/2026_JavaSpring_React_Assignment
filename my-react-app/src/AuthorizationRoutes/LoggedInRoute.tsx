// Imports
// ============================================================================================================================================
import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import type { JSX } from "react";

// Main Component
// ============================================================================================================================================
export function LoggedInRoute({children,allowedRoles}: {children: JSX.Element; allowedRoles?: string[];}) {

  // Retrieve Auth
  const { authenticated, role, loading } = useAuth();

  // If loading, don't do anything
  if (loading) return null; 

  // If the user is not logged in, redirect to login
  if (!authenticated) return <Navigate to="/login" replace />;

  // If they are, but they don't have the required role, redirect to their home
  if (allowedRoles && !allowedRoles.includes(role!)) {
    if (role == "NOT_DETERMINED") {
      return <Navigate to="/unknownHome" replace />;
    }

    return <Navigate to="/home" replace />;
  }

  // If they are logged in and have the correct role, render the component
  return children;
}
