import { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { useLanguage } from "../../context/LanguageContext"

const SwitcherContainer = styled.div`
  position: relative;
  display: inline-block;
`

const CurrentLanguage = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid var(--gray-light);
  border-radius: var(--radius);
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  color: var(--neutral-dark);
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--neutral-light);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`

const LanguageOptions = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.25rem;
  background-color: white;
  border-radius: var(--radius);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 150px;
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  overflow: hidden;
`

const LanguageOption = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  border: none;
  background: ${({ $isActive }) => ($isActive ? "var(--neutral-light)" : "transparent")};
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--neutral-light);
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid var(--gray-light);
  }
`

const LanguageSwitcher = () => {
  const { currentLanguage, languages, changeLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode)
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <SwitcherContainer ref={ref}>
      <CurrentLanguage onClick={toggleDropdown}>
        {currentLanguage.name}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </CurrentLanguage>

      <LanguageOptions $isOpen={isOpen}>
        {Object.values(languages).map((language) => (
          <LanguageOption
            key={language.code}
            $isActive={currentLanguage.code === language.code}
            onClick={() => handleLanguageChange(language.code)}
          >
            {language.name}
          </LanguageOption>
        ))}
      </LanguageOptions>
    </SwitcherContainer>
  )
}

export default LanguageSwitcher
