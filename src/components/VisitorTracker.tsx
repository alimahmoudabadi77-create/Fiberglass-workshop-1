'use client'

import { useEffect } from 'react'
import { startVisitorSession, endVisitorSession } from '@/lib/analytics'

export default function VisitorTracker() {
  useEffect(() => {
    // Start tracking when component mounts
    startVisitorSession()
    
    // End session on page unload (multiple events for better reliability)
    const handleUnload = () => {
      endVisitorSession()
    }
    
    // Use multiple events for better reliability across different browsers
    window.addEventListener('beforeunload', handleUnload)
    window.addEventListener('unload', handleUnload)
    window.addEventListener('pagehide', handleUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleUnload)
      window.removeEventListener('unload', handleUnload)
      window.removeEventListener('pagehide', handleUnload)
      // End session when component unmounts (e.g., navigation)
      endVisitorSession()
    }
  }, [])
  
  // This component doesn't render anything
  return null
}

