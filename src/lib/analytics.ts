// سیستم آمار و تحلیل بازدید

export interface VisitorInfo {
  id: string
  ip: string
  userAgent: string
  browser: string
  os: string
  device: string
  entryTime: string
  // آخرین زمان فعالیت کاربر (برای تشخیص آنلاین/آفلاین و محاسبه خروج)
  lastSeen: string
  exitTime: string | null
  duration: number | null // in seconds
  pageViews: number
  pages: string[]
  referrer: string
  country?: string
  city?: string
}

export interface DailyStats {
  date: string
  visitors: number
  pageViews: number
  uniqueVisitors: string[] // visitor IDs
}

const VISITORS_KEY = 'fiberglass_visitors'
const CURRENT_VISITOR_KEY = 'fiberglass_current_visitor'
const DAILY_STATS_KEY = 'fiberglass_daily_stats'

// اگر کاربر بیش از این زمان فعالیت نکند، آفلاین محسوب می‌شود
const ONLINE_THRESHOLD_MS = 60_000

function nowIso(): string {
  return new Date().toISOString()
}

// Generate unique visitor ID
function generateVisitorId(): string {
  return 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// Parse user agent to get browser, OS, and device info
function parseUserAgent(ua: string): { browser: string; os: string; device: string } {
  let browser = 'نامشخص'
  let os = 'نامشخص'
  let device = 'دسکتاپ'

  // Browser detection
  if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Edg')) browser = 'Edge'
  else if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Safari')) browser = 'Safari'
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera'

  // OS detection
  if (ua.includes('Windows NT 10')) os = 'Windows 10/11'
  else if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac OS')) os = 'macOS'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'

  // Device detection
  if (ua.includes('Mobile') || ua.includes('Android')) device = 'موبایل'
  else if (ua.includes('Tablet') || ua.includes('iPad')) device = 'تبلت'

  return { browser, os, device }
}

// Get today's date in YYYY-MM-DD format
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

// Get all visitors
export function getVisitors(): VisitorInfo[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(VISITORS_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error reading visitors:', error)
  }
  
  return []
}

// Save visitors
function saveVisitors(visitors: VisitorInfo[]): void {
  if (typeof window === 'undefined') return
  
  try {
    // Keep only last 500 visitors to prevent storage overflow
    const trimmed = visitors.slice(-500)
    localStorage.setItem(VISITORS_KEY, JSON.stringify(trimmed))
    window.dispatchEvent(new Event('analyticsUpdated'))
  } catch (error) {
    console.error('Error saving visitors:', error)
  }
}

// Get daily stats
export function getDailyStats(): DailyStats[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(DAILY_STATS_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error reading daily stats:', error)
  }
  
  return []
}

// Save daily stats
function saveDailyStats(stats: DailyStats[]): void {
  if (typeof window === 'undefined') return
  
  try {
    // Keep only last 90 days
    const trimmed = stats.slice(-90)
    localStorage.setItem(DAILY_STATS_KEY, JSON.stringify(trimmed))
  } catch (error) {
    console.error('Error saving daily stats:', error)
  }
}

// Update daily stats
function updateDailyStats(visitorId: string): void {
  const stats = getDailyStats()
  const today = getTodayDate()
  
  let todayStats = stats.find(s => s.date === today)
  
  if (todayStats) {
    todayStats.pageViews++
    if (!todayStats.uniqueVisitors.includes(visitorId)) {
      todayStats.uniqueVisitors.push(visitorId)
      todayStats.visitors++
    }
  } else {
    stats.push({
      date: today,
      visitors: 1,
      pageViews: 1,
      uniqueVisitors: [visitorId]
    })
  }
  
  saveDailyStats(stats)
}

// Get current visitor from session
export function getCurrentVisitor(): VisitorInfo | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = sessionStorage.getItem(CURRENT_VISITOR_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error reading current visitor:', error)
  }
  
  return null
}

// Save current visitor to session
function saveCurrentVisitor(visitor: VisitorInfo): void {
  if (typeof window === 'undefined') return
  
  try {
    sessionStorage.setItem(CURRENT_VISITOR_KEY, JSON.stringify(visitor))
  } catch (error) {
    console.error('Error saving current visitor:', error)
  }
}

// Start tracking a new visitor
export async function startVisitorSession(): Promise<VisitorInfo> {
  // Check if already tracking
  let visitor = getCurrentVisitor()
  
  if (visitor) {
    // If session already ended or is stale, start a new session
    const lastSeenMs = new Date(visitor.lastSeen || visitor.entryTime).getTime()
    const isStale = visitor.exitTime !== null || (Date.now() - lastSeenMs > ONLINE_THRESHOLD_MS * 2)
    if (isStale) {
      try {
        sessionStorage.removeItem(CURRENT_VISITOR_KEY)
      } catch {
        // ignore
      }
      visitor = null
    } else {
      // Update page view & lastSeen
      visitor.pageViews++
      if (!visitor.pages.includes(window.location.pathname)) {
        visitor.pages.push(window.location.pathname)
      }
      visitor.lastSeen = nowIso()
      saveCurrentVisitor(visitor)
      updateVisitorInList(visitor)
      updateDailyStats(visitor.id)
      return visitor
    }
  }
  
  // Get IP address (using multiple free APIs as fallback)
  let ip = 'نامشخص'
  let country = ''
  let city = ''
  
  // Try multiple APIs for better reliability
  const ipApis = [
    {
      url: 'https://api.ipify.org?format=json',
      getIp: (data: { ip: string }) => data.ip,
      getCountry: () => '',
      getCity: () => ''
    },
    {
      url: 'https://ipinfo.io/json',
      getIp: (data: { ip: string }) => data.ip,
      getCountry: (data: { country: string }) => data.country || '',
      getCity: (data: { city: string }) => data.city || ''
    },
    {
      url: 'https://api.db-ip.com/v2/free/self',
      getIp: (data: { ipAddress: string }) => data.ipAddress,
      getCountry: (data: { countryName: string }) => data.countryName || '',
      getCity: (data: { city: string }) => data.city || ''
    }
  ]
  
  for (const api of ipApis) {
    try {
      const response = await fetch(api.url, { 
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      })
      if (response.ok) {
        const data = await response.json()
        ip = api.getIp(data) || 'نامشخص'
        country = api.getCountry(data)
        city = api.getCity(data)
        if (ip && ip !== 'نامشخص') break // Stop if we got a valid IP
      }
    } catch (error) {
      console.log(`API ${api.url} failed, trying next...`)
    }
  }
  
  const ua = navigator.userAgent
  const { browser, os, device } = parseUserAgent(ua)
  const entryTimeIso = nowIso()
  
  visitor = {
    id: generateVisitorId(),
    ip,
    userAgent: ua,
    browser,
    os,
    device,
    entryTime: entryTimeIso,
    lastSeen: entryTimeIso,
    exitTime: null,
    duration: null,
    pageViews: 1,
    pages: [window.location.pathname],
    referrer: document.referrer || 'مستقیم',
    country,
    city
  }
  
  saveCurrentVisitor(visitor)
  
  // Add to visitors list
  const visitors = getVisitors()
  visitors.push(visitor)
  saveVisitors(visitors)
  
  // Update daily stats
  updateDailyStats(visitor.id)
  
  return visitor
}

// Update visitor in the list
function updateVisitorInList(visitor: VisitorInfo): void {
  const visitors = getVisitors()
  const index = visitors.findIndex(v => v.id === visitor.id)
  
  if (index !== -1) {
    visitors[index] = visitor
    saveVisitors(visitors)
  }
}

// End visitor session (called on page unload)
export function endVisitorSession(): void {
  const visitor = getCurrentVisitor()
  
  if (visitor && !visitor.exitTime) {
    // Use precise timestamp for exit time
    const exitTimestamp = nowIso()
    visitor.exitTime = exitTimestamp
    visitor.lastSeen = exitTimestamp
    
    // Calculate duration precisely in seconds
    const entryTime = new Date(visitor.entryTime).getTime()
    const exitTime = new Date(exitTimestamp).getTime()
    visitor.duration = Math.floor((exitTime - entryTime) / 1000) // Use Math.floor for consistency
    
    saveCurrentVisitor(visitor)
    updateVisitorInList(visitor)
  }
}

// Heartbeat: فقط lastSeen را به‌روزرسانی می‌کند (برای دقیق شدن وضعیت آنلاین)
export function heartbeatVisitorSession(): void {
  const visitor = getCurrentVisitor()
  if (!visitor || visitor.exitTime) return
  visitor.lastSeen = nowIso()
  saveCurrentVisitor(visitor)
  updateVisitorInList(visitor)
}

// Get statistics
export function getStats() {
  const visitors = getVisitors()
  const dailyStats = getDailyStats()
  const today = getTodayDate()
  
  // Normalize old/dirty data and compute exitTime for inactive visitors
  const nowMs = Date.now()
  let changed = false
  for (const v of visitors) {
    // Backfill lastSeen for old records
    if (!v.lastSeen) {
      v.lastSeen = v.exitTime || v.entryTime
      changed = true
    }
    
    // If we have duration but exitTime is missing, reconstruct exitTime
    if (v.exitTime === null && v.duration !== null) {
      const entryMs = new Date(v.entryTime).getTime()
      v.exitTime = new Date(entryMs + v.duration * 1000).toISOString()
      v.lastSeen = v.exitTime
      changed = true
      continue
    }
    
    // If still marked online but inactive, set exitTime to lastSeen
    const lastSeenMs = new Date(v.lastSeen).getTime()
    if (v.exitTime === null && nowMs - lastSeenMs > ONLINE_THRESHOLD_MS) {
      v.exitTime = new Date(lastSeenMs).toISOString()
      const entryMs = new Date(v.entryTime).getTime()
      v.duration = Math.max(0, Math.floor((lastSeenMs - entryMs) / 1000))
      changed = true
    }
    
    // If exitTime exists but duration missing, compute it
    if (v.exitTime && v.duration === null) {
      const entryMs = new Date(v.entryTime).getTime()
      const exitMs = new Date(v.exitTime).getTime()
      v.duration = Math.max(0, Math.floor((exitMs - entryMs) / 1000))
      changed = true
    }
  }
  
  if (changed) {
    saveVisitors(visitors)
  }
  
  // Today's stats
  const todayStats = dailyStats.find(s => s.date === today) || {
    visitors: 0,
    pageViews: 0
  }
  
  // This week's stats (last 7 days)
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekStats = dailyStats
    .filter(s => new Date(s.date) >= weekAgo)
    .reduce((acc, s) => ({
      visitors: acc.visitors + s.visitors,
      pageViews: acc.pageViews + s.pageViews
    }), { visitors: 0, pageViews: 0 })
  
  // This month's stats (last 30 days)
  const monthAgo = new Date()
  monthAgo.setDate(monthAgo.getDate() - 30)
  const monthStats = dailyStats
    .filter(s => new Date(s.date) >= monthAgo)
    .reduce((acc, s) => ({
      visitors: acc.visitors + s.visitors,
      pageViews: acc.pageViews + s.pageViews
    }), { visitors: 0, pageViews: 0 })
  
  // Total stats
  const totalStats = {
    visitors: visitors.length,
    pageViews: dailyStats.reduce((acc, s) => acc + s.pageViews, 0)
  }
  
  // Recent visitors (last 50)
  const recentVisitors = visitors.slice(-50).reverse()
  
  // Browser stats
  const browserStats: Record<string, number> = {}
  visitors.forEach(v => {
    browserStats[v.browser] = (browserStats[v.browser] || 0) + 1
  })
  
  // Device stats
  const deviceStats: Record<string, number> = {}
  visitors.forEach(v => {
    deviceStats[v.device] = (deviceStats[v.device] || 0) + 1
  })
  
  return {
    today: todayStats,
    week: weekStats,
    month: monthStats,
    total: totalStats,
    recentVisitors,
    browserStats,
    deviceStats,
    dailyStats: dailyStats.slice(-7).reverse() // Last 7 days for chart
  }
}

// Clear all analytics data
export function clearAnalytics(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem(VISITORS_KEY)
  localStorage.removeItem(DAILY_STATS_KEY)
  sessionStorage.removeItem(CURRENT_VISITOR_KEY)
  window.dispatchEvent(new Event('analyticsUpdated'))
}

// Reset current session (for testing)
export function resetCurrentSession(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(CURRENT_VISITOR_KEY)
}

