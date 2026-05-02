'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, History, Plus, Bell } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/history', label: 'Historial', icon: History },
  { href: '/add', label: 'Agregar', icon: Plus },
  { href: '/reminders', label: 'Alarmas', icon: Bell },
]

const publicPaths = ['/login', '/register']

export function BottomNav() {
  const pathname = usePathname()

  if (publicPaths.includes(pathname)) {
    return null
  }

  return (
    <nav className="fixed inset-x-0 bottom-6 z-50 flex justify-center">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
        className="relative flex items-center gap-1 px-2 py-1.5 rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-black/30"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const isAdd = item.href === '/add'

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative z-10 flex flex-col items-center justify-center transition-all duration-200 ${
                isAdd ? 'px-3' : 'px-4'
              }`}
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={`flex items-center justify-center rounded-xl transition-all duration-200 ${
                  isAdd
                    ? 'h-12 w-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : isActive
                    ? 'h-10 w-10 bg-slate-100 dark:bg-slate-700'
                    : 'h-10 w-10'
                }`}
              >
                <item.icon
                  className={`h-5 w-5 transition-colors duration-200 ${
                    isAdd
                      ? 'text-white dark:text-slate-900'
                      : isActive
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                  strokeWidth={isActive || isAdd ? 2 : 1.5}
                />
              </motion.div>
              <span className={`text-[10px] font-medium mt-1 transition-colors duration-200 ${
                isAdd
                  ? 'text-slate-600 dark:text-slate-300'
                  : isActive
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-400 dark:text-slate-500'
              }`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </motion.div>
    </nav>
  )
}
