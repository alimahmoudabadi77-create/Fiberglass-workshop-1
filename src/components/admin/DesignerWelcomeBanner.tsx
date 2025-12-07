'use client'

import { useState, useEffect } from 'react'
import { getTeamMembers } from '@/lib/team'
import { getSettings } from '@/lib/settings'

export default function DesignerWelcomeBanner() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [teamCount, setTeamCount] = useState(0)
  const [siteStatus, setSiteStatus] = useState('فعال')

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Get team count
    const members = getTeamMembers()
    setTeamCount(members.length)

    // Get site status
    const settings = getSettings()
    setSiteStatus(settings.isLocked ? 'قفل' : 'فعال')

    // Listen for updates
    const handleUpdate = () => {
      const newMembers = getTeamMembers()
      setTeamCount(newMembers.length)
      const newSettings = getSettings()
      setSiteStatus(newSettings.isLocked ? 'قفل' : 'فعال')
    }

    window.addEventListener('storage', handleUpdate)
    window.addEventListener('teamUpdated', handleUpdate)

    return () => {
      clearInterval(timer)
      window.removeEventListener('storage', handleUpdate)
      window.removeEventListener('teamUpdated', handleUpdate)
    }
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour >= 5 && hour < 12) return { text: 'صبح بخیر', emoji: '🌅' }
    if (hour >= 12 && hour < 17) return { text: 'ظهر بخیر', emoji: '☀️' }
    if (hour >= 17 && hour < 21) return { text: 'عصر بخیر', emoji: '🌆' }
    return { text: 'شب بخیر', emoji: '🌙' }
  }

  const formatTime = () => {
    return currentTime.toLocaleTimeString('fa-IR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = () => {
    return currentTime.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const greeting = getGreeting()

  return (
    <div className="mb-8 rounded-3xl overflow-hidden">
      {/* Main Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 p-6 lg:p-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-300 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Right Side - Greeting & Name */}
          <div className="flex items-center gap-5 text-center lg:text-right">
            {/* Avatar */}
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <svg className="w-10 h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2 justify-center lg:justify-start mb-1">
                <span className="text-white/80 text-sm lg:text-base">{greeting.text}</span>
                <span className="text-lg">{greeting.emoji}</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                آقای علی محمودآبادی
              </h1>
              <p className="text-white/70 text-sm">
                به پنل مدیریت طراح کارگاه فایبرگلاس خوش آمدید
              </p>
            </div>
          </div>

          {/* Left Side - Time */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
            <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-right">
              <div className="text-white font-bold text-lg lg:text-xl font-mono" dir="ltr">
                {formatTime()}
              </div>
              <div className="text-white/60 text-xs flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 border-t-0 rounded-b-3xl">
        <div className="p-4 lg:p-5 text-center">
          <div className={`text-2xl lg:text-3xl font-bold mb-1 ${siteStatus === 'فعال' ? 'text-green-400' : 'text-red-400'}`}>
            {siteStatus}
          </div>
          <div className="text-slate-400 text-xs lg:text-sm">وضعیت سایت</div>
        </div>
      </div>
    </div>
  )
}

