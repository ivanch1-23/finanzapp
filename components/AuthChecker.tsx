'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'

export function AuthChecker() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const checkAuth = useCallback(() => {
    if (!mounted) return
    if (loading) return

    const publicPaths = ['/login', '/register']
    const isPublicPath = publicPaths.includes(pathname)

    if (!user && !isPublicPath) {
      router.push('/login')
    }
  }, [mounted, loading, pathname, router, user])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return null
}