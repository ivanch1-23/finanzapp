export function getWeekOfMonth(dateStr: string): number {
  const date = new Date(dateStr + 'T00:00:00')
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const dayOfMonth = date.getDate()
  const firstDayWeekday = firstDayOfMonth.getDay() // 0 = Sunday

  // Adjust so that the first week starts on the 1st of the month
  const adjustedDay = dayOfMonth + firstDayWeekday - 1
  const week = Math.floor(adjustedDay / 7) + 1
  // Limit to 4 weeks per month
  return Math.min(week, 4)
}

export function formatCurrency(amount: number) {
  return '$' + amount.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).replace(/,/g, '')
}

export function isUrgent(dueDate: string): boolean {
  const now = new Date()
  const due = new Date(dueDate + 'T00:00:00')
  const diffMs = due.getTime() - now.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  return diffHours >= 0 && diffHours <= 48
}

export function isOverdue(dueDate: string): boolean {
  const now = new Date()
  const due = new Date(dueDate + 'T00:00:00')
  return due.getTime() < now.getTime() && due.toDateString() !== now.toDateString()
}

export function isSameMonth(dateStr: string, targetMonth: Date): boolean {
  const date = new Date(dateStr + 'T00:00:00')
  return date.getMonth() === targetMonth.getMonth() &&
    date.getFullYear() === targetMonth.getFullYear()
}
