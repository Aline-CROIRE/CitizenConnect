"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { useAuth } from "../../context/AuthContext"

const NavbarContainer = styled.nav`
  background-color: white;
  box-shadow: var(--shadow);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
`

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  display: flex;
  align-items: center;
  
  span {
    color: var(--secondary);
  }
`

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    flex-direction: column;
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background-color: white;
    box-shadow: var(--shadow);
    padding: 1rem;
  }
`

const NavLink = styled(Link)`
  margin: 0 1rem;
  color: var(--neutral-dark);
  font-weight: 500;
  
  &:hover {
    color: var(--primary);
  }
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
  }
`

const NavButton = styled.button`
  background-color: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--primary-light);
  }
  
  @media (max-width: 768px) {
    margin-top: 0.5rem;
    width: 100%;
  }
`

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const UserName = styled.span`
  margin-right: 1rem;
  font-weight: 500;
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
  }
`

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const getDashboardLink = () => {
    if (!user) return "/"

    switch (user.role) {
      case "citizen":
        return "/citizen/dashboard"
      case "institution":
        return "/institution/dashboard"
      case "admin":
        return "/admin/dashboard"
      default:
        return "/"
    }
  }

  return (
    <NavbarContainer>
      <NavbarContent>
        <Logo to="/">
          Citizen<span>Connect</span>
        </Logo>

        <MobileMenuButton onClick={toggleMenu}>☰</MobileMenuButton>

        <NavLinks isOpen={isOpen}>
          {isAuthenticated ? (
            <>
              <NavLink to={getDashboardLink()}>Dashboard</NavLink>

              {user.role === "citizen" && (
                <>
                  <NavLink to="/citizen/submit-complaint">Submit Complaint</NavLink>
                  <NavLink to="/citizen/my-complaints">My Complaints</NavLink>
                </>
              )}

              {user.role === "institution" && (
                <>
                  <NavLink to="/institution/complaints">Complaints</NavLink>
                  <NavLink to="/institution/profile">Profile</NavLink>
                </>
              )}

              {user.role === "admin" && (
                <>
                  <NavLink to="/admin/complaints">Complaints</NavLink>
                  <NavLink to="/admin/users">Users</NavLink>
                  <NavLink to="/admin/categories">Categories</NavLink>
                  <NavLink to="/admin/analytics">Analytics</NavLink>
                </>
              )}

              <UserInfo>
                <UserName>Hello, {user.name}</UserName>
                <NavButton onClick={handleLogout}>Logout</NavButton>
              </UserInfo>
            </>
          ) : (
            <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/login">Login</NavLink>
              <NavButton as={Link} to="/register">
                Register
              </NavButton>
            </>
          )}
        </NavLinks>
      </NavbarContent>
    </NavbarContainer>
  )
}

export default Navbar
