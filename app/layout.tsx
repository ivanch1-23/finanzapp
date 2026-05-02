'use client'

import { useState, useEffect, useRef } from 'react'
import { BottomNav } from '@/components/BottomNav'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SplashScreen } from '@/components/SplashScreen'
import { AuthProvider } from '@/contexts/AuthContext'
import { AuthChecker } from '@/components/AuthChecker'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [showSplash, setShowSplash] = useState(false)
  const splashDismissed = useRef(false)

  useEffect(() => {
    if (splashDismissed.current) return
    
    const hasSeenSplash = sessionStorage.getItem('splashShown')

    if (!hasSeenSplash) {
      setShowSplash(true)
      const timer = setTimeout(() => {
        setShowSplash(false)
        splashDismissed.current = true
        sessionStorage.setItem('splashShown', 'true')
      }, 2000)

      return () => clearTimeout(timer)
    } else {
      splashDismissed.current = true
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-64x64.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FinanzApp" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        <meta name="theme-color" content="#0EA5E9" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen font-sans antialiased bg-slate-50 dark:bg-slate-900">
        <ThemeProvider>
          <AuthProvider>
            <SplashScreen isVisible={showSplash} />
            <AuthChecker />
            {children}
          </AuthProvider>
        </ThemeProvider>
        <BottomNav />
      </body>
    </html>
  )
}