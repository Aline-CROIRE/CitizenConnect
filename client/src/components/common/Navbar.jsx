import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { useAuth } from "../../context/AuthContext"
import { useLanguage } from "../../context/LanguageContext"
import LanguageSwitcher from "./LanguageSwitcher"

// Navbar container styles
const NavbarContainer = styled.nav.attrs({
  role: "navigation",
  "aria-label": "Main Navigation",
})`
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

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  display: flex;
  align-items: center;
  cursor: pointer;

  span {
    color: var(--secondary);
  }
`

const NavLinks = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
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

const NavItem = styled.div`
  margin: 0 1rem;
  color: var(--neutral-dark);
  font-weight: 500;
  cursor: pointer;

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

const UserName = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
  font-weight: 500;
  
  .user-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--primary-light);
    color: var(--primary);
    margin-right: 0.5rem;
    font-weight: bold;
  }
  
  .user-text {
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 768px) {
    margin: 0.5rem 0;
  }
`

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }
`

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  // Force a re-render when the component mounts to ensure navigation works
  useEffect(() => {
    console.log("Navbar mounted, navigation should be available")
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const navigateTo = (path) => {
    console.log(`Navigating to: ${path}`)
    setIsOpen(false)
    navigate(path)
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
        <Logo onClick={() => navigateTo("/")}>
          Citizen<span>Connect</span>
        </Logo>

        <MobileMenuButton onClick={toggleMenu} aria-label={isOpen ? t("closeMenu") : t("openMenu")}>
          ☰
        </MobileMenuButton>

        <NavLinks $isOpen={isOpen}>
          {isAuthenticated && user ? (
            <>
              <NavItem onClick={() => navigateTo(getDashboardLink())}>{t("nav.dashboard")}</NavItem>

              {user.role === "citizen" && (
                <>
                  <NavItem onClick={() => navigateTo("/citizen/submit-complaint")}>
                    {t("myComplaints.submitNew")}
                  </NavItem>
                  <NavItem onClick={() => navigateTo("/citizen/my-complaints")}>{t("myComplaints.title")}</NavItem>
                </>
              )}

              {user.role === "institution" && (
                <>
                  <NavItem onClick={() => navigateTo("/institution/complaints")}>{t("myComplaints.title")}</NavItem>
                  <NavItem onClick={() => navigateTo("/institution/profile")}>{t("register.update_profile")}</NavItem>
                </>
              )}

              {user.role === "admin" && (
                <>
                  <NavItem onClick={() => navigateTo("/admin/complaints")}>{t("myComplaints.title")}</NavItem>
                  <NavItem onClick={() => navigateTo("/admin/users")}>{t("admin.manage_users")}</NavItem>
                  <NavItem onClick={() => navigateTo("/admin/categories")}>{t("admin.manage_categories")}</NavItem>
                  <NavItem onClick={() => navigateTo("/admin/analytics")}>{t("admin.analytics")}</NavItem>
                </>
              )}

              <UserInfo>
                <UserName>
                  <div className="user-icon">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="user-text">{user.name}</div>
                </UserName>
                <NavActions>
                  <LanguageSwitcher />
                  <NavButton onClick={handleLogout}>{t("login.logout")}</NavButton>
                </NavActions>
              </UserInfo>
            </>
          ) : (
            <>
              <NavItem onClick={() => navigateTo("/")}>{t("home")}</NavItem>
              <NavItem onClick={() => navigateTo("/login")}>{t("login.title")}</NavItem>
              <NavActions>
                <LanguageSwitcher />
                <NavButton onClick={() => navigateTo("/register")}>{t("register.title")}</NavButton>
              </NavActions>
            </>
          )}
        </NavLinks>
      </NavbarContent>
    </NavbarContainer>
  )
}

export default Navbar
