'use client'

import { useState, useEffect } from 'react'
import { getUserByRole, updateUsername, updatePassword, User } from '@/lib/auth'

interface SecurityManagerProps {
  userRole: 'admin' | 'designer'
}

export default function SecurityManager({ userRole }: SecurityManagerProps) {
  const [user, setUser] = useState<User | null>(null)
  const [adminUser, setAdminUser] = useState<User | null>(null)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  
  // فیلدهای تغییر نام کاربری
  const [newUsername, setNewUsername] = useState('')
  const [showUsernameModal, setShowUsernameModal] = useState(false)
  
  // فیلدهای تغییر رمز عبور
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  // فیلدهای تغییر نام کاربری مدیر (برای پنل طراح)
  const [newAdminUsername, setNewAdminUsername] = useState('')
  const [showAdminUsernameModal, setShowAdminUsernameModal] = useState(false)
  
  // فیلدهای تغییر رمز عبور مدیر (برای پنل طراح)
  const [currentAdminPassword, setCurrentAdminPassword] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('')
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false)

  useEffect(() => {
    loadUser()
  }, [userRole])

  const loadUser = () => {
    const userData = getUserByRole(userRole)
    setUser(userData)
    if (userData) {
      setNewUsername(userData.username)
    }
    
    // بارگذاری اطلاعات مدیر برای پنل طراح
    if (userRole === 'designer') {
      const adminData = getUserByRole('admin')
      setAdminUser(adminData)
      if (adminData) {
        setNewAdminUsername(adminData.username)
      }
    }
  }

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setShowSaveSuccess(true)
    setTimeout(() => setShowSaveSuccess(false), 3000)
  }

  const showError = (message: string) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(''), 5000)
  }

  const handleChangeUsername = () => {
    if (!newUsername.trim()) {
      showError('لطفاً نام کاربری جدید را وارد کنید')
      return
    }
    
    const result = updateUsername(userRole, newUsername)
    
    if (result.success) {
      showSuccess(result.message)
      setShowUsernameModal(false)
      loadUser()
    } else {
      showError(result.message)
    }
  }

  const handleChangePassword = () => {
    if (!currentPassword) {
      showError('لطفاً رمز عبور فعلی را وارد کنید')
      return
    }
    
    if (!newPassword) {
      showError('لطفاً رمز عبور جدید را وارد کنید')
      return
    }
    
    if (newPassword.length < 6) {
      showError('رمز عبور جدید باید حداقل ۶ کاراکتر باشد')
      return
    }
    
    if (newPassword !== confirmPassword) {
      showError('رمز عبور جدید و تکرار آن مطابقت ندارند')
      return
    }
    
    const result = updatePassword(userRole, currentPassword, newPassword)
    
    if (result.success) {
      showSuccess(result.message)
      setShowPasswordModal(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      showError(result.message)
    }
  }

  // تغییر نام کاربری مدیر (برای پنل طراح)
  const handleChangeAdminUsername = () => {
    if (!newAdminUsername.trim()) {
      showError('لطفاً نام کاربری جدید را وارد کنید')
      return
    }
    
    const result = updateUsername('admin', newAdminUsername)
    
    if (result.success) {
      showSuccess('نام کاربری پنل مدیر با موفقیت تغییر کرد')
      setShowAdminUsernameModal(false)
      loadUser()
    } else {
      showError(result.message)
    }
  }

  // تغییر رمز عبور مدیر (برای پنل طراح)
  const handleChangeAdminPassword = () => {
    if (!currentAdminPassword) {
      showError('لطفاً رمز عبور فعلی مدیر را وارد کنید')
      return
    }
    
    if (!newAdminPassword) {
      showError('لطفاً رمز عبور جدید را وارد کنید')
      return
    }
    
    if (newAdminPassword.length < 6) {
      showError('رمز عبور جدید باید حداقل ۶ کاراکتر باشد')
      return
    }
    
    if (newAdminPassword !== confirmAdminPassword) {
      showError('رمز عبور جدید و تکرار آن مطابقت ندارند')
      return
    }
    
    const result = updatePassword('admin', currentAdminPassword, newAdminPassword)
    
    if (result.success) {
      showSuccess('رمز عبور پنل مدیر با موفقیت تغییر کرد')
      setShowAdminPasswordModal(false)
      setCurrentAdminPassword('')
      setNewAdminPassword('')
      setConfirmAdminPassword('')
    } else {
      showError(result.message)
    }
  }

  const getRoleName = () => {
    return userRole === 'admin' ? 'صفحه مدیریت' : 'پنل طراح'
  }

  return (
    <div className={userRole === 'designer' && adminUser ? 'max-w-5xl' : 'max-w-2xl'}>
      {/* Success Toast */}
      {showSaveSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="flex items-center gap-3 px-5 py-3 rounded-lg bg-emerald-500 text-white shadow-xl shadow-emerald-500/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium text-sm">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {errorMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="flex items-center gap-3 px-5 py-3 rounded-lg bg-red-500 text-white shadow-xl shadow-red-500/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="font-medium text-sm">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Username Change Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">تغییر نام کاربری</h3>
                <p className="text-slate-500 text-sm">نام کاربری جدید برای ورود به {getRoleName()}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-slate-400 text-sm mb-2">نام کاربری فعلی</label>
                <div className="w-full px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-700 text-slate-400 text-sm">
                  {user?.username}
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">نام کاربری جدید</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="نام کاربری جدید را وارد کنید"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUsernameModal(false)
                  setNewUsername(user?.username || '')
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-400 text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleChangeUsername}
                className="flex-1 px-4 py-3 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                تغییر نام کاربری
              </button>
            </div>
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
                <p className="text-slate-500 text-sm">رمز عبور جدید برای ورود به {getRoleName()}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-slate-400 text-sm mb-2">رمز عبور فعلی</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="رمز عبور فعلی"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">رمز عبور جدید</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="حداقل ۶ کاراکتر"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">تکرار رمز عبور جدید</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="تکرار رمز عبور جدید"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false)
                  setCurrentPassword('')
                  setNewPassword('')
                  setConfirmPassword('')
                }}
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

      {/* Admin Username Change Modal (for designer panel) */}
      {showAdminUsernameModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">تغییر نام کاربری مدیر</h3>
                <p className="text-slate-500 text-sm">نام کاربری جدید برای ورود به پنل مدیریت</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-slate-400 text-sm mb-2">نام کاربری فعلی</label>
                <div className="w-full px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-700 text-slate-400 text-sm">
                  {adminUser?.username}
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">نام کاربری جدید</label>
                <input
                  type="text"
                  value={newAdminUsername}
                  onChange={(e) => setNewAdminUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="نام کاربری جدید را وارد کنید"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAdminUsernameModal(false)
                  setNewAdminUsername(adminUser?.username || '')
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-400 text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleChangeAdminUsername}
                className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
              >
                تغییر نام کاربری
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Password Change Modal (for designer panel) */}
      {showAdminPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">تغییر رمز عبور مدیر</h3>
                <p className="text-slate-500 text-sm">رمز عبور جدید برای ورود به پنل مدیریت</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-slate-400 text-sm mb-2">رمز عبور فعلی مدیر</label>
                <input
                  type="password"
                  value={currentAdminPassword}
                  onChange={(e) => setCurrentAdminPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="رمز عبور فعلی مدیر"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">رمز عبور جدید</label>
                <input
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="حداقل ۶ کاراکتر"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">تکرار رمز عبور جدید</label>
                <input
                  type="password"
                  value={confirmAdminPassword}
                  onChange={(e) => setConfirmAdminPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="تکرار رمز عبور جدید"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAdminPasswordModal(false)
                  setCurrentAdminPassword('')
                  setNewAdminPassword('')
                  setConfirmAdminPassword('')
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-400 text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleChangeAdminPassword}
                className="flex-1 px-4 py-3 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">تنظیمات ورود</h2>
            <p className="text-slate-400 text-sm">مدیریت نام کاربری و رمز عبور پنل‌ها</p>
          </div>
        </div>
      </div>

      {/* Side by Side Layout for Designer Panel */}
      {userRole === 'designer' && adminUser ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Designer Panel Section */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-blue-800/50 p-6">
            {/* Designer Header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-700">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{user?.name || 'کاربر'}</h3>
                <p className="text-blue-400 text-sm">پنل طراح</p>
              </div>
            </div>

            {/* Designer Username */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">نام کاربری</p>
                  <p className="text-white font-medium font-mono text-sm" dir="ltr">{user?.username}</p>
                </div>
              </div>
            </div>

            {/* Designer Actions */}
            <div className="space-y-3">
              <button
                onClick={() => setShowUsernameModal(true)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <h4 className="text-white font-medium text-sm">تغییر نام کاربری</h4>
                    <p className="text-slate-500 text-xs">شماره موبایل یا نام کاربری</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-blue-400 group-hover:translate-x-[-4px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <h4 className="text-white font-medium text-sm">تغییر رمز عبور</h4>
                    <p className="text-slate-500 text-xs">رمز عبور جدید برای ورود</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-purple-400 group-hover:translate-x-[-4px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Admin Panel Section */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-emerald-800/50 p-6">
            {/* Admin Header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-700">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{adminUser.name}</h3>
                <p className="text-emerald-400 text-sm">پنل مدیریت</p>
              </div>
            </div>

            {/* Admin Username */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">نام کاربری</p>
                  <p className="text-white font-medium font-mono text-sm" dir="ltr">{adminUser.username}</p>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="space-y-3">
              <button
                onClick={() => setShowAdminUsernameModal(true)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <h4 className="text-white font-medium text-sm">تغییر نام کاربری</h4>
                    <p className="text-slate-500 text-xs">شماره موبایل یا نام کاربری</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-emerald-400 group-hover:translate-x-[-4px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => setShowAdminPasswordModal(true)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <h4 className="text-white font-medium text-sm">تغییر رمز عبور</h4>
                    <p className="text-slate-500 text-xs">رمز عبور جدید برای ورود</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-orange-400 group-hover:translate-x-[-4px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Single Column Layout for Admin Panel */
        <>
          {/* Current User Info */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{user?.name || 'کاربر'}</h3>
                <p className="text-slate-400 text-sm">{getRoleName()}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">نام کاربری</p>
                    <p className="text-white font-medium font-mono" dir="ltr">{user?.username}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="space-y-4">
            {/* Change Username Card */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">تغییر نام کاربری</h3>
                    <p className="text-slate-500 text-sm">شماره موبایل یا نام کاربری برای ورود</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUsernameModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
                >
                  تغییر
                </button>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">تغییر رمز عبور</h3>
                    <p className="text-slate-500 text-sm">رمز عبور جدید برای ورود به پنل</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium transition-colors"
                >
                  تغییر
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Security Tips */}
      <div className="mt-8 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-amber-400 font-semibold text-sm mb-1">نکات امنیتی</h4>
            <ul className="text-amber-300/80 text-xs space-y-1">
              <li>• رمز عبور خود را با کسی به اشتراک نگذارید</li>
              <li>• از رمز عبور قوی و ترکیبی استفاده کنید</li>
              <li>• رمز عبور خود را به صورت دوره‌ای تغییر دهید</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

