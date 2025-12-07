'use client'

import { useEffect } from 'react'
import { startVisitorSession, endVisitorSession } from '@/lib/analytics'

export default function VisitorTracker() {
  useEffect(() => {
    // Start tracking when component mounts
    startVisitorSession()
    
    // Update exit time periodically
    const interval = setInterval(() => {
      endVisitorSession()
    }, 30000) // Every 30 seconds
    
    // End session on page unload
    const handleUnload = () => {
      endVisitorSession()
    }
    
    // Handle visibility change (tab switch)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        endVisitorSession()
      }
    }
    
    window.addEventListener('beforeunload', handleUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('beforeunload', handleUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      endVisitorSession()
    }
  }, [])
  
  // This component doesn't render anything
  return null
}

