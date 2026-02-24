'use client'

import { useEffect, useRef, useState } from 'react'
import { getContactInfo, ContactInfo } from '@/lib/contact'
import { useLanguage } from '@/lib/LanguageContext'

const DEFAULT_CONTACT: ContactInfo = {
  phone1: '۰۲۱-۱۲۳۴۵۶۷۸',
  phone2: '۰۹۱۲-۱۲۳-۴۵۶۷',
  email1: 'info@fiberglass-workshop.ir',
  email2: 'sales@fiberglass-workshop.ir',
  address: 'تهران، منطقه صنعتی',
  addressDetail: 'خیابان صنعت، پلاک ۱۲۳'
}

export default function ContactSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [contact, setContact] = useState<ContactInfo>(DEFAULT_CONTACT)
  const [isLoaded, setIsLoaded] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()

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

  useEffect(() => {
    // Load contact info
    const loadData = () => {
      try {
        const data = getContactInfo()
        setContact(data)
        setIsLoaded(true)
      } catch (error) {
        console.error('Error loading contact:', error)
        setContact(DEFAULT_CONTACT)
        setIsLoaded(true)
      }
    }

    loadData()

    // Update on changes
    const handleUpdate = () => {
      loadData()
    }

    window.addEventListener('contactUpdated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    // Poll for updates
    const interval = setInterval(loadData, 500)

    return () => {
      window.removeEventListener('contactUpdated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
      clearInterval(interval)
    }
  }, [])

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: t.contact.phone,
      value: contact.phone1,
      subValue: contact.phone2,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: t.contact.email,
      value: contact.email1,
      subValue: contact.email2,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: t.contact.address,
      value: contact.address,
      subValue: contact.addressDetail,
    },
  ]

  return (
    <section id="contact" ref={sectionRef} className="py-12 sm:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent" />
      <div className="absolute end-0 bottom-0 w-48 sm:w-96 h-48 sm:h-96 bg-green-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-8 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="text-green-400 font-semibold text-xs sm:text-sm tracking-wider">{t.contact.sectionTitle}</span>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-2 sm:mt-3 mb-4 sm:mb-6">
            {t.contact.title} <span className="gradient-text">{t.contact.titleHighlight}</span>
          </h2>
          <p className="text-gray-400 leading-relaxed text-sm sm:text-base px-2">
            {t.contact.description}
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-16">
          {contactInfo.map((item, index) => (
            <div
              key={index}
              className={`glass rounded-xl sm:rounded-2xl p-5 sm:p-8 text-center hover-card transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white shadow-lg shadow-green-500/30">
                <div className="scale-75 sm:scale-100">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">{item.title}</h3>
              <p className="text-green-400 font-medium mb-1 text-sm sm:text-base break-all sm:break-normal">{item.value}</p>
              <p className="text-gray-400 text-xs sm:text-sm break-all sm:break-normal">{item.subValue}</p>
            </div>
          ))}
        </div>

        {/* دعوت به همکاری */}
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/60 shadow-xl shadow-green-500/5">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5 pointer-events-none" />
            <div className="relative p-6 sm:p-8 lg:p-12">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 flex items-center justify-center shadow-lg shadow-green-500/20">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight gradient-text drop-shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                  {t.contact.invitationTitle}
                </h3>
              </div>
              <div className="space-y-4 sm:space-y-5 text-gray-200 leading-loose text-base sm:text-lg font-medium">
                <p>{t.contact.invitationP1}</p>
                <p>{t.contact.invitationP2}</p>
                <p>{t.contact.invitationP3}</p>
                <p className="text-green-400 font-bold text-lg sm:text-xl">{t.contact.invitationP4}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
