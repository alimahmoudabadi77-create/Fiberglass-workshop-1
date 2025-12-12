'use client'

import { useState, useEffect } from 'react'
import { getSettings } from '@/lib/settings'
import { useLanguage } from '@/lib/LanguageContext'

export default function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [greeting, setGreeting] = useState('')
  const [isSiteActive, setIsSiteActive] = useState(true)
  const { t, language } = useLanguage()

  useEffect(() => {
    setIsVisible(true)
    
    // دریافت وضعیت سایت
    const settings = getSettings()
    setIsSiteActive(!settings.isLocked)
    
    // تعیین سلام بر اساس ساعت
    const updateGreeting = () => {
      const hour = new Date().getHours()
      if (hour >= 5 && hour < 12) {
        setGreeting(t.admin.welcome.goodMorning)
      } else if (hour >= 12 && hour < 17) {
        setGreeting(t.admin.welcome.goodAfternoon)
      } else if (hour >= 17 && hour < 21) {
        setGreeting(t.admin.welcome.goodEvening)
      } else {
        setGreeting(t.admin.welcome.goodNight)
      }
    }

    // به‌روزرسانی ساعت
    const updateTime = () => {
      const now = new Date()
      const localeMap: Record<string, string> = {
        'en': 'en-US',
        'de': 'de-DE',
        'fa': 'fa-IR',
        'ru': 'ru-RU',
        'fr': 'fr-FR',
        'ar': 'ar-SA',
      }
      const locale = localeMap[language] || 'en-US'
      setCurrentTime(now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }))
    }

    updateGreeting()
    updateTime()

    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [t, language])

  // تاریخ بر اساس زبان
  const getFormattedDate = () => {
    const localeMap: Record<string, string> = {
      'en': 'en-US',
      'de': 'de-DE',
      'fa': 'fa-IR',
      'ru': 'ru-RU',
      'fr': 'fr-FR',
      'ar': 'ar-SA',
    }
    const locale = localeMap[language] || 'en-US'
    return new Date().toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className={`mb-4 sm:mb-6 lg:mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-4 sm:p-6 lg:p-8">
        {/* Background Decorations - Hidden on small screens for performance */}
        <div className="absolute inset-0 overflow-hidden hidden sm:block">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          {/* Animated Circles */}
          <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full animate-pulse" />
          <div className="absolute bottom-10 right-10 w-16 h-16 border border-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col gap-4 sm:gap-6">
          {/* Welcome Text & Avatar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 sm:w-16 md:w-20 sm:h-16 md:h-20 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-xl">
                  <svg className="w-7 h-7 sm:w-8 md:w-10 sm:h-8 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                {/* Online Status */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-400 rounded-full border-2 border-indigo-600 animate-pulse" />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                  <span className="text-white/70 text-xs sm:text-sm">{greeting}</span>
                  <span className="text-base sm:text-xl">👋</span>
                </div>
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-0.5 sm:mb-1 truncate">
                  {t.admin.managerName}
                </h1>
                <p className="text-white/70 text-xs sm:text-sm line-clamp-2 sm:line-clamp-1">
                  {t.admin.welcome.welcomeMessage}
                </p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-2">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white font-bold text-sm sm:text-lg font-mono" dir="ltr">{currentTime}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-white/60 text-xs sm:text-sm">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="truncate">{getFormattedDate()}</span>
              </div>
            </div>
          </div>

          {/* Site Status */}
          <div className="pt-3 sm:pt-4 lg:pt-6 border-t border-white/20">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${isSiteActive ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-red-500 shadow-lg shadow-red-500/50'} animate-pulse`} />
              <div className={`text-lg sm:text-xl lg:text-2xl font-bold ${isSiteActive ? 'text-emerald-400' : 'text-red-500'}`}>
                {isSiteActive ? t.admin.welcome.active : t.admin.welcome.inactive}
              </div>
            </div>
            <div className="text-white/60 text-[10px] sm:text-xs text-center mt-1 sm:mt-2">{t.admin.welcome.siteStatus}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
