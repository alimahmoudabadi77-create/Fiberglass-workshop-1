import type { Metadata, Viewport } from 'next'
import './globals.css'
import VisitorTracker from '@/components/VisitorTracker'
import { LanguageProvider } from '@/lib/LanguageContext'

export const metadata: Metadata = {
  title: 'Fiberglass Workshop | High Quality Fiberglass Products',
  description: 'Professional fiberglass manufacturing workshop with years of experience. Providing professional services in industrial and decorative fiberglass parts.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-sans antialiased overflow-x-hidden">
        <LanguageProvider>
          <VisitorTracker />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
