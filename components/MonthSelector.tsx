'use client'

import { useMemo } from 'react'
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

const DAYS_WEEK = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

export function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  const currentYear = selectedMonth.getFullYear()
  const currentMonth = selectedMonth.getMonth()

  const today = new Date()
  const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)

    // Start from Monday (adjust for Sunday = 0)
    let startDay = firstDay.getDay() - 1
    if (startDay < 0) startDay = 6

    const days: (number | null)[] = []

    // Empty cells before first day
    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }

    // Days of month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(d)
    }

    return days
  }, [currentYear, currentMonth])

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

  const selectedDay = today.getMonth() === currentMonth && today.getFullYear() === currentYear
    ? today.getDate()
    : null

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
      {/* Header with month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrev}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:text-sky-600 dark:hover:text-sky-400 transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
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
              {MONTHS_ES[currentMonth]}
            </span>
            <span className="text-base font-bold text-slate-500 dark:text-slate-400">
              {currentYear}
            </span>
          </motion.div>
          {isCurrentMonth && (
            <span className="text-[10px] font-medium text-teal-500 mt-0.5">Mes actual</span>
          )}
        </div>

        <button
          onClick={goToNext}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:text-sky-600 dark:hover:text-sky-400 transition-all"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_WEEK.map((day) => (
          <div key={day} className="flex items-center justify-center h-7">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-8" />
          }

          const isToday = day === selectedDay
          const isSelected = false // We don't track selected day, just navigate to month

          return (
            <motion.div
              key={day}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center h-8 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isToday
                  ? 'bg-gradient-to-br from-sky-400 to-cyan-400 text-white shadow-md shadow-sky-200 dark:shadow-sky-900/50'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:text-sky-600 dark:hover:text-sky-400'
              }`}
            >
              {day}
            </motion.div>
          )
        })}
      </div>

      {/* Today button */}
      {!isCurrentMonth && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700"
        >
          <button
            onClick={goToToday}
            className="w-full rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 py-2 text-xs font-bold text-white shadow-sm hover:shadow-md transition-all"
          >
            Volver al mes actual
          </button>
        </motion.div>
      )}
    </div>
  )
}
