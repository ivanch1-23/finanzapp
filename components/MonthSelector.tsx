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
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
      <button
        onClick={goToPrev}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:text-sky-600 dark:hover:text-sky-400 transition-all"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex flex-col items-center">
        <motion.div
          key={`${MONTHS_ES[currentMonth]}-${currentYear}`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4 text-sky-500" />
          <span className="text-base font-bold text-slate-900 dark:text-white">
            {MONTHS_ES[currentMonth]} {currentYear}
          </span>
        </motion.div>
        {isCurrentMonth && (
          <span className="text-[10px] font-medium text-teal-500 mt-0.5">Mes actual</span>
        )}
      </div>

      <button
        onClick={goToNext}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:text-sky-600 dark:hover:text-sky-400 transition-all"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
