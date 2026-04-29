'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export function AuthChecker() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      const publicPaths = ['/login', '/register']
      if (!publicPaths.includes(pathname)) {
        router.push('/login')
      }
    }
  }, [user, loading, pathname, router])

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-50">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    )
  }

  if (!user && !loading) {
    const publicPaths = ['/login', '/register']
    if (!publicPaths.includes(pathname)) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-slate-900 z-50">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-sky-500 mx-auto mb-4" />
            <p className="text-sm text-slate-500">Redirigiendo...</p>
          </div>
        </div>
      )
    }
  }

  return null
}