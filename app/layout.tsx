'use client'

import { useState, useEffect } from 'react'
import { BottomNav } from '@/components/BottomNav'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SplashScreen } from '@/components/SplashScreen'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Minimum splash display time for branded feel
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#059669" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans antialiased pb-20">
        <ThemeProvider>
          <SplashScreen isVisible={isLoading} />
          {children}
        </ThemeProvider>
        <BottomNav />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
