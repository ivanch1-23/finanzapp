'use client'

import { TransactionList } from '@/components/TransactionList'
import { ArrowLeft, FileText } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PageTransition, FadeIn } from '@/components/Animations'

export const dynamic = 'force-dynamic'

export default function HistoryPage() {
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
              <FileText className="h-5 w-5 text-slate-500" />
              <div>
                <h1 className="text-lg font-semibold">Historial</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Todos tus movimientos</p>
              </div>
            </div>
          </div>
        </FadeIn>
        <TransactionList />
      </main>
    </PageTransition>
  )
}
