'use client'

import { useState, useEffect, useRef } from 'react'
import { getManagerInfo, saveManagerInfo, ManagerInfo, formatPhoneNumber } from '@/lib/manager'

export default function ManagerManager() {
  const [manager, setManager] = useState<ManagerInfo | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [title, setTitle] = useState('')
  const [photo, setPhoto] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const info = getManagerInfo()
    setManager(info)
    setFirstName(info.firstName)
    setLastName(info.lastName)
    setPhone(info.phone)
    setTitle(info.title)
    setPhoto(info.photo || '')
  }, [])

  const handleSave = () => {
    const updatedInfo: ManagerInfo = {
      firstName,
      lastName,
      phone: phone.replace(/\D/g, ''), // Store only digits
      title,
      photo,
      lastUpdated: new Date().toISOString()
    }
    
    saveManagerInfo(updatedInfo)
    setManager(updatedInfo)
    setIsEditing(false)
    
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleCancel = () => {
    if (manager) {
      setFirstName(manager.firstName)
      setLastName(manager.lastName)
      setPhone(manager.phone)
      setTitle(manager.title)
      setPhoto(manager.photo || '')
    }
    setIsEditing(false)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('حجم فایل نباید بیشتر از ۲ مگابایت باشد')
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('لطفاً یک فایل تصویری انتخاب کنید')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setPhoto(base64)
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    setPhoto('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (!manager) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="flex items-center gap-3 px-5 py-3 rounded-lg bg-emerald-500 text-white shadow-xl shadow-emerald-500/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium text-sm">اطلاعات مدیر ذخیره شد</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">اطلاعات مدیر کارگاه</h2>
        <p className="text-slate-400 text-sm">ویرایش اطلاعات مدیر که در صفحه اصلی نمایش داده می‌شود</p>
      </div>

      {/* Preview Card */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">پیش‌نمایش</h3>
              <p className="text-slate-500 text-sm">نمایش اطلاعات فعلی مدیر</p>
            </div>
          </div>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              ویرایش
            </button>
          )}
        </div>

        {/* Manager Preview */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center overflow-hidden">
              {photo ? (
                <img src={photo} alt={`${firstName} ${lastName}`} className="w-full h-full object-cover" />
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">{firstName} {lastName}</h4>
              <p className="text-green-400 text-sm">{title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-green-400 font-bold" dir="ltr">{formatPhoneNumber(phone)}</span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">ویرایش اطلاعات</h3>
              <p className="text-slate-500 text-sm">اطلاعات جدید را وارد کنید</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                عکس پروفایل
              </label>
              <div className="flex items-center gap-4">
                {/* Photo Preview */}
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center overflow-hidden border-2 border-slate-600">
                  {photo ? (
                    <img src={photo} alt="پیش‌نمایش" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                
                {/* Upload Buttons */}
                <div className="flex flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    انتخاب عکس
                  </button>
                  {photo && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      حذف عکس
                    </button>
                  )}
                </div>
              </div>
              <p className="text-slate-500 text-xs mt-2">حداکثر حجم: ۲ مگابایت | فرمت‌های مجاز: JPG, PNG, GIF</p>
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                نام
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                placeholder="نام مدیر"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                نام خانوادگی
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                placeholder="نام خانوادگی مدیر"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                شماره تماس
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                placeholder="09123456789"
                dir="ltr"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                عنوان / سمت
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                placeholder="مدیر کارگاه فایبرگلاس"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-800">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-all duration-200"
            >
              انصراف
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              ذخیره تغییرات
            </button>
          </div>
        </div>
      )}

      {/* Last Updated Info */}
      <div className="mt-6 text-slate-600 text-xs text-center">
        آخرین بروزرسانی: {new Date(manager.lastUpdated).toLocaleDateString('fa-IR')} ساعت {new Date(manager.lastUpdated).toLocaleTimeString('fa-IR')}
      </div>
    </div>
  )
}

