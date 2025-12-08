'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

export default function DateTimeClock() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const { language } = useLanguage()

  useEffect(() => {
    setCurrentTime(new Date())
    
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // مخفی شدن هنگام اسکرول
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!currentTime || !isVisible) {
    return null
  }

  // Get locale based on language
  const getLocale = () => {
    switch (language) {
      case 'fa': return 'fa-IR'
      case 'de': return 'de-DE'
      default: return 'en-US'
    }
  }

  const locale = getLocale()

  // Date formatting
  const formattedDate = currentTime.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  // Time formatting
  const formattedTime = currentTime.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className={`fixed top-20 z-40 bg-slate-900/90 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 shadow-lg border border-green-500/20 ${language === 'fa' ? 'left-2 sm:left-4' : 'right-2 sm:right-4'}`}>
      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
        <span className="text-green-400 font-mono" dir="ltr">{formattedTime}</span>
        <span className="text-green-500/50 hidden xs:inline">|</span>
        <span className="text-gray-400 hidden xs:inline">{formattedDate}</span>
      </div>
    </div>
  )
}
