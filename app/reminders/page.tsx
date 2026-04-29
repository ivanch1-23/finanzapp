'use client'

import { ReminderForm } from '@/components/ReminderForm'
import { ReminderList } from '@/components/ReminderList'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PageTransition, FadeIn } from '@/components/Animations'

export const dynamic = 'force-dynamic'

export default function RemindersPage() {
  return (
    <PageTransition>
      <main className="max-w-md mx-auto p-4 space-y-6">
        <FadeIn>
          <div className="flex items-center gap-3">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-sm transition-shadow hover:shadow-md"
              >
                <ArrowLeft className="h-4 w-4" />
              </motion.div>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Recordatorios</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">No olvides tus pagos</p>
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
