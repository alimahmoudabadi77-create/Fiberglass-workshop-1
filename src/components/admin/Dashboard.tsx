'use client'

import { useState, useEffect } from 'react'
import { getStats, clearAnalytics, VisitorInfo } from '@/lib/analytics'
import { useLanguage } from '@/lib/LanguageContext'

interface DashboardProps {
  showClearButton?: boolean
}

export default function Dashboard({ showClearButton = false }: DashboardProps) {
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null)
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorInfo | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const { t, language } = useLanguage()

  useEffect(() => {
    const loadStats = () => {
      setStats(getStats())
    }
    
    loadStats()
    
    // Refresh stats every 5 seconds
    const interval = setInterval(loadStats, 5000)
    
    window.addEventListener('analyticsUpdated', loadStats)
    window.addEventListener('storage', loadStats)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('analyticsUpdated', loadStats)
      window.removeEventListener('storage', loadStats)
    }
  }, [])

  const handleClearData = () => {
    clearAnalytics()
    setShowClearConfirm(false)
    setStats(getStats())
  }

  const formatDuration = (seconds: number | null): string => {
    if (seconds === null) return t.admin.dashboard.visiting
    if (seconds < 60) return `${seconds} ${t.admin.dashboard.seconds}`
    if (seconds < 3600) return `${Math.floor(seconds / 60)} ${t.admin.dashboard.minutes}`
    return `${Math.floor(seconds / 3600)} ${t.admin.dashboard.hours}`
  }

  const getLocale = (): string => {
    const localeMap: Record<string, string> = {
      'en': 'en-US',
      'de': 'de-DE',
      'fa': 'fa-IR',
      'ru': 'ru-RU',
      'fr': 'fr-FR',
      'ar': 'ar-SA',
    }
    return localeMap[language] || 'en-US'
  }

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString)
    return date.toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString)
    return date.toLocaleDateString(getLocale())
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{t.admin.dashboard.title}</h2>
          <p className="text-slate-400 text-sm">{t.admin.dashboard.subtitle}</p>
        </div>
        {showClearButton && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-sm font-medium transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {t.admin.dashboard.clearData}
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Today */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-400 text-sm">{t.admin.dashboard.today}</p>
              <p className="text-2xl font-bold text-white">{stats.today.visitors}</p>
            </div>
          </div>
          <div className="text-slate-500 text-xs">
            {stats.today.pageViews} {t.admin.dashboard.pageViews}
          </div>
        </div>

        {/* This Week */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-400 text-sm">{t.admin.dashboard.thisWeek}</p>
              <p className="text-2xl font-bold text-white">{stats.week.visitors}</p>
            </div>
          </div>
          <div className="text-slate-500 text-xs">
            {stats.week.pageViews} {t.admin.dashboard.pageViews}
          </div>
        </div>

        {/* This Month */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-400 text-sm">{t.admin.dashboard.thisMonth}</p>
              <p className="text-2xl font-bold text-white">{stats.month.visitors}</p>
            </div>
          </div>
          <div className="text-slate-500 text-xs">
            {stats.month.pageViews} {t.admin.dashboard.pageViews}
          </div>
        </div>

        {/* Total */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-400 text-sm">{t.admin.dashboard.totalVisits}</p>
              <p className="text-2xl font-bold text-white">{stats.total.visitors}</p>
            </div>
          </div>
          <div className="text-slate-500 text-xs">
            {stats.total.pageViews} {t.admin.dashboard.pageViews}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">{t.admin.dashboard.weeklyChart}</h3>
          <div className="flex items-end gap-2 h-40">
            {stats.dailyStats.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                {t.admin.dashboard.noData}
              </div>
            ) : (
              stats.dailyStats.map((day, index) => {
                const maxVisitors = Math.max(...stats.dailyStats.map(d => d.visitors), 1)
                const height = (day.visitors / maxVisitors) * 100
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center">
                      <span className="text-xs text-slate-400 mb-1">{day.visitors}</span>
                      <div 
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500"
                        style={{ height: `${Math.max(height, 5)}%`, minHeight: '8px' }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(day.date).toLocaleDateString(getLocale(), { day: 'numeric' })}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Device & Browser Stats */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">{t.admin.dashboard.deviceStats}</h3>
          <div className="space-y-4">
            {Object.entries(stats.deviceStats).length === 0 ? (
              <div className="text-slate-500 text-sm text-center py-4">
                {t.admin.dashboard.noData}
              </div>
            ) : (
              Object.entries(stats.deviceStats).map(([device, count]) => {
                const total = Object.values(stats.deviceStats).reduce((a, b) => a + b, 0)
                const percentage = Math.round((count / total) * 100)
                return (
                  <div key={device}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">{device}</span>
                      <span className="text-slate-500">{percentage}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <h3 className="text-lg font-semibold text-white mt-6 mb-4">{t.admin.dashboard.browsers}</h3>
          <div className="space-y-4">
            {Object.entries(stats.browserStats).length === 0 ? (
              <div className="text-slate-500 text-sm text-center py-4">
                {t.admin.dashboard.noData}
              </div>
            ) : (
              Object.entries(stats.browserStats).map(([browser, count]) => {
                const total = Object.values(stats.browserStats).reduce((a, b) => a + b, 0)
                const percentage = Math.round((count / total) * 100)
                return (
                  <div key={browser}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">{browser}</span>
                      <span className="text-slate-500">{percentage}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Visitors Table */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{t.admin.dashboard.recentVisitors}</h3>
        
        {stats.recentVisitors.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-slate-400">{t.admin.dashboard.noVisitors}</p>
            <p className="text-slate-600 text-sm mt-1">{t.admin.dashboard.visitSiteHint}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-start text-slate-400 text-sm font-medium py-3 px-4">{t.admin.dashboard.ip}</th>
                  <th className="text-start text-slate-400 text-sm font-medium py-3 px-4">{t.admin.dashboard.date}</th>
                  <th className="text-start text-slate-400 text-sm font-medium py-3 px-4">{t.admin.dashboard.entry}</th>
                  <th className="text-start text-slate-400 text-sm font-medium py-3 px-4">{t.admin.dashboard.exit}</th>
                  <th className="text-start text-slate-400 text-sm font-medium py-3 px-4">{t.admin.dashboard.duration}</th>
                  <th className="text-start text-slate-400 text-sm font-medium py-3 px-4">{t.admin.dashboard.device}</th>
                  <th className="text-start text-slate-400 text-sm font-medium py-3 px-4">{t.admin.dashboard.browser}</th>
                  <th className="text-start text-slate-400 text-sm font-medium py-3 px-4">{t.admin.dashboard.details}</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentVisitors.map((visitor) => (
                  <tr key={visitor.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-white text-sm font-mono">{visitor.ip}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-300 text-sm">{formatDate(visitor.entryTime)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-green-400 text-sm">{formatTime(visitor.entryTime)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm ${visitor.exitTime ? 'text-red-400' : 'text-amber-400'}`}>
                        {visitor.exitTime ? formatTime(visitor.exitTime) : t.admin.dashboard.online}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-400 text-sm">{formatDuration(visitor.duration)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs">
                        {visitor.device}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-300 text-sm">{visitor.browser}</span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedVisitor(visitor)}
                        className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs transition-colors"
                      >
                        {t.admin.dashboard.view}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Visitor Details Modal */}
      {selectedVisitor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">{t.admin.dashboard.visitorDetails}</h3>
              <button
                onClick={() => setSelectedVisitor(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-slate-500 text-xs mb-1">{t.admin.dashboard.ipAddress}</p>
                  <p className="text-white font-mono">{selectedVisitor.ip}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-slate-500 text-xs mb-1">{t.admin.dashboard.location}</p>
                  <p className="text-white">
                    {selectedVisitor.city && selectedVisitor.country 
                      ? `${selectedVisitor.city}, ${selectedVisitor.country}`
                      : t.admin.dashboard.unknown}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-slate-500 text-xs mb-1">{t.admin.dashboard.entryDate}</p>
                  <p className="text-white">{formatDate(selectedVisitor.entryTime)}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-slate-500 text-xs mb-1">{t.admin.dashboard.entryTime}</p>
                  <p className="text-green-400">{formatTime(selectedVisitor.entryTime)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-slate-500 text-xs mb-1">{t.admin.dashboard.exitTime}</p>
                  <p className={selectedVisitor.exitTime ? 'text-red-400' : 'text-amber-400'}>
                    {selectedVisitor.exitTime ? formatTime(selectedVisitor.exitTime) : t.admin.dashboard.stillOnline}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-slate-500 text-xs mb-1">{t.admin.dashboard.visitDuration}</p>
                  <p className="text-white">{formatDuration(selectedVisitor.duration)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-slate-500 text-xs mb-1">{t.admin.dashboard.device}</p>
                  <p className="text-white">{selectedVisitor.device}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-slate-500 text-xs mb-1">{t.admin.dashboard.browser}</p>
                  <p className="text-white">{selectedVisitor.browser}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-slate-500 text-xs mb-1">{t.admin.dashboard.os}</p>
                  <p className="text-white">{selectedVisitor.os}</p>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-slate-500 text-xs mb-1">{t.admin.dashboard.entrySource}</p>
                <p className="text-white text-sm break-all">{selectedVisitor.referrer}</p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-slate-500 text-xs mb-2">{t.admin.dashboard.pagesVisited} ({selectedVisitor.pageViews})</p>
                <div className="flex flex-wrap gap-2">
                  {selectedVisitor.pages.map((page, index) => (
                    <span key={index} className="px-2 py-1 rounded-lg bg-slate-700 text-slate-300 text-xs">
                      {page}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 max-w-sm w-full">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white text-center mb-2">{t.admin.dashboard.clearDataTitle}</h3>
            <p className="text-slate-400 text-sm text-center mb-6">
              {t.admin.dashboard.clearDataConfirm}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                {t.admin.gallery.cancel}
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                {t.admin.gallery.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
