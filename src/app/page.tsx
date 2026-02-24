'use client'

import { useEffect, useState } from 'react'
import { getSettingsAsync, SiteSettings } from '@/lib/settings'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import WorkshopInfo from '@/components/WorkshopInfo'
import ServicesPreview from '@/components/ServicesPreview'
import AboutSection from '@/components/AboutSection'
import FiberglassInfo from '@/components/FiberglassInfo'
import Gallery from '@/components/Gallery'
import TeamSection from '@/components/TeamSection'
import WorkingHours from '@/components/WorkingHours'
import ManagerInfo from '@/components/ManagerInfo'
import ContactSection from '@/components/ContactSection'
import MaintenanceMode from '@/components/MaintenanceMode'
import DateTimeClock from '@/components/DateTimeClock'
// ChatButton removed - using navbar message button instead

export default function Home() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      const s = await getSettingsAsync()
      setSettings(s)
    }
    loadSettings().finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const loadSettings = async () => {
      const s = await getSettingsAsync()
      setSettings(s)
    }
    loadSettings()

    const handleStorageChange = () => {
      loadSettings()
    }

    window.addEventListener('storage', handleStorageChange)

    const interval = setInterval(loadSettings, 3000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Maintenance mode
  if (settings?.isLocked) {
    return <MaintenanceMode message={settings.lockMessage} />
  }

  // Normal view
  return (
    <>
      <Navbar />
      <DateTimeClock />
      <main>
        <HeroSection />
        <WorkshopInfo />
        <AboutSection />
        <FiberglassInfo />
        <ServicesPreview />
        <Gallery />
        <TeamSection />
        <WorkingHours />
        <ManagerInfo />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
