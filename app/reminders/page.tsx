'use client'

import { ReminderForm } from '@/components/ReminderForm'
import { ReminderList } from '@/components/ReminderList'
import { ArrowLeft, Bell } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PageTransition, FadeIn } from '@/components/Animations'

export const dynamic = 'force-dynamic'

export default function RemindersPage() {
  return (
    <PageTransition>
      <main className="max-w-lg mx-auto px-4 pt-6 pb-24 space-y-6">
        <FadeIn>
          <div className="flex items-center gap-3">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              </motion.div>
            </Link>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-slate-500" />
              <div>
                <h1 className="text-lg font-semibold">Recordatorios</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">No olvides tus pagos</p>
              </div>
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <ReminderForm />
        </FadeIn>
        <FadeIn delay={0.15}>
          <ReminderList />
        </FadeIn>
      </main>
    </PageTransition>
  )
}
