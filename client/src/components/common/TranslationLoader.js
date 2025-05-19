"use client"
import { useLanguage } from "../../context/LanguageContext"
import styled from "styled-components"

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--neutral-light);
`

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid var(--primary);
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-right: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const LoadingText = styled.div`
  font-size: 1.2rem;
  color: var(--primary);
`

const TranslationLoader = ({ children }) => {
  const { loading } = useLanguage()

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading translations...</LoadingText>
      </LoadingContainer>
    )
  }

  return <>{children}</>
}

export default TranslationLoader
