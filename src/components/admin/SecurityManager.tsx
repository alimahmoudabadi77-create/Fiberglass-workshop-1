'use client'

import { useState, useEffect } from 'react'

interface SecuritySettings {
  twoFactorEnabled: boolean
  loginNotifications: boolean
  ipWhitelist: string[]
  maxLoginAttempts: number
  sessionTimeout: number // minutes
  lastPasswordChange: string
  securityLogs: SecurityLog[]
  blockedIPs: string[]
  autoLockEnabled: boolean
  autoLockTime: number // minutes
}

interface SecurityLog {
  id: string
  type: 'login' | 'logout' | 'failed_login' | 'settings_change' | 'password_change' | 'ip_blocked'
  message: string
  ip: string
  timestamp: string
  severity: 'info' | 'warning' | 'danger'
}

const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  twoFactorEnabled: false,
  loginNotifications: true,
  ipWhitelist: [],
  maxLoginAttempts: 5,
  sessionTimeout: 60,
  lastPasswordChange: new Date().toISOString(),
  securityLogs: [],
  blockedIPs: [],
  autoLockEnabled: false,
  autoLockTime: 30,
}

const SECURITY_KEY = 'fiberglass_security_settings'

function getSecuritySettings(): SecuritySettings {
  if (typeof window === 'undefined') return DEFAULT_SECURITY_SETTINGS
  try {
    const stored = localStorage.getItem(SECURITY_KEY)
    if (stored) return JSON.parse(stored)
  } catch (error) {
    console.error('Error reading security settings:', error)
  }
  return DEFAULT_SECURITY_SETTINGS
}

function saveSecuritySettings(settings: SecuritySettings): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(SECURITY_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Error saving security settings:', error)
  }
}

function addSecurityLog(log: Omit<SecurityLog, 'id' | 'timestamp'>): void {
  const settings = getSecuritySettings()
  const newLog: SecurityLog = {
    ...log,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  }
  settings.securityLogs = [newLog, ...settings.securityLogs].slice(0, 50) // Keep last 50 logs
  saveSecuritySettings(settings)
}

export default function SecurityManager() {
  const [settings, setSettings] = useState<SecuritySettings>(DEFAULT_SECURITY_SETTINGS)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [newWhitelistIP, setNewWhitelistIP] = useState('')
  const [newBlockedIP, setNewBlockedIP] = useState('')
  const [activeTab, setActiveTab] = useState<'settings' | 'logs' | 'firewall'>('settings')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    setSettings(getSecuritySettings())
  }, [])

  const showSuccess = () => {
    setShowSaveSuccess(true)
    setTimeout(() => setShowSaveSuccess(false), 3000)
  }

  const handleToggle2FA = () => {
    const newSettings = { ...settings, twoFactorEnabled: !settings.twoFactorEnabled }
    saveSecuritySettings(newSettings)
    setSettings(newSettings)
    addSecurityLog({
      type: 'settings_change',
      message: newSettings.twoFactorEnabled ? 'احراز هویت دو مرحله‌ای فعال شد' : 'احراز هویت دو مرحله‌ای غیرفعال شد',
      ip: '127.0.0.1',
      severity: 'info',
    })
    showSuccess()
  }

  const handleToggleNotifications = () => {
    const newSettings = { ...settings, loginNotifications: !settings.loginNotifications }
    saveSecuritySettings(newSettings)
    setSettings(newSettings)
    showSuccess()
  }

  const handleToggleAutoLock = () => {
    const newSettings = { ...settings, autoLockEnabled: !settings.autoLockEnabled }
    saveSecuritySettings(newSettings)
    setSettings(newSettings)
    showSuccess()
  }

  const handleAddWhitelistIP = () => {
    if (!newWhitelistIP.trim()) return
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
    if (!ipRegex.test(newWhitelistIP.trim())) {
      alert('فرمت IP نامعتبر است')
      return
    }
    if (settings.ipWhitelist.includes(newWhitelistIP.trim())) {
      alert('این IP قبلاً اضافه شده است')
      return
    }
    const newSettings = { ...settings, ipWhitelist: [...settings.ipWhitelist, newWhitelistIP.trim()] }
    saveSecuritySettings(newSettings)
    setSettings(newSettings)
    setNewWhitelistIP('')
    addSecurityLog({
      type: 'settings_change',
      message: `IP ${newWhitelistIP.trim()} به لیست سفید اضافه شد`,
      ip: '127.0.0.1',
      severity: 'info',
    })
    showSuccess()
  }

  const handleRemoveWhitelistIP = (ip: string) => {
    const newSettings = { ...settings, ipWhitelist: settings.ipWhitelist.filter(i => i !== ip) }
    saveSecuritySettings(newSettings)
    setSettings(newSettings)
    addSecurityLog({
      type: 'settings_change',
      message: `IP ${ip} از لیست سفید حذف شد`,
      ip: '127.0.0.1',
      severity: 'warning',
    })
    showSuccess()
  }

  const handleAddBlockedIP = () => {
    if (!newBlockedIP.trim()) return
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
    if (!ipRegex.test(newBlockedIP.trim())) {
      alert('فرمت IP نامعتبر است')
      return
    }
    if (settings.blockedIPs.includes(newBlockedIP.trim())) {
      alert('این IP قبلاً مسدود شده است')
      return
    }
    const newSettings = { ...settings, blockedIPs: [...settings.blockedIPs, newBlockedIP.trim()] }
    saveSecuritySettings(newSettings)
    setSettings(newSettings)
    setNewBlockedIP('')
    addSecurityLog({
      type: 'ip_blocked',
      message: `IP ${newBlockedIP.trim()} مسدود شد`,
      ip: newBlockedIP.trim(),
      severity: 'danger',
    })
    showSuccess()
  }

  const handleRemoveBlockedIP = (ip: string) => {
    const newSettings = { ...settings, blockedIPs: settings.blockedIPs.filter(i => i !== ip) }
    saveSecuritySettings(newSettings)
    setSettings(newSettings)
    addSecurityLog({
      type: 'settings_change',
      message: `IP ${ip} از لیست مسدودها حذف شد`,
      ip: '127.0.0.1',
      severity: 'info',
    })
    showSuccess()
  }

  const handleUpdateMaxAttempts = (value: number) => {
    const newSettings = { ...settings, maxLoginAttempts: value }
    saveSecuritySettings(newSettings)
    setSettings(newSettings)
    showSuccess()
  }

  const handleUpdateSessionTimeout = (value: number) => {
    const newSettings = { ...settings, sessionTimeout: value }
    saveSecuritySettings(newSettings)
    setSettings(newSettings)
    showSuccess()
  }

  const handleUpdateAutoLockTime = (value: number) => {
    const newSettings = { ...settings, autoLockTime: value }
    saveSecuritySettings(newSettings)
    setSettings(newSettings)
    showSuccess()
  }

  const handleChangePassword = () => {
    if (newPassword.length < 8) {
      alert('رمز عبور باید حداقل ۸ کاراکتر باشد')
      return
    }
    if (newPassword !== confirmPassword) {
      alert('رمز عبور و تکرار آن مطابقت ندارند')
      return
    }
    const newSettings = { ...settings, lastPasswordChange: new Date().toISOString() }
    saveSecuritySettings(newSettings)
    setSettings(newSettings)
    addSecurityLog({
      type: 'password_change',
      message: 'رمز عبور با موفقیت تغییر کرد',
      ip: '127.0.0.1',
      severity: 'info',
    })
    setShowPasswordModal(false)
    setNewPassword('')
    setConfirmPassword('')
    showSuccess()
  }

  const handleClearLogs = () => {
    if (confirm('آیا از پاک کردن تمام لاگ‌ها مطمئن هستید؟')) {
      const newSettings = { ...settings, securityLogs: [] }
      saveSecuritySettings(newSettings)
      setSettings(newSettings)
      showSuccess()
    }
  }

  const getLogIcon = (type: SecurityLog['type']) => {
    switch (type) {
      case 'login':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        )
      case 'logout':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        )
      case 'failed_login':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      case 'settings_change':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      case 'password_change':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        )
      case 'ip_blocked':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        )
    }
  }

  const getSeverityColor = (severity: SecurityLog['severity']) => {
    switch (severity) {
      case 'info': return 'text-blue-400 bg-blue-500/10'
      case 'warning': return 'text-amber-400 bg-amber-500/10'
      case 'danger': return 'text-red-400 bg-red-500/10'
    }
  }

  const daysSincePasswordChange = Math.floor(
    (Date.now() - new Date(settings.lastPasswordChange).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="max-w-4xl">
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

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">تغییر رمز عبور</h3>
                <p className="text-slate-500 text-sm">رمز عبور جدید را وارد کنید</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-slate-400 text-sm mb-2">رمز عبور جدید</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="حداقل ۸ کاراکتر"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">تکرار رمز عبور</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="تکرار رمز عبور"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-400 text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 px-4 py-3 rounded-xl bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-colors"
              >
                تغییر رمز عبور
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">امنیت سایبری</h2>
            <p className="text-slate-400 text-sm">مدیریت امنیت و حفاظت از سایت</p>
          </div>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* 2FA Status */}
        <div className={`p-4 rounded-2xl border ${settings.twoFactorEnabled ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${settings.twoFactorEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-400 text-xs">احراز هویت دو مرحله‌ای</p>
              <p className={`font-semibold ${settings.twoFactorEnabled ? 'text-emerald-400' : 'text-slate-300'}`}>
                {settings.twoFactorEnabled ? 'فعال' : 'غیرفعال'}
              </p>
            </div>
          </div>
        </div>

        {/* Password Status */}
        <div className={`p-4 rounded-2xl border ${daysSincePasswordChange > 90 ? 'bg-red-500/10 border-red-500/30' : daysSincePasswordChange > 60 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${daysSincePasswordChange > 90 ? 'bg-red-500/20 text-red-400' : daysSincePasswordChange > 60 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-400 text-xs">آخرین تغییر رمز</p>
              <p className={`font-semibold ${daysSincePasswordChange > 90 ? 'text-red-400' : daysSincePasswordChange > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {daysSincePasswordChange} روز پیش
              </p>
            </div>
          </div>
        </div>

        {/* Blocked IPs */}
        <div className="p-4 rounded-2xl border bg-slate-800/50 border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-500/20 text-red-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div>
              <p className="text-slate-400 text-xs">IP های مسدود</p>
              <p className="font-semibold text-white">{settings.blockedIPs.length} آدرس</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'settings'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          تنظیمات امنیتی
        </button>
        <button
          onClick={() => setActiveTab('firewall')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'firewall'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          فایروال
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'logs'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          لاگ‌های امنیتی
        </button>
      </div>

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Two Factor Authentication */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">احراز هویت دو مرحله‌ای (2FA)</h3>
                  <p className="text-slate-500 text-sm">افزایش امنیت با تأیید دو مرحله‌ای</p>
                </div>
              </div>
              <button
                onClick={handleToggle2FA}
                className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                  settings.twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all duration-300 ${
                  settings.twoFactorEnabled ? 'right-1' : 'right-9'
                }`} />
              </button>
            </div>
          </div>

          {/* Login Notifications */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">اعلان ورود</h3>
                  <p className="text-slate-500 text-sm">دریافت اعلان هنگام ورود جدید</p>
                </div>
              </div>
              <button
                onClick={handleToggleNotifications}
                className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                  settings.loginNotifications ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all duration-300 ${
                  settings.loginNotifications ? 'right-1' : 'right-9'
                }`} />
              </button>
            </div>
          </div>

          {/* Auto Lock */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">قفل خودکار</h3>
                  <p className="text-slate-500 text-sm">قفل شدن خودکار پس از عدم فعالیت</p>
                </div>
              </div>
              <button
                onClick={handleToggleAutoLock}
                className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                  settings.autoLockEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all duration-300 ${
                  settings.autoLockEnabled ? 'right-1' : 'right-9'
                }`} />
              </button>
            </div>
            {settings.autoLockEnabled && (
              <div className="mt-4 pt-4 border-t border-slate-700">
                <label className="block text-slate-400 text-sm mb-2">زمان قفل (دقیقه)</label>
                <input
                  type="number"
                  value={settings.autoLockTime}
                  onChange={(e) => handleUpdateAutoLockTime(parseInt(e.target.value) || 30)}
                  min={5}
                  max={120}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Max Login Attempts */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">حداکثر تلاش ورود</h3>
                <p className="text-slate-500 text-sm">تعداد تلاش‌های مجاز قبل از قفل شدن</p>
              </div>
            </div>
            <input
              type="number"
              value={settings.maxLoginAttempts}
              onChange={(e) => handleUpdateMaxAttempts(parseInt(e.target.value) || 5)}
              min={3}
              max={10}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Session Timeout */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">مدت زمان جلسه</h3>
                <p className="text-slate-500 text-sm">مدت زمان اعتبار جلسه کاربری (دقیقه)</p>
              </div>
            </div>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => handleUpdateSessionTimeout(parseInt(e.target.value) || 60)}
              min={15}
              max={480}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Change Password */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">تغییر رمز عبور</h3>
                  <p className="text-slate-500 text-sm">آخرین تغییر: {daysSincePasswordChange} روز پیش</p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium transition-colors"
              >
                تغییر رمز
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Firewall Tab */}
      {activeTab === 'firewall' && (
        <div className="space-y-6">
          {/* IP Whitelist */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">لیست سفید IP</h3>
                <p className="text-slate-500 text-sm">آدرس‌های IP مجاز برای دسترسی به پنل</p>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={newWhitelistIP}
                onChange={(e) => setNewWhitelistIP(e.target.value)}
                placeholder="مثال: 192.168.1.1"
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
              <button
                onClick={handleAddWhitelistIP}
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
              >
                افزودن
              </button>
            </div>

            {settings.ipWhitelist.length > 0 ? (
              <div className="space-y-2">
                {settings.ipWhitelist.map((ip, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-mono">
                        IP
                      </div>
                      <span className="text-white font-mono text-sm">{ip}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveWhitelistIP(ip)}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-sm">هیچ IP در لیست سفید وجود ندارد</p>
              </div>
            )}
          </div>

          {/* Blocked IPs */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">IP های مسدود</h3>
                <p className="text-slate-500 text-sm">آدرس‌های IP که دسترسی آنها مسدود شده</p>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={newBlockedIP}
                onChange={(e) => setNewBlockedIP(e.target.value)}
                placeholder="مثال: 192.168.1.1"
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-red-500 focus:outline-none"
              />
              <button
                onClick={handleAddBlockedIP}
                className="px-5 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
              >
                مسدود کردن
              </button>
            </div>

            {settings.blockedIPs.length > 0 ? (
              <div className="space-y-2">
                {settings.blockedIPs.map((ip, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </div>
                      <span className="text-white font-mono text-sm">{ip}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveBlockedIP(ip)}
                      className="px-3 py-1.5 rounded-lg text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-medium transition-colors"
                    >
                      رفع مسدودی
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">هیچ IP مسدود شده‌ای وجود ندارد</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">لاگ‌های امنیتی</h3>
                <p className="text-slate-500 text-sm">{settings.securityLogs.length} رویداد ثبت شده</p>
              </div>
            </div>
            {settings.securityLogs.length > 0 && (
              <button
                onClick={handleClearLogs}
                className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
              >
                پاک کردن همه
              </button>
            )}
          </div>

          {settings.securityLogs.length > 0 ? (
            <div className="divide-y divide-slate-800 max-h-96 overflow-auto">
              {settings.securityLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-4 hover:bg-slate-800/30 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getSeverityColor(log.severity)}`}>
                    {getLogIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">{log.message}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-slate-500 text-xs font-mono">{log.ip}</span>
                      <span className="text-slate-600 text-xs">•</span>
                      <span className="text-slate-500 text-xs">
                        {new Date(log.timestamp).toLocaleDateString('fa-IR')} - {new Date(log.timestamp).toLocaleTimeString('fa-IR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm">هیچ لاگ امنیتی ثبت نشده است</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

