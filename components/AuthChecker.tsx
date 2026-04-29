'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export function AuthChecker() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (loading) return

    const publicPaths = ['/login', '/register']
    if (!user && !publicPaths.includes(pathname)) {
      router.push('/login')
    }
  }, [user, loading, pathname, router, mounted])

  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 shadow-lg">
          <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
        </div>
      </div>
    )
  }

  return null
}