'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

export default function WorkingHours() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t, language } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const schedule = [
    { dayKey: 'saturday' as const, hoursKey: 'regular' as const, isOpen: true },
    { dayKey: 'sunday' as const, hoursKey: 'regular' as const, isOpen: true },
    { dayKey: 'monday' as const, hoursKey: 'regular' as const, isOpen: true },
    { dayKey: 'tuesday' as const, hoursKey: 'regular' as const, isOpen: true },
    { dayKey: 'wednesday' as const, hoursKey: 'regular' as const, isOpen: true },
    { dayKey: 'thursday' as const, hoursKey: 'thursday' as const, isOpen: true },
    { dayKey: 'friday' as const, hoursKey: 'closed' as const, isOpen: false },
  ]

  // Stats values based on language
  const statsValues = {
    daysPerWeek: language === 'fa' ? '۶' : '6',
    hoursPerDay: language === 'fa' ? '۹+' : '9+',
    support: '24/7',
  }

  return (
    <section ref={sectionRef} className="py-12 sm:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Working Hours Card */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 animated-border">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-11 sm:w-14 h-11 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 flex-shrink-0">
                  <svg className="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white">{t.workingHours.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">{t.workingHours.subtitle}</p>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {schedule.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 ${
                      item.isOpen 
                        ? 'bg-green-500/10 hover:bg-green-500/20' 
                        : 'bg-red-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full ${item.isOpen ? 'bg-green-400 pulse-green' : 'bg-red-400'}`} />
                      <span className="text-white font-medium text-sm sm:text-base">{t.workingHours.days[item.dayKey]}</span>
                    </div>
                    <span className={`text-xs sm:text-sm font-medium ${item.isOpen ? 'text-green-400' : 'text-red-400'}`}>
                      {t.workingHours.hours[item.hoursKey]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Note */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-2 sm:gap-3">
                  <svg className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {t.workingHours.note}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Content */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <span className="text-green-400 font-semibold text-xs sm:text-sm tracking-wider">{t.workingHours.sectionTitle}</span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-2 sm:mt-3 mb-4 sm:mb-6">
              {t.workingHours.mainTitle} <span className="gradient-text">{t.workingHours.mainTitleHighlight}</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
              {t.workingHours.description}
            </p>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="glass rounded-lg sm:rounded-xl p-3 sm:p-5 text-center hover-card">
                <div className="text-xl sm:text-3xl font-bold gradient-text mb-1 sm:mb-2">{statsValues.daysPerWeek}</div>
                <p className="text-gray-400 text-xs sm:text-sm">{t.workingHours.stats.daysPerWeek}</p>
              </div>
              <div className="glass rounded-lg sm:rounded-xl p-3 sm:p-5 text-center hover-card">
                <div className="text-xl sm:text-3xl font-bold gradient-text mb-1 sm:mb-2">{statsValues.hoursPerDay}</div>
                <p className="text-gray-400 text-xs sm:text-sm">{t.workingHours.stats.hoursPerDay}</p>
              </div>
              <div className="glass rounded-lg sm:rounded-xl p-3 sm:p-5 text-center hover-card">
                <div className="text-xl sm:text-3xl font-bold gradient-text mb-1 sm:mb-2">{statsValues.support}</div>
                <p className="text-gray-400 text-xs sm:text-sm">{t.workingHours.stats.support}</p>
              </div>
              <div className="glass rounded-lg sm:rounded-xl p-3 sm:p-5 text-center hover-card">
                <div className="text-xl sm:text-3xl font-bold gradient-text mb-1 sm:mb-2">{t.workingHours.stats.fast}</div>
                <p className="text-gray-400 text-xs sm:text-sm">{t.workingHours.stats.response}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
