'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, History, PlusCircle, Bell } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/history', label: 'Historial', icon: History },
  { href: '/add', label: 'Agregar', icon: PlusCircle },
  { href: '/reminders', label: 'Alarmas', icon: Bell },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-md">
        <div className="flex h-16 items-center justify-around px-2 relative">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            if (!isActive) return null

            const index = navItems.findIndex(i => i.href === item.href)
            const position = index * (100 / navItems.length)

            return (
              <motion.div
                key={item.href}
                className="absolute top-0 bottom-0"
                style={{ left: `${position}%`, width: `${100 / navItems.length}%` }}
                initial={false}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <div className="absolute inset-0 flex items-center justify-center pt-2">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-50 dark:from-sky-900/40 dark:to-cyan-900/20 shadow-lg shadow-sky-200/50 dark:shadow-sky-900/30" />
                </div>
              </motion.div>
            )
          })}

          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative z-10 flex flex-col items-center justify-center gap-0.5 min-w-[60px] min-h-[56px] pt-2"
              >
                <motion.div
                  className="relative flex items-center justify-center"
                  whileTap={{ scale: 0.85 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <item.icon
                    className={`h-6 w-6 transition-colors duration-200 ${
                      isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-sky-500"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
                <span className={`text-[10px] font-semibold transition-colors duration-200 ${
                  isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
