import type { Metadata } from 'next'
import { AdminLanguageProvider } from '@/lib/AdminLanguageContext'

export const metadata: Metadata = {
  title: 'پنل مدیریت | کارگاه فایبرگلاس',
  description: 'پنل مدیریت وبسایت کارگاه فایبرگلاس',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminLanguageProvider>
      <div className="admin-layout">
        {children}
      </div>
    </AdminLanguageProvider>
  )
}

