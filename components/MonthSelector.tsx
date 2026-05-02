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
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
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
    <div className="flex items-center gap-3">
      <button
        onClick={goToPrev}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Mes anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${MONTHS_ES[currentMonth]}-${currentYear}`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2 min-w-[180px] justify-center"
        >
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-lg font-semibold">
            {MONTHS_ES[currentMonth]} {currentYear}
          </span>
          {mounted && isCurrentMonth && (
            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
              Hoy
            </span>
          )}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={goToNext}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Mes siguiente"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {mounted && !isCurrentMonth && (
        <button
          onClick={goToToday}
          className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        >
          Hoy
        </button>
      )}
    </div>
  )
}
