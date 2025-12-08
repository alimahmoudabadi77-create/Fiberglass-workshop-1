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
    <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
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

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Welcome Text */}
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {/* Online Status */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-indigo-600 animate-pulse" />
            </div>

            {/* Text */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white/70 text-sm">{greeting}</span>
                <span className="text-xl">👋</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {t.admin.managerName}
              </h1>
              <p className="text-white/70 text-sm">
                {t.admin.welcome.welcomeMessage}
              </p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-white font-bold text-lg font-mono" dir="ltr">{currentTime}</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{getFormattedDate()}</span>
            </div>
          </div>
        </div>

        {/* Site Status */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/20">
          <div className="flex items-center justify-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isSiteActive ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-red-500 shadow-lg shadow-red-500/50'} animate-pulse`} />
            <div className={`text-2xl font-bold ${isSiteActive ? 'text-emerald-400' : 'text-red-500'}`}>
              {isSiteActive ? t.admin.welcome.active : t.admin.welcome.inactive}
            </div>
          </div>
          <div className="text-white/60 text-xs text-center mt-2">{t.admin.welcome.siteStatus}</div>
        </div>
      </div>
    </div>
  )
}
