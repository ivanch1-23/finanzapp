'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface SplashScreenProps {
  isVisible: boolean
}

export function SplashScreen({ isVisible }: SplashScreenProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-sky-400 via-cyan-400 to-teal-400"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/finanzapplogo.png"
              alt="FinanzApp Logo"
              width={180}
              height={180}
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
      )}
    </AnimatePresence>
  )
}
