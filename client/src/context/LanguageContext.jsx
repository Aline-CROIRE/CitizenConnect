import { createContext, useState, useContext, useEffect } from "react"

// Create context
const LanguageContext = createContext(null)

// Default translations
const translations = {
  en: {
    home: "Home",
    dashboard: "Dashboard",
    login: {
      title: "Login",
      logout: "Logout"
    },
    register: {
      title: "Register",
      update_profile: "Update Profile"
    },
    myComplaints: {
      title: "My Complaints",
      submitNew: "Submit New Complaint"
    },
    admin: {
      manage_users: "Manage Users",
      manage_categories: "Manage Categories",
      analytics: "Analytics"
    },
    common: {
      hello: "Hello"
    },
    closeMenu: "Close Menu",
    openMenu: "Open Menu"
  },
  es: {
    home: "Inicio",
    dashboard: "Panel",
    login: {
      title: "Iniciar Sesión",
      logout: "Cerrar Sesión"
    },
    register: {
      title: "Registrarse",
      update_profile: "Actualizar Perfil"
    },
    myComplaints: {
      title: "Mis Quejas",
      submitNew: "Enviar Nueva Queja"
    },
    admin: {
      manage_users: "Administrar Usuarios",
      manage_categories: "Administrar Categorías",
      analytics: "Análisis"
    },
    common: {
      hello: "Hola"
    },
    closeMenu: "Cerrar Menú",
    openMenu: "Abrir Menú"
  }
}

// Language definitions
const languageDefinitions = {
  en: { code: "en", name: "English" },
  es: { code: "es", name: "Español" }
}

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [currentLanguageCode, setCurrentLanguageCode] = useState(() => {
    // Try to get the language from localStorage
    const savedLanguage = localStorage.getItem("language")
    return savedLanguage || "en" // Default to English
  })

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem("language", currentLanguageCode)
  }, [currentLanguageCode])

  // Function to change the language
  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setCurrentLanguageCode(lang)
    }
  }

  // Translation function
  const t = (key) => {
    const keys = key.split(".")
    let value = translations[currentLanguageCode]
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k]
      } else {
        // Fallback to English if translation is missing
        let fallback = translations["en"]
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk]
          } else {
            return key // Return the key if no translation found
          }
        }
        return typeof fallback === 'object' ? key : fallback
      }
    }
    
    // If the result is an object, return the key instead
    return typeof value === 'object' ? key : value
  }

  // Context value
  const value = {
    currentLanguage: languageDefinitions[currentLanguageCode],
    languages: languageDefinitions,
    changeLanguage,
    t
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}