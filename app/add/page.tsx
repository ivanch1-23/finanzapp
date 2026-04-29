'use client'

import { TransactionForm } from '@/components/TransactionForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PageTransition, FadeIn } from '@/components/Animations'

export default function AddPage() {
  return (
    <PageTransition>
      <main className="max-w-md mx-auto p-4 space-y-5">
        <FadeIn>
          <div className="flex items-center gap-3">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary shadow-sm transition-shadow hover:shadow-md"
              >
                <ArrowLeft className="h-4 w-4" />
              </motion.div>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Nueva transacción</h1>
              <p className="text-xs text-muted-foreground">Registra un movimiento</p>
            </div>
          </div>
        </FadeIn>
        <TransactionForm />
      </main>
    </PageTransition>
  )
}
