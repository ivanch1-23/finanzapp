'use client'

import { useEffect } from 'react'
import { useReminderStore } from '@/stores/reminders'
import { isOverdue } from '@/lib/utils'

const NOTIFICATION_KEY = 'finanzapp_last_notified_'

export function usePushNotifications() {
  const reminders = useReminderStore((s) => s.reminders)
  const load = useReminderStore((s) => s.load)

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return
    }

    const checkAndNotify = () => {
      reminders.forEach((reminder) => {
        if (reminder.is_paid) return

        const key = `${NOTIFICATION_KEY}${reminder.id}`
        const lastNotified = localStorage.getItem(key)
        const now = new Date()
        const dueDate = new Date(reminder.due_date)
        const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)

        if (hoursUntilDue <= 24 && hoursUntilDue > 0 && !lastNotified) {
          sendNotification(reminder, hoursUntilDue)
          localStorage.setItem(key, now.toISOString())
        }

        if (isOverdue(reminder.due_date) && !lastNotified) {
          sendOverdueNotification(reminder)
          localStorage.setItem(key, now.toISOString())
        }
      })
    }

    checkAndNotify()

    const interval = setInterval(checkAndNotify, 30 * 60 * 1000)

    return () => clearInterval(interval)
  }, [reminders])
}

function sendNotification(reminder: any, hoursUntilDue: number) {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) return

  const title = hoursUntilDue <= 1 ? '⏰ Pago pendiente en 1 hora!' : `⏰ Pago pendiente en ${Math.round(hoursUntilDue)} horas`
  const body = `${reminder.title}${reminder.amount ? ` - $${reminder.amount.toLocaleString()}` : ''}`

  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification(title, {
      body,
      icon: '/finanzapplogo.png',
      badge: '/finanzapplogo.png',
      tag: `reminder-${reminder.id}`,
      data: { reminderId: reminder.id, url: '/reminders' },
      requireInteraction: true,
    } as NotificationOptions)
  })
}

function sendOverdueNotification(reminder: any) {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) return

  const title = '⚠️ Pago vencido!'
  const body = `${reminder.title}${reminder.amount ? ` - $${reminder.amount.toLocaleString()}` : ''}`

  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification(title, {
      body,
      icon: '/finanzapplogo.png',
      badge: '/finanzapplogo.png',
      tag: `reminder-overdue-${reminder.id}`,
      data: { reminderId: reminder.id, url: '/reminders' },
      requireInteraction: true,
    } as NotificationOptions)
  })
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export async function testNotification() {
  if (!('serviceWorker' in navigator)) return

  const registration = await navigator.serviceWorker.ready
  registration.showNotification('🔔 FinanzApp', {
    body: 'Las notificaciones están funcionando correctamente!',
    icon: '/finanzapplogo.png',
    badge: '/finanzapplogo.png',
    tag: 'test-notification'
  })
}