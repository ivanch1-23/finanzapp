'use client'

import { useState, useEffect } from 'react'
import { BottomNav } from '@/components/BottomNav'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SplashScreen } from '@/components/SplashScreen'
import { AuthProvider } from '@/contexts/AuthContext'
import { AuthChecker } from '@/components/AuthChecker'
import { usePushNotifications, requestNotificationPermission } from '@/hooks/usePushNotifications'
import './globals.css'

function NotificationHandler() {
  usePushNotifications()
  return null
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error)
    }

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(console.error)
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
      <body className="min-h-screen font-sans antialiased pb-20">
        <ThemeProvider>
          <AuthProvider>
            <NotificationHandler />
            <div className="fixed inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-cyan-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-300/30 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
              <div className="absolute top-1/3 right-0 w-80 h-80 bg-cyan-300/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
              <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-emerald-300/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-300/20 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '9s', animationDelay: '1s' }} />
            </div>
            <SplashScreen isVisible={isLoading} />
            <AuthChecker />
            {children}
          </AuthProvider>
        </ThemeProvider>
        <BottomNav />
      </body>
    </html>
  )
}