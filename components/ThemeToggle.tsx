'use client'

import { useThemeStore } from '@/stores/theme'
import { Sun, Moon, Monitor } from 'lucide-react'
import { motion } from 'framer-motion'

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()

  return (
    <div className="relative inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-1">
      {(['light', 'system', 'dark'] as const).map((t, i) => {
        const isActive = theme === t
        return (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className="relative z-10 rounded-full p-2 transition-colors duration-200"
            aria-label={`Tema ${t}`}
          >
            {isActive && (
              <motion.div
                layoutId="themeIndicator"
                className="absolute inset-0 rounded-full bg-white dark:bg-slate-600 shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative flex items-center justify-center">
              {t === 'light' && <Sun className={`h-3.5 w-3.5 transition-colors ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />}
              {t === 'system' && <Monitor className={`h-3.5 w-3.5 transition-colors ${isActive ? 'text-sky-500' : 'text-slate-400'}`} />}
              {t === 'dark' && <Moon className={`h-3.5 w-3.5 transition-colors ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />}
            </span>
          </button>
        )
      })}
    </div>
  )
}
