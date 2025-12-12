'use client'

import { createContext, useContext, ReactNode } from 'react'
import { translations } from './translations'

// Admin panel always uses Persian (Farsi) language
const ADMIN_LANGUAGE = 'fa' as const

interface AdminLanguageContextType {
  language: typeof ADMIN_LANGUAGE
  t: typeof translations.fa
  isRTL: true
}

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined)

export function AdminLanguageProvider({ children }: { children: ReactNode }) {
  const value: AdminLanguageContextType = {
    language: ADMIN_LANGUAGE,
    t: translations.fa,
    isRTL: true,
  }

  return (
    <AdminLanguageContext.Provider value={value}>
      <div dir="rtl" lang="fa">
        {children}
      </div>
    </AdminLanguageContext.Provider>
  )
}

export function useAdminLanguage() {
  const context = useContext(AdminLanguageContext)
  if (context === undefined) {
    throw new Error('useAdminLanguage must be used within an AdminLanguageProvider')
  }
  return context
}
