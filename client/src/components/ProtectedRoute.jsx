"use client"

import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({ role }) => {
  const { isAuthenticated, currentUser, loading } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />
  }

  // Redirect to appropriate dashboard if role doesn't match
  if (role && currentUser.role !== role) {
    switch (currentUser.role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />
      case "institution":
        return <Navigate to="/institution/dashboard" replace />
      default:
        return <Navigate to="/citizen/dashboard" replace />
    }
  }

  // Render child routes
  return <Outlet />
}

export default ProtectedRoute
