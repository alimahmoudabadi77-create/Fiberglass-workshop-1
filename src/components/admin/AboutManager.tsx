'use client'

import { useState, useEffect } from 'react'
import { getAboutContent, saveAboutContent, AboutContent, AboutFeature } from '@/lib/about'

export default function AboutManager() {
  const [content, setContent] = useState<AboutContent | null>(null)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [editingFeature, setEditingFeature] = useState<string | null>(null)

  useEffect(() => {
    setContent(getAboutContent())
  }, [])

  const handleSave = () => {
    if (!content) return
    saveAboutContent(content)
    setShowSaveSuccess(true)
    setTimeout(() => setShowSaveSuccess(false), 3000)
  }

  const updateFeature = (id: string, field: keyof AboutFeature, value: string) => {
    if (!content) return
    setContent({
      ...content,
      features: content.features.map(f => 
        f.id === id ? { ...f, [field]: value } : f
      )
    })
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case 'quality':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )
      case 'speed':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      case 'team':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )
      case 'price':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

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

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">مدیریت درباره ما</h2>
          <p className="text-slate-400 text-sm">ویرایش متن‌ها و اطلاعات بخش درباره ما</p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-green-500/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          ذخیره تغییرات
        </button>
      </div>

      {/* Main Title Section */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">عنوان اصلی</h3>
            <p className="text-slate-500 text-sm">تنظیم عنوان و متن برجسته بخش درباره ما</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-sm mb-2">برچسب بخش</label>
            <input
              type="text"
              value={content.sectionTitle}
              onChange={(e) => setContent({ ...content, sectionTitle: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              placeholder="درباره ما"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-2">متن برجسته (رنگی)</label>
            <input
              type="text"
              value={content.highlightText}
              onChange={(e) => setContent({ ...content, highlightText: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              placeholder="۳۰ سال"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-2">ابتدای عنوان</label>
            <input
              type="text"
              value={content.mainTitle}
              onChange={(e) => setContent({ ...content, mainTitle: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              placeholder="بیش از"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-2">انتهای عنوان</label>
            <input
              type="text"
              value={content.mainTitleEnd}
              onChange={(e) => setContent({ ...content, mainTitleEnd: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              placeholder="تجربه در صنعت فایبرگلاس"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="mt-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <p className="text-slate-500 text-xs mb-2">پیش‌نمایش عنوان:</p>
          <p className="text-white text-lg">
            {content.mainTitle} <span className="text-green-400 font-bold">{content.highlightText}</span> {content.mainTitleEnd}
          </p>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">توضیحات</h3>
            <p className="text-slate-500 text-sm">متن‌های توضیحی بخش درباره ما</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm mb-2">پاراگراف اول</label>
            <textarea
              value={content.description1}
              onChange={(e) => setContent({ ...content, description1: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 resize-none"
              placeholder="توضیحات اول..."
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-2">پاراگراف دوم</label>
            <textarea
              value={content.description2}
              onChange={(e) => setContent({ ...content, description2: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 resize-none"
              placeholder="توضیحات دوم..."
            />
          </div>
        </div>
      </div>

      {/* Establishment Year Section */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">سال تأسیس</h3>
            <p className="text-slate-500 text-sm">اطلاعات کارت سال تأسیس</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-sm mb-2">برچسب</label>
            <input
              type="text"
              value={content.establishmentLabel}
              onChange={(e) => setContent({ ...content, establishmentLabel: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              placeholder="سال تأسیس کارگاه"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-2">سال (فارسی)</label>
            <input
              type="text"
              value={content.establishmentYear}
              onChange={(e) => setContent({ ...content, establishmentYear: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              placeholder="۱۳۷۴"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">ویژگی‌ها</h3>
            <p className="text-slate-500 text-sm">کارت‌های ویژگی (کیفیت، سرعت، تیم، قیمت)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.features.map((feature) => (
            <div
              key={feature.id}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                editingFeature === feature.id
                  ? 'bg-slate-800/70 border-blue-500/50'
                  : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
                  {getIconForType(feature.iconType)}
                </div>
                <button
                  onClick={() => setEditingFeature(editingFeature === feature.id ? null : feature.id)}
                  className="flex-1 text-right"
                >
                  <h4 className="text-white font-medium">{feature.title}</h4>
                  <p className="text-slate-500 text-xs">کلیک برای ویرایش</p>
                </button>
              </div>

              {editingFeature === feature.id ? (
                <div className="space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-slate-400 text-xs mb-1">عنوان</label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => updateFeature(feature.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1">توضیحات</label>
                    <textarea
                      value={feature.description}
                      onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 resize-none"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-sm">{feature.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-6 text-slate-600 text-xs text-center">
        آخرین بروزرسانی: {new Date(content.lastUpdated).toLocaleDateString('fa-IR')} ساعت {new Date(content.lastUpdated).toLocaleTimeString('fa-IR')}
      </div>
    </div>
  )
}

