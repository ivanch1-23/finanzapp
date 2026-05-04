'use client'

import { TransactionForm } from '@/components/TransactionForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PageTransition, FadeIn } from '@/components/Animations'

export const dynamic = 'force-dynamic'

export default function AddPage() {
  return (
    <PageTransition className="pb-32">

      <main className="max-w-md mx-auto p-4 space-y-5">

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
              <h1 className="text-xl font-bold">Nueva transacción</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Registra un movimiento</p>
            </div>
          </div>
        </FadeIn>
        <TransactionForm />
      </main>
    </PageTransition>
  )
}

