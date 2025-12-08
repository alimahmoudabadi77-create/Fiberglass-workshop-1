'use client'

import { useEffect, useRef, useState } from 'react'
import { getAboutContent, AboutContent } from '@/lib/about'
import { useLanguage } from '@/lib/LanguageContext'

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [content, setContent] = useState<AboutContent | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    // Load content from localStorage
    setContent(getAboutContent())

    // Listen for updates from admin panel
    const handleUpdate = () => {
      setContent(getAboutContent())
    }
    window.addEventListener('aboutUpdated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener('aboutUpdated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

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

  const getIconForType = (type: string) => {
    switch (type) {
      case 'quality':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )
      case 'speed':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      case 'team':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )
      case 'price':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  const getFeatureTranslation = (iconType: string) => {
    switch (iconType) {
      case 'quality':
        return t.about.features.quality
      case 'speed':
        return t.about.features.speed
      case 'team':
        return t.about.features.team
      case 'price':
        return t.about.features.price
      default:
        return { title: '', description: '' }
    }
  }

  // Show loading or default content while loading
  if (!content) {
    return (
      <section id="about" className="py-24 relative">
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  return (
    <section id="about" ref={sectionRef} className="py-12 sm:py-24 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-48 sm:w-72 h-48 sm:h-72 bg-green-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <span className="text-green-400 font-semibold text-xs sm:text-sm tracking-wider">{t.about.sectionTitle}</span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-2 sm:mt-3 mb-4 sm:mb-6">
              {t.about.mainTitle} <span className="gradient-text">{t.about.highlightText}</span> {t.about.mainTitleEnd}
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
              {t.about.description1}
            </p>
            <p className="text-gray-400 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
              {t.about.description2}
            </p>

            {/* Establishment Year Card */}
            <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 animated-border">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 flex-shrink-0">
                  <svg className="w-6 sm:w-8 h-6 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">{t.about.establishmentLabel}</p>
                  <p className="text-2xl sm:text-3xl font-bold gradient-text">{t.about.establishmentYear}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className={`grid grid-cols-2 gap-3 sm:gap-4 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            {content.features.map((feature, index) => {
              const featureTranslation = getFeatureTranslation(feature.iconType)
              return (
                <div
                  key={feature.id}
                  className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 hover-card group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center mb-3 sm:mb-4 text-green-400 group-hover:scale-110 transition-transform duration-300">
                    {getIconForType(feature.iconType)}
                  </div>
                  <h3 className="text-sm sm:text-lg font-semibold text-white mb-1 sm:mb-2">{featureTranslation.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-3">{featureTranslation.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
