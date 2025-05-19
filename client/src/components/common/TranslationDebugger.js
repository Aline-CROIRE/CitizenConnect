import { useLanguage } from "../../context/LanguageContext"
import styled from "styled-components"

const DebugContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 12px;
  max-width: 300px;
  max-height: 300px;
  overflow: auto;
  z-index: 9999;
`

const TranslationDebugger = ({ show = false }) => {
  const { currentLanguage, t } = useLanguage()
  
  if (!show) return null
  
  // Test some common translation keys
  const testKeys = [
    "app_name",
    "login.title",
    "login.email",
    "register.title",
    "myComplaints.title",
    "complaint_form.title"
  ]
  
  return (
    <DebugContainer>
      <h4>Translation Debugger</h4>
      <p>Current language: {currentLanguage.name}</p>
      <ul>
        {testKeys.map(key => (
          <li key={key}>
            {key}: {t(key)}
          </li>
        ))}
      </ul>
    </DebugContainer>
  )
}

export default TranslationDebugger
