'use client'

import { useState, useEffect } from 'react'
import { getSettings, SiteSettings } from '@/lib/settings'
import Link from 'next/link'
import GalleryManager from '@/components/admin/GalleryManager'
import TeamManager from '@/components/admin/TeamManager'
import WelcomeBanner from '@/components/admin/WelcomeBanner'
import ContactManager from '@/components/admin/ContactManager'
import MessagesManager from '@/components/admin/MessagesManager'
import ChatManager from '@/components/admin/ChatManager'
import AboutManager from '@/components/admin/AboutManager'
import ManagerManager from '@/components/admin/ManagerManager'
import Dashboard from '@/components/admin/Dashboard'
import LoginForm from '@/components/admin/LoginForm'
import { getUnreadMessagesCount } from '@/lib/contact'
import { getTotalUnreadChats } from '@/lib/chat'
import { isLoggedIn, logout } from '@/lib/auth'
import { useLanguage } from '@/lib/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function AdminPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [activeSection, setActiveSection] = useState<'home' | 'gallery' | 'team' | 'contact' | 'messages' | 'chat' | 'dashboard' | 'about' | 'manager'>('home')
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [unreadChats, setUnreadChats] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const { t, isRTL } = useLanguage()

  useEffect(() => {
    // Check authentication
    const authenticated = isLoggedIn('admin')
    setIsAuthenticated(authenticated)
    setCheckingAuth(false)

    if (authenticated) {
    const currentSettings = getSettings()
    setSettings(currentSettings)
    
    // Update unread messages count
    const updateUnread = () => {
      setUnreadMessages(getUnreadMessagesCount())
      setUnreadChats(getTotalUnreadChats())
    }
    updateUnread()
    
    window.addEventListener('messagesUpdated', updateUnread)
    window.addEventListener('chatsUpdated', updateUnread)
    window.addEventListener('storage', updateUnread)
    
    const interval = setInterval(updateUnread, 1000)
    
    return () => {
      window.removeEventListener('messagesUpdated', updateUnread)
      window.removeEventListener('chatsUpdated', updateUnread)
      window.removeEventListener('storage', updateUnread)
      clearInterval(interval)
    }
    }
  }, [isAuthenticated])

  const handleLogout = () => {
    logout('admin')
    setIsAuthenticated(false)
  }

  const showSuccessMessage = () => {
    setShowSaveSuccess(true)
    setTimeout(() => setShowSaveSuccess(false), 3000)
  }

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm role="admin" onSuccess={() => setIsAuthenticated(true)} />
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
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
            <span className="font-medium text-sm">{t.admin.changesSaved}</span>
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className={`w-72 bg-slate-900/50 backdrop-blur-xl ${isRTL ? 'border-l' : 'border-r'} border-slate-800 p-6 flex flex-col`}>
          {/* Logo */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-white font-bold">{t.admin.panelTitle}</h1>
                <div className="flex items-center gap-1">
                  <p className="text-slate-500 text-xs">{t.admin.workshopName}</p>
                  <span className="text-slate-600 text-xs">|</span>
                  <p className="text-slate-500 text-xs">{t.admin.managerName}</p>
                </div>
              </div>
            </div>
            {/* Language Switcher */}
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Designer Access Button */}
          <Link
            href="/admin/designer"
            className="flex items-center gap-3 px-4 py-3 mb-6 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-400 border border-purple-500/30 hover:border-purple-500/50 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div className="flex-1">
              <span className="block">{t.admin.designerAccess}</span>
              <span className="text-purple-400/60 text-xs">{t.admin.designerPanel}</span>
            </div>
            <svg className={`w-4 h-4 ${isRTL ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <button
              onClick={() => setActiveSection('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeSection === 'home'
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {t.admin.sidebar.home}
            </button>

            <button
              onClick={() => setActiveSection('about')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeSection === 'about'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t.admin.sidebar.about}
            </button>

            <button
              onClick={() => setActiveSection('manager')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeSection === 'manager'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t.admin.sidebar.manager}
            </button>

            <button
              onClick={() => setActiveSection('gallery')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeSection === 'gallery'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {t.admin.sidebar.gallery}
            </button>

            <button
              onClick={() => setActiveSection('team')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeSection === 'team'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {t.admin.sidebar.team}
            </button>

            <button
              onClick={() => setActiveSection('contact')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeSection === 'contact'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {t.admin.sidebar.contact}
            </button>

            <button
              onClick={() => setActiveSection('messages')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeSection === 'messages'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                {t.admin.sidebar.messages}
              </div>
              {unreadMessages > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                  {unreadMessages}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSection('chat')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeSection === 'chat'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {t.admin.sidebar.chats}
              </div>
              {unreadChats > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-bold animate-pulse">
                  {unreadChats}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeSection === 'dashboard'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              {t.admin.sidebar.dashboard}
            </button>
          </nav>

          {/* Footer */}
          <div className="pt-6 border-t border-slate-800 space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200"
            >
              <svg className={`w-5 h-5 ${isRTL ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {t.common.close}
            </button>
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all duration-200"
            >
              <svg className={`w-5 h-5 ${isRTL ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t.admin.backToSite}
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          {activeSection === 'home' ? (
            <WelcomeBanner />
          ) : activeSection === 'about' ? (
            <AboutManager />
          ) : activeSection === 'manager' ? (
            <ManagerManager />
          ) : activeSection === 'gallery' ? (
            <GalleryManager />
          ) : activeSection === 'team' ? (
            <TeamManager />
          ) : activeSection === 'contact' ? (
            <ContactManager />
          ) : activeSection === 'messages' ? (
            <MessagesManager />
          ) : activeSection === 'chat' ? (
            <ChatManager />
          ) : (
            <Dashboard />
          )}
        </main>
      </div>
    </div>
  )
}
