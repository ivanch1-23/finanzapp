'use client'

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'
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
  const [mounted, setMounted] = useState(false)
  const [displayMonth, setDisplayMonth] = useState('')
  
  useEffect(() => {
    setMounted(true)
    setDisplayMonth(`${MONTHS_ES[selectedMonth.getMonth()]} ${selectedMonth.getFullYear()}`)
  }, [selectedMonth])
  
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

  // Prevent hydration mismatch by rendering placeholder until mounted
  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6" />
        <div className="min-w-[160px] h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="w-6 h-6" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={goToPrev}
        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
        aria-label="Mes anterior"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={`${MONTHS_ES[currentMonth]}-${currentYear}`}
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 3 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-2 min-w-[160px] justify-center"
        >
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span suppressHydrationWarning className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {MONTHS_ES[currentMonth]} {currentYear}
          </span>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={goToNext}
        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
        aria-label="Mes siguiente"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {!isCurrentMonth && (
        <button
          onClick={goToToday}
          className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          Hoy
        </button>
      )}
    </div>
  )
}
