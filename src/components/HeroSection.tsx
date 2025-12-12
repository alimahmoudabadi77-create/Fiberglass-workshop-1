'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs - smaller on mobile */}
        <div className="absolute top-1/4 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-green-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-blue-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-green-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto pt-16 sm:pt-0">
          {/* Main Title */}
          <h1 
            className={`text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="text-white">{t.hero.title}</span>
            <br />
            <span className="gradient-text">{t.hero.subtitle}</span>
          </h1>


          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <a
              href="#contact"
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 overflow-hidden text-sm sm:text-base"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {t.hero.contactUs}
                <svg className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <button
              onClick={() => {
                const aboutSection = document.getElementById('about')
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' })
                  window.history.pushState(null, '', '#about')
                }
              }}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-all duration-300 text-sm sm:text-base text-center cursor-pointer"
            >
              {t.hero.learnMore}
            </button>
          </div>

          {/* Stats */}
          <div 
            className={`grid grid-cols-3 gap-3 sm:gap-6 mt-8 sm:mt-16 max-w-2xl mx-auto transition-all duration-1000 delay-800 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {[
              { value: '+30', label: t.hero.stats.experience },
              { value: '+500', label: t.hero.stats.projects },
              { value: '+100', label: t.hero.stats.clients },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-black gradient-text mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator - hidden on very small screens */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden xs:block">
        <div className="w-6 sm:w-8 h-10 sm:h-12 rounded-full border-2 border-green-500/50 flex items-start justify-center p-1.5 sm:p-2">
          <div className="w-1 sm:w-1.5 h-2 sm:h-3 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
