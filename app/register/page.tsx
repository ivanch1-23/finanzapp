'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { FadeIn } from '@/components/Animations'
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('¡Revisa tu correo para confirmar tu cuenta!')
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-md mx-auto p-4">
        <FadeIn>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-6 mb-8">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/finanzapplogo.png"
              alt="FinanzApp"
              width={80}
              height={80}
              className="rounded-2xl mb-4"
            />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">FinanzApp</h1>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white dark:bg-slate-800 shadow-xl p-6"
          >
            <h2 className="text-xl font-bold text-center mb-6 text-slate-900 dark:text-white">
              Crear cuenta
            </h2>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400"
              >
                {error}
              </motion.div>
            )}

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-sm text-teal-600 dark:text-teal-400"
              >
                {message}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                  Nombre (opcional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 pl-4 pr-4 text-sm font-medium outline-none transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 pl-12 pr-12 text-sm font-medium outline-none transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/30"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-sky-600 dark:text-sky-400 font-medium hover:underline">
                ¿Ya tienes cuenta? Inicia sesión
              </Link>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </main>
  )
}