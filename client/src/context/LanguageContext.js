"use client"

import { createContext, useState, useContext, useEffect } from "react"

// Define available languages
const languages = {
  en: {
    code: "en",
    name: "English",
    direction: "ltr",
  },
  rw: {
    code: "rw",
    name: "Kinyarwanda",
    direction: "ltr",
  },
  fr: {
    code: "fr",
    name: "Français",
    direction: "ltr",
  },
}

const LanguageContext = createContext()

export const useLanguage = () => useContext(LanguageContext)

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(languages.en)
  const [translations, setTranslations] = useState({})
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  // Function to change language
  const changeLanguage = async (languageCode) => {
    if (!languages[languageCode]) return

    try {
      setLoading(true)
      // Load translations for the selected language
      const translationModule = await import(`../translations/${languageCode}.json`)
      setTranslations(translationModule.default)
      setCurrentLanguage(languages[languageCode])

      // Save language preference to localStorage
      localStorage.setItem("preferredLanguage", languageCode)

      // Set HTML lang attribute
      document.documentElement.lang = languageCode
      document.documentElement.dir = languages[languageCode].direction
    } catch (error) {
      console.error("Failed to load translations:", error)
    } finally {
      setLoading(false)
    }
  }

  // Translate function
  const t = (key) => {
    if (!translations) return key

    // Handle nested keys with dot notation (e.g., "complaint_form.title")
    const keys = key.split(".")
    let value = translations

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        // Try alternative key formats
        // For example, if "complaint_form.title" is not found, try "submit_complaint.title"
        if (keys.length === 2 && keys[0] === "complaint_form") {
          const alternativeKey = "submit_complaint." + keys[1]
          const altKeys = alternativeKey.split(".")
          let altValue = translations
          
          for (const ak of altKeys) {
            if (altValue && typeof altValue === "object" && ak in altValue) {
              altValue = altValue[ak]
            } else {
              console.warn(`Translation key "${key}" and alternative "${alternativeKey}" not found.`)
              return key
            }
          }
          
          return altValue
        }
        
        // Try myComplaints vs my_complaints
        if (keys.length === 2 && keys[0] === "myComplaints") {
          const alternativeKey = "my_complaints." + keys[1]
          const altKeys = alternativeKey.split(".")
          let altValue = translations
          
          for (const ak of altKeys) {
            if (altValue && typeof altValue === "object" && ak in altValue) {
              altValue = altValue[ak]
            } else {
              console.warn(`Translation key "${key}" and alternative "${alternativeKey}" not found.`)
              return key
            }
          }
          
          return altValue
        }
        
        console.warn(`Translation key "${key}" not found.`)
        return key
      }
    }

    return value
  }

  // Initialize language from localStorage or browser preference
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        setIsLoading(true)
        // Check localStorage first
        const savedLanguage = localStorage.getItem("preferredLanguage")

        // If no saved preference, check browser language
        const browserLanguage = navigator.language.split("-")[0]

        // Default to English if neither is available or supported
        const languageToUse =
          savedLanguage && languages[savedLanguage]
            ? savedLanguage
            : browserLanguage && languages[browserLanguage]
              ? browserLanguage
              : "en"

        await changeLanguage(languageToUse)
      } catch (error) {
        console.error("Failed to initialize language:", error)
        // Fallback to English
        const translationModule = await import(`../translations/en.json`)
        setTranslations(translationModule.default)
        setCurrentLanguage(languages.en)
      } finally {
        setIsLoading(false)
      }
    }

    initializeLanguage()
  }, [])

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        languages,
        changeLanguage,
        t,
        loading: isLoading,
      }}
    >
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          Loading translations...
        </div>
      ) : (
        children
      )}
    </LanguageContext.Provider>
  )
}
