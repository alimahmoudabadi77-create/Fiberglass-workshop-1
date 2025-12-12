'use client'

import { useEffect, useRef, useState } from 'react'
import { getManagerInfo, ManagerInfo as ManagerInfoType, formatPhoneNumber } from '@/lib/manager'
import { useLanguage } from '@/lib/LanguageContext'

// Default manager info for initial render
const defaultManagerInfo: ManagerInfoType = {
  firstName: 'محمد علی',
  lastName: 'غارسی',
  phone: '09173147318',
  title: 'مدیر کارگاه فایبرگلاس',
  photo: '',
  lastUpdated: new Date().toISOString()
}

export default function ManagerInfo() {
  const [isVisible, setIsVisible] = useState(false)
  const [manager, setManager] = useState<ManagerInfoType>(defaultManagerInfo)
  const [isLoaded, setIsLoaded] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    // Load manager info
    const info = getManagerInfo()
    setManager(info)
    setIsLoaded(true)

    // Listen for updates
    const handleUpdate = () => {
      setManager(getManagerInfo())
    }

    window.addEventListener('managerInfoUpdated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener('managerInfoUpdated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [isLoaded])

  const phoneFormatted = formatPhoneNumber(manager.phone)
  const phoneLink = `tel:${manager.phone}`

  return (
    <section id="manager" ref={sectionRef} className="py-12 sm:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
      <div className="absolute start-0 top-1/2 -translate-y-1/2 w-48 sm:w-72 h-48 sm:h-72 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-8 sm:mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="text-green-400 font-semibold text-xs sm:text-sm tracking-wider">{t.manager.sectionTitle}</span>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-2 sm:mt-3 mb-4 sm:mb-6">
            {t.manager.title} <span className="gradient-text">{t.manager.titleHighlight}</span>
          </h2>
          <p className="text-gray-400 leading-relaxed text-sm sm:text-base px-2">
            {t.manager.description}
          </p>
        </div>

        {/* Manager Card */}
        <div className={`max-w-xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 animated-border hover-card">
            {/* Profile Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 sm:w-28 h-20 sm:h-28 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-xl shadow-green-500/30 overflow-hidden">
                  {manager.photo ? (
                    <img src={manager.photo} alt={`${manager.firstName} ${manager.lastName}`} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-10 sm:w-14 h-10 sm:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                {/* Online Badge */}
                <div className="absolute -bottom-1 -end-1 w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-green-500 border-3 sm:border-4 border-slate-900 pulse-green" />
              </div>

              {/* Name & Title */}
              <div className="text-center sm:text-start">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{manager.firstName} {manager.lastName}</h3>
                <p className="text-green-400 font-medium text-sm sm:text-base">{manager.title}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6 sm:mb-8" />

            {/* Info Cards */}
            <div className="space-y-3 sm:space-y-4">
              {/* Name */}
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 sm:w-6 h-5 sm:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-0.5 sm:mb-1">{t.manager.firstName}</p>
                  <p className="text-white font-semibold text-sm sm:text-base">{manager.firstName}</p>
                </div>
              </div>

              {/* Last Name */}
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 sm:w-6 h-5 sm:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-0.5 sm:mb-1">{t.manager.lastName}</p>
                  <p className="text-white font-semibold text-sm sm:text-base">{manager.lastName}</p>
                </div>
              </div>

              {/* Phone */}
              <a 
                href={phoneLink}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 transition-all duration-300 group"
              >
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 sm:w-6 h-5 sm:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-400 text-xs sm:text-sm mb-0.5 sm:mb-1">{t.manager.phone}</p>
                  <p className="text-green-400 font-bold text-base sm:text-lg tracking-wide truncate" dir="ltr">{phoneFormatted}</p>
                </div>
                <div className="text-green-400 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0">
                  <svg className="w-4 sm:w-5 h-4 sm:h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </div>

            {/* Call to Action */}
            <div className="mt-6 sm:mt-8 text-center">
              <a
                href={phoneLink}
                className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 text-sm sm:text-base"
              >
                <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t.manager.callManager}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
