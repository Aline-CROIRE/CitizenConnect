"use client"

import { createContext, useState, useContext, useEffect } from "react"
import api from "../Services/api"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          setLoading(false)
          return
        }

        // Set token in axios headers
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`

        // Verify token and get user data
        const response = await api.get("/api/auth/me")

        if (response.data.user) {
          setUser(response.data.user)
          setIsAuthenticated(true)
        }
      } catch (err) {
        console.error("Auth check error:", err)
        localStorage.removeItem("token")
        api.defaults.headers.common["Authorization"] = ""
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      setError(null)
      const response = await api.post("/api/auth/login", { email, password })

      const { token, user } = response.data

      // Save token to localStorage
      localStorage.setItem("token", token)

      // Set token in axios headers
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setUser(user)
      setIsAuthenticated(true)

      return user
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      throw err
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      setError(null)
      const response = await api.post("/api/auth/register", userData)

      const { token, user } = response.data

      // Save token to localStorage
      localStorage.setItem("token", token)

      // Set token in axios headers
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setUser(user)
      setIsAuthenticated(true)

      return user
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
      throw err
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("token")
    api.defaults.headers.common["Authorization"] = ""
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
