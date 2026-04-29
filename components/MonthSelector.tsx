'use client'

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface MonthSelectorProps {
  selectedMonth: Date
  onMonthChange: (date: Date) => void
}

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  const currentMonth = selectedMonth.getMonth()
  const currentYear = selectedMonth.getFullYear()

  const today = new Date()
  const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear

  const goToPrev = () => {
    if (currentMonth === 0) {
      onMonthChange(new Date(currentYear - 1, 11, 1))
    } else {
      onMonthChange(new Date(currentYear, currentMonth - 1, 1))
    }
  }

  const goToNext = () => {
    if (currentMonth === 11) {
      onMonthChange(new Date(currentYear + 1, 0, 1))
    } else {
      onMonthChange(new Date(currentYear, currentMonth + 1, 1))
    }
  }

  const goToToday = () => {
    onMonthChange(new Date())
  }

  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm p-1">
      <button
        onClick={goToPrev}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all shadow-sm"
      >
        <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" strokeWidth={1.5} />
      </button>

      <div className="flex flex-col items-center">
        <motion.div
          key={`${MONTHS_ES[currentMonth]}-${currentYear}`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4 text-sky-500" strokeWidth={1.5} />
          <span className="text-base font-bold text-slate-900 dark:text-white">
            {MONTHS_ES[currentMonth]} {currentYear}
          </span>
        </motion.div>
        {isCurrentMonth && (
          <span className="text-[10px] font-medium text-emerald-500 mt-0.5">Mes actual</span>
        )}
      </div>

      <button
        onClick={goToNext}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border border-white/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all shadow-sm"
      >
        <ChevronRight className="h-5 w-5 text-slate-600 dark:text-slate-300" strokeWidth={1.5} />
      </button>
    </div>
  )
}