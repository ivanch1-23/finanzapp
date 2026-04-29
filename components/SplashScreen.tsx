'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface SplashScreenProps {
  isVisible: boolean
}

export function SplashScreen({ isVisible }: SplashScreenProps) {
  useEffect(() => {
    sessionStorage.setItem('splashShown', 'true')
  }, [])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="/finanzapplogo.png"
          alt="FinanzApp Logo"
          width={160}
          height={160}
          className="drop-shadow-2xl"
          priority
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-4"
      >
        <h1 className="text-2xl font-black tracking-tight text-white drop-shadow-lg">
          FinanzApp
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex items-center gap-2"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-6 w-6 rounded-full border-2 border-white/30 border-t-white"
        />
        <span className="text-sm font-medium text-white/80">Cargando...</span>
      </motion.div>
    </motion.div>
  )
}

export function MinimalLoader({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm pointer-events-none">
      <div className="flex items-center gap-2 rounded-2xl bg-white dark:bg-slate-800 px-4 py-3 shadow-lg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-5 w-5 rounded-full border-2 border-sky-400/30 border-t-sky-500"
        />
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Cargando...</span>
      </div>
    </div>
  )
}