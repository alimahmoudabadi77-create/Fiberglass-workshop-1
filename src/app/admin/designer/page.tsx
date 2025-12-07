'use client'

import { useState, useEffect } from 'react'
import { getSettings, saveSettings, SiteSettings } from '@/lib/settings'
import Link from 'next/link'
import DesignerWelcomeBanner from '@/components/admin/DesignerWelcomeBanner'
import Dashboard from '@/components/admin/Dashboard'

export default function DesignerAdminPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [lockMessage, setLockMessage] = useState('')
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [activeSection, setActiveSection] = useState<'settings' | 'dashboard'>('settings')

  useEffect(() => {
    const currentSettings = getSettings()
    setSettings(currentSettings)
    setLockMessage(currentSettings.lockMessage)

    // Listen for changes
    const handleUpdate = () => {
      const newSettings = getSettings()
      setSettings(newSettings)
      setLockMessage(newSettings.lockMessage)
    }

    window.addEventListener('storage', handleUpdate)
    const interval = setInterval(handleUpdate, 1000)

    return () => {
      window.removeEventListener('storage', handleUpdate)
      clearInterval(interval)
    }
  }, [])

  const handleToggleLock = () => {
    if (!settings) return
    
    const newSettings: SiteSettings = {
      ...settings,
      isLocked: !settings.isLocked,
      lastUpdated: new Date().toISOString(),
    }
    saveSettings(newSettings)
    setSettings(newSettings)
    
    window.dispatchEvent(new Event('storage'))
    showSuccessMessage()
  }

  const handleSaveMessage = () => {
    if (!settings) return
    
    const newSettings: SiteSettings = {
      ...settings,
      lockMessage: lockMessage,
      lastUpdated: new Date().toISOString(),
    }
    saveSettings(newSettings)
    setSettings(newSettings)
    showSuccessMessage()
  }

  const showSuccessMessage = () => {
    setShowSaveSuccess(true)
    setTimeout(() => setShowSaveSuccess(false), 3000)
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Success Toast */}
      {showSaveSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="flex items-center gap-3 px-5 py-3 rounded-lg bg-emerald-500 text-white shadow-xl shadow-emerald-500/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium text-sm">تغییرات ذخیره شد</span>
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-72 bg-slate-900/50 backdrop-blur-xl border-l border-slate-800 p-6 flex flex-col">
          {/* Logo */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-white font-bold">پنل طراح</h1>
                <div className="flex items-center gap-1">
                  <p className="text-slate-500 text-xs">کارگاه فایبرگلاس</p>
                  <span className="text-slate-600 text-xs">|</span>
                  <p className="text-purple-400 text-xs">علی محمودآبادی</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <button
              onClick={() => setActiveSection('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeSection === 'settings'
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              تنظیمات
            </button>

            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeSection === 'dashboard'
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              داشبورد
            </button>
          </nav>

          {/* Footer */}
          <div className="pt-6 border-t border-slate-800 space-y-2">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-purple-400 hover:bg-purple-500/10 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              پنل مدیر
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              بازگشت به سایت
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          {/* Welcome Banner */}
          <DesignerWelcomeBanner />

          {activeSection === 'dashboard' ? (
            <Dashboard showClearButton={true} />
          ) : (
          /* Settings Section */
          <div className="max-w-3xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">تنظیمات</h2>
                  <p className="text-slate-400 text-sm">کنترل وضعیت وبسایت</p>
                </div>
              </div>
            </div>

            {/* Site Lock Card - Main Feature */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 overflow-hidden mb-6">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-slate-800 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      settings.isLocked 
                        ? 'bg-red-500/20 text-red-400 shadow-lg shadow-red-500/20' 
                        : 'bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20'
                    }`}>
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {settings.isLocked ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">وضعیت وبسایت</h3>
                      <p className="text-slate-400 text-sm">فعال یا غیرفعال کردن دسترسی کاربران</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`px-4 py-2 rounded-xl text-sm font-bold ${
                    settings.isLocked 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${settings.isLocked ? 'bg-red-400' : 'bg-emerald-400'} animate-pulse`} />
                    {settings.isLocked ? 'غیرفعال' : 'فعال'}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Toggle Button */}
                <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-800/50 border border-slate-700 mb-6">
                  <div>
                    <h4 className="text-white font-semibold mb-1">
                      {settings.isLocked ? 'وبسایت غیرفعال است' : 'وبسایت فعال است'}
                    </h4>
                    <p className="text-slate-400 text-sm">
                      {settings.isLocked 
                        ? 'کاربران نمی‌توانند به وبسایت دسترسی داشته باشند' 
                        : 'کاربران می‌توانند وبسایت را مشاهده کنند'}
                    </p>
                  </div>

                  {/* Big Toggle Button */}
                  <button
                    onClick={handleToggleLock}
                    className={`relative w-20 h-10 rounded-full transition-all duration-500 ${
                      settings.isLocked ? 'bg-red-500' : 'bg-emerald-500'
                    }`}
                  >
                    <div className={`absolute top-1 w-8 h-8 rounded-full bg-white shadow-lg transition-all duration-500 flex items-center justify-center ${
                      settings.isLocked ? 'right-1' : 'right-11'
                    }`}>
                      {settings.isLocked ? (
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      if (!settings.isLocked) handleToggleLock()
                    }}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      settings.isLocked 
                        ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400'
                    }`}
                  >
                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    <span className="text-sm font-medium">غیرفعال کردن</span>
                  </button>

                  <button
                    onClick={() => {
                      if (settings.isLocked) handleToggleLock()
                    }}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      !settings.isLocked 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400'
                    }`}
                  >
                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">فعال کردن</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Lock Message Card */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">پیام نمایشی</h3>
                  <p className="text-slate-500 text-sm">پیامی که هنگام غیرفعال بودن به کاربران نمایش داده می‌شود</p>
                </div>
              </div>

              <textarea
                value={lockMessage}
                onChange={(e) => setLockMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all duration-200 resize-none mb-4"
                placeholder="پیام خود را وارد کنید..."
              />

              <div className="flex items-center justify-between">
                <div className="text-slate-500 text-xs">
                  این پیام به کاربران نمایش داده می‌شود
                </div>
                <button
                  onClick={handleSaveMessage}
                  className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ذخیره پیام
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 text-slate-600 text-xs text-center">
              آخرین بروزرسانی: {new Date(settings.lastUpdated).toLocaleDateString('fa-IR')} ساعت {new Date(settings.lastUpdated).toLocaleTimeString('fa-IR')}
            </div>
          </div>
          )}
        </main>
      </div>
    </div>
  )
}
