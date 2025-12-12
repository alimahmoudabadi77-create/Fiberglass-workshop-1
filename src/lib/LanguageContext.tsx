'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Language, Translations } from './translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const LANGUAGE_STORAGE_KEY = 'fiberglass_language'

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default language is Persian (fa)
  const [language, setLanguageState] = useState<Language>('fa')
  const [isInitialized, setIsInitialized] = useState(false)

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null
    const validLanguages: Language[] = ['en', 'de', 'fa', 'ru', 'fr', 'ar']
    if (savedLanguage && validLanguages.includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    }
    // If no saved language, keep default (fa) - Persian
    setIsInitialized(true)
  }, [])

  // RTL languages
  const rtlLanguages: Language[] = ['fa', 'ar']
  
  // Save language to localStorage when it changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
    
    // Update document direction and language
    document.documentElement.lang = lang
    document.documentElement.dir = rtlLanguages.includes(lang) ? 'rtl' : 'ltr'
  }

  // Update document attributes when language changes
  useEffect(() => {
    if (isInitialized) {
      document.documentElement.lang = language
      document.documentElement.dir = rtlLanguages.includes(language) ? 'rtl' : 'ltr'
    }
  }, [language, isInitialized])

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    isRTL: rtlLanguages.includes(language),
  }

  // Don't render until we've loaded the saved language
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
