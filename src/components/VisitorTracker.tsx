'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { startVisitorSession, endVisitorSession, heartbeatVisitorSession } from '@/lib/analytics'

export default function VisitorTracker() {
  const pathname = usePathname()
  const lastTouchRef = useRef(0)

  useEffect(() => {
    // Track initial load + each route change as a page view
    startVisitorSession()
  }, [pathname])

  useEffect(() => {
    // Heartbeat to keep online status accurate
    const heartbeatInterval = setInterval(() => {
      heartbeatVisitorSession()
    }, 10_000)

    const touch = () => {
      const now = Date.now()
      // throttle to avoid spamming storage
      if (now - lastTouchRef.current < 5_000) return
      lastTouchRef.current = now
      heartbeatVisitorSession()
    }
    
    // End session on page unload (multiple events for better reliability)
    const handleUnload = () => {
      endVisitorSession()
    }
    
    // Use multiple events for better reliability across different browsers
    window.addEventListener('beforeunload', handleUnload)
    window.addEventListener('unload', handleUnload)
    window.addEventListener('pagehide', handleUnload)

    // Activity signals
    window.addEventListener('click', touch)
    window.addEventListener('keydown', touch)
    window.addEventListener('scroll', touch)
    window.addEventListener('touchstart', touch)
    
    return () => {
      clearInterval(heartbeatInterval)
      window.removeEventListener('beforeunload', handleUnload)
      window.removeEventListener('unload', handleUnload)
      window.removeEventListener('pagehide', handleUnload)
      window.removeEventListener('click', touch)
      window.removeEventListener('keydown', touch)
      window.removeEventListener('scroll', touch)
      window.removeEventListener('touchstart', touch)
      // End session when component unmounts (e.g., navigation)
      endVisitorSession()
    }
  }, [])
  
  // This component doesn't render anything
  return null
}

