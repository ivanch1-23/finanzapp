'use client'

import { motion } from 'framer-motion'
import { FadeIn, PageTransition } from '@/components/Animations'
import { PiggyBank, Target, TrendingUp, Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const META_EJEMPLO = 8000000
const ACTUAL_EJEMPLO = 2500000

const formatoPesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export default function SavingsPage() {
  const [metaTotal] = useState(META_EJEMPLO)
  const [montoActual] = useState(ACTUAL_EJEMPLO)

  const porcentaje = Math.min((montoActual / metaTotal) * 100, 100)
  const faltante = metaTotal - montoActual

  return (
    <PageTransition>
      <main className="max-w-md mx-auto p-4 space-y-5">
        <FadeIn>
          <div className="flex items-center gap-3">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-glass transition-all"
              >
                <ArrowLeft className="h-4 w-4 text-slate-600 dark:text-slate-300" strokeWidth={1.5} />
              </motion.div>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold">Mis Ahorros</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Sigue tu progreso</p>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-500/90 via-emerald-600/90 to-teal-600/90 backdrop-blur-xl border border-white/20 shadow-glass p-6">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-4 -bottom-12 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm border border-white/10">
                    <span className="text-base">🏺</span>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Meta de Ahorro</span>
                </div>
                <span className="text-xs font-bold text-emerald-200">{porcentaje.toFixed(1)}%</span>
              </div>

              <p className="text-3xl font-bold text-white mb-1">
                {formatoPesos.format(montoActual)}
              </p>

              <div className="flex items-center gap-1 mb-4">
                <Target className="h-3 w-3 text-emerald-200" strokeWidth={2} />
                <span className="text-xs text-emerald-200">
                  Meta: {formatoPesos.format(metaTotal)}
                </span>
              </div>

              <div className="h-3 w-full rounded-full bg-white/20 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${porcentaje}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-white/40 to-white/60"
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-emerald-200" strokeWidth={1.5} />
                  <span className="text-xs font-medium text-white/80">
                    +{formatoPesos.format(500000)} este mes
                  </span>
                </div>
                <span className="text-xs text-white/70">
                  Faltan {formatoPesos.format(faltante)}
                </span>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Link href="/add" className="block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-white/10 py-4 shadow-glass transition-all hover:bg-white/80 dark:hover:bg-slate-800/80"
            >
              <Plus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Agregar ahorro</span>
            </motion.div>
          </Link>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-white/20 dark:border-white/10 rounded-[2rem] p-4 shadow-glass">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Historial de metas</h2>

            <div className="space-y-3">
              {[
                { nombre: 'Vacaciones', meta: 3000000, actual: 3000000, completado: true },
                { nombre: 'Nuevo teléfono', meta: 2000000, actual: 1500000, completado: false },
                { nombre: '-emergency', meta: 1000000, actual: 400000, completado: false },
              ].map((meta, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.completado ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-sky-100 dark:bg-sky-900/30'}`}>
                    {meta.completado ? (
                      <span className="text-lg">✓</span>
                    ) : (
                      <span className="text-lg">🎯</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{meta.nombre}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatoPesos.format(meta.actual)} / {formatoPesos.format(meta.meta)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold ${meta.completado ? 'text-emerald-600 dark:text-emerald-400' : 'text-sky-600 dark:text-sky-400'}`}>
                      {((meta.actual / meta.meta) * 100).toFixed(0)}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>

        <div className="h-4" />
      </main>
    </PageTransition>
  )
}