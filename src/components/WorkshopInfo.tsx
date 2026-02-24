'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

const WORKSHOP_DATA = {
  name: 'کارگاه فایبرگلاس و فلزکاری',
  subtitle: 'ساخت مخازن بازیافت فلزی',
  workshopId: '4703630742',
  manager: 'محمد علی غارسی',
}

export default function WorkshopInfo() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="py-6 sm:py-8 -mt-4 relative px-2 sm:px-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`
            relative max-w-4xl mx-auto overflow-hidden rounded-2xl
            bg-slate-900/60 backdrop-blur-xl border border-slate-700/60
            shadow-xl shadow-green-500/5
            transition-all duration-700 delay-150
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/5 via-transparent to-blue-500/5 pointer-events-none" />

          <div className="relative px-4 sm:px-6 py-4 sm:py-5">
            {/* موبایل: چیدمان عمودی | دسکتاپ: چیدمان افقی */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-6">
              {/* نام کارگاه */}
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 py-2 sm:py-0">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mb-0.5">{t.workshopInfo.workshopName}</p>
                  <p className="text-white font-bold text-sm sm:text-base md:text-lg break-words">{WORKSHOP_DATA.name}</p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-0.5 break-words">{WORKSHOP_DATA.subtitle}</p>
                </div>
              </div>

              {/* جداکننده - فقط دسکتاپ */}
              <div className="hidden sm:block w-px h-12 bg-slate-700/80 flex-shrink-0" />

              {/* شماره شناسه کارگاه */}
              <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 py-2 sm:py-0 border-t sm:border-t-0 border-slate-700/60 pt-4 sm:pt-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mb-0.5">{t.workshopInfo.workshopId}</p>
                  <p className="text-green-400 font-semibold text-sm sm:text-base md:text-lg" style={{ direction: 'ltr' }}>
                    {WORKSHOP_DATA.workshopId}
                  </p>
                </div>
              </div>

              <div className="hidden sm:block w-px h-12 bg-slate-700/80 flex-shrink-0" />

              {/* مدیر کارگاه */}
              <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 py-2 sm:py-0 border-t sm:border-t-0 border-slate-700/60 pt-4 sm:pt-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mb-0.5">{t.workshopInfo.manager}</p>
                  <p className="text-white font-semibold text-sm sm:text-base md:text-lg break-words">{WORKSHOP_DATA.manager}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
