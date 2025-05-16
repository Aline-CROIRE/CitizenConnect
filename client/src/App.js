"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import styled from "styled-components"

// Public Pages
import HomePage from "./components/pages/public/HomePage"
import LoginPage from "./components/pages/public/LoginPage"
import RegisterPage from "./components/pages/public/RegisterPage"

// Citizen Pages
import CitizenDashboard from "./components/pages/citizen/CitizenDashboard.jsx"
// import SubmitComplaint from "./pages/citizen/SubmitComplaint"
// import MyComplaints from "./pages/citizen/MyComplaints"
// import ComplaintDetails from "./pages/citizen/ComplaintDetails"

// Institution Pages
// import InstitutionDashboard from "./pages/institution/InstitutionDashboard"
// import IncomingComplaints from "./pages/institution/IncomingComplaints"
// import RespondPage from "./pages/institution/RespondPage"
// import InstitutionProfile from "./pages/institution/InstitutionProfile"

// Admin Pages
// import AdminDashboard from "./pages/admin/AdminDashboard"
// import ComplaintsMonitor from "./pages/admin/ComplaintsMonitor"
// import ManageUsers from "./pages/admin/ManageUsers"
// import ManageCategories from "./pages/admin/ManageCategories"
// import Analytics from "./pages/admin/Analytics"

// Components
import Navbar from "./components/common/Navbar"
import Footer from "./components/common/Footer"
import GlobalStyle from "./styles/GlobalStyles"

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const ContentContainer = styled.main`
  flex: 1;
  padding-top: 80px; // Account for fixed navbar
  padding-bottom: 40px;
`

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated || !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalStyle />
        <AppContainer>
          <Navbar />
          <ContentContainer>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Citizen Routes */}
              <Route
                path="/citizen/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["citizen"]}>
                    <CitizenDashboard />
                  </ProtectedRoute>
                }
              />
             

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </ContentContainer>
          <Footer />
        </AppContainer>
      </Router>
    </AuthProvider>
  )
}

export default App
