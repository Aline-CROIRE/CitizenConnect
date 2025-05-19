"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../../context/AuthContext"
import { useLanguage } from "../../../context/LanguageContext"
import styled from "styled-components"

// Styled components
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--neutral-light, #f5f5f5);
`

const LoginFormContainer = styled.div`
  background-color: white;
  border-radius: var(--radius-lg, 8px);
  box-shadow: var(--shadow, 0 4px 6px rgba(0, 0, 0, 0.1));
  padding: 2rem;
  width: 100%;
  max-width: 500px;
`

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary, #3b82f6);
`

// Use transient prop $active here
const RoleSelector = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`

const RoleButton = styled.button`
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  background-color: ${({ $active }) => ($active ? "var(--primary, #3b82f6)" : "white")};
  color: ${({ $active }) => ($active ? "white" : "var(--primary, #3b82f6)")};
  border: 1px solid var(--primary, #3b82f6);
  border-radius: var(--radius, 4px);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ $active }) => ($active ? "var(--primary-light, #60a5fa)" : "var(--neutral-light, #f5f5f5)")};
  }
`

const ErrorMessage = styled.div`
  color: var(--accent, #ef4444);
  margin-bottom: 1rem;
  text-align: center;
  padding: 0.75rem;
  background-color: rgba(239, 68, 44, 0.1);
  border-radius: var(--radius, 4px);
  border-left: 4px solid var(--accent, #ef4444);
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--gray-light, #d1d5db);
    border-radius: var(--radius, 4px);
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: var(--primary, #3b82f6);
    }
  }
`

const LoginButton = styled.button`
  width: 100%;
  background-color: var(--primary, #3b82f6);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: var(--radius, 4px);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--primary-light, #60a5fa);
  }

  &:disabled {
    background-color: var(--gray, #9ca3af);
    cursor: not-allowed;
  }
`

const RegisterLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;

  a {
    color: var(--primary, #3b82f6);
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("citizen")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated, currentUser } = useAuth()
  const navigate = useNavigate()
  const { t } = useLanguage()

  // Use ref to prevent multiple redirects and infinite loops
  const hasRedirected = useRef(false)

  useEffect(() => {
    if (isAuthenticated && currentUser?.role && !hasRedirected.current) {
      hasRedirected.current = true
      redirectBasedOnRole(currentUser.role)
    }
  }, [isAuthenticated, currentUser])

  const redirectBasedOnRole = (role) => {
    switch (role) {
      case "admin":
        navigate("/admin/dashboard")
        break
      case "institution":
        navigate("/institution/dashboard")
        break
      default:
        navigate("/citizen/dashboard")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!email || !password) {
      setError(t("login.fillAllFields"))
      setLoading(false)
      return
    }

    try {
      const success = await login(email, password, role)

      if (!success) {
        setError(t("login.failed"))
      }
      // Redirect handled in useEffect
    } catch (err) {
      console.error("Login error:", err)

      if (err.response && err.response.data) {
        if (err.response.data.error === "Account pending approval") {
          setError(t("login.pendingApproval"))
        } else if (err.response.data.error === "Role mismatch") {
          setError(t("login.roleMismatch"))
        } else {
          setError(err.response.data.message || t("login.failed"))
        }
      } else if (err.message) {
        setError(err.message)
      } else {
        setError(t("login.failed"))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoginContainer>
      <LoginFormContainer>
        <Title>{t("login.title")}</Title>

        <RoleSelector>
          <RoleButton type="button" $active={role === "citizen"} onClick={() => setRole("citizen")}>
            {t("roles.citizen")}
          </RoleButton>
          <RoleButton type="button" $active={role === "institution"} onClick={() => setRole("institution")}>
            {t("roles.institution")}
          </RoleButton>
          <RoleButton type="button" $active={role === "admin"} onClick={() => setRole("admin")}>
            {t("roles.admin")}
          </RoleButton>
        </RoleSelector>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="email">{t("login.email")}</label>
            <input
              type="email"
              id="email"
              placeholder={t("login.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="password">{t("login.password")}</label>
            <input
              type="password"
              id="password"
              placeholder={t("login.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>

          <LoginButton type="submit" disabled={loading}>
            {loading ? t("login.loggingIn") : t("login.loginButton")}
          </LoginButton>
        </form>

        <RegisterLink>
          {t("login.noAccount")} <Link to="/register">{t("login.registerHere")}</Link>
        </RegisterLink>
      </LoginFormContainer>
    </LoginContainer>
  )
}

export default LoginPage
