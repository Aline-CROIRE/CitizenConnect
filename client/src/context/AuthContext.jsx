import { createContext, useState, useContext, useEffect } from "react"
import api from "../services/api"

// Create context
const AuthContext = createContext(null)

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")
        const userData = localStorage.getItem("user")

        if (token && userData) {
          // Set auth header
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`

          // Set user data from localStorage
          const user = JSON.parse(userData)
          setCurrentUser(user)
          setIsAuthenticated(true)
        } else if (token) {
          try {
            // Fetch user data from API
            const res = await api.get("/api/auth/me")
            if (res.data && res.data.user) {
              setCurrentUser(res.data.user)
              setIsAuthenticated(true)
              localStorage.setItem("user", JSON.stringify(res.data.user))
              localStorage.setItem("role", res.data.user.role)
              localStorage.setItem("isApproved", res.data.user.isApproved || "false")
            }
          } catch (error) {
            console.error("Failed to fetch user data:", error)
            localStorage.removeItem("token")
            delete api.defaults.headers.common["Authorization"]
          }
        }
      } catch (err) {
        console.error("Auth check error:", err)
        // Clear all auth data on error
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("role")
        localStorage.removeItem("isApproved")
        delete api.defaults.headers.common["Authorization"]
      } finally {
        setLoading(false)
        setAuthChecked(true)
      }
    }

    checkLoggedIn()
  }, [])

  // Register a new user
  const register = async (userData) => {
    try {
      const res = await api.post("/api/auth/register", userData)

      if (res.data && res.data.success) {
        const { token, user } = res.data

        // Store auth data
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("role", user.role)
        localStorage.setItem("isApproved", user.isApproved || "false")

        // Set auth header
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`

        // Update state
        setCurrentUser(user)
        setIsAuthenticated(true)

        return {
          success: true,
          user,
        }
      } else {
        return {
          success: false,
          message: res.data?.message || "Registration failed",
        }
      }
    } catch (error) {
      console.error("Registration error:", error)
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      }
    }
  }

  // Login a user
  const login = async (email, password, selectedRole) => {
    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
        role: selectedRole,
      })

      if (res.data && res.data.success) {
        const { token, user } = res.data

        if (user.role !== selectedRole) {
          throw new Error("Role mismatch. Please select the correct role.")
        }

        // Store auth data
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("role", user.role)
        localStorage.setItem("isApproved", user.isApproved || "false")

        // Set auth header
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`

        // Update state
        setCurrentUser(user)
        setIsAuthenticated(true)

        return true
      } else {
        return false
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  // Logout a user
  const logout = () => {
    // Clear all auth data
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("role")
    localStorage.removeItem("isApproved")

    // Remove auth header
    delete api.defaults.headers.common["Authorization"]

    // Reset state
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const res = await api.put("/api/users/update-profile", userData)

      if (res.data && res.data.success) {
        // Update local storage
        localStorage.setItem("user", JSON.stringify(res.data.user))

        // Update state
        setCurrentUser(res.data.user)

        return res.data.user
      }

      return null
    } catch (error) {
      console.error("Update profile error:", error)
      throw error
    }
  }

  // Context value
  const value = {
    currentUser,
    user: currentUser, // Add alias for backward compatibility
    loading,
    authChecked,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
