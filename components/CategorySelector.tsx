'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCategoryStore } from '@/stores/categories'
import { EMOJI_OPTIONS, CATEGORY_COLORS } from '@/lib/types'
import { Plus, X, Check } from 'lucide-react'
import { useEffect } from 'react'

interface CategorySelectorProps {
  value: string
  onChange: (category: string) => void
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const categories = useCategoryStore((s) => s.getAllWithDefaults())
  const load = useCategoryStore((s) => s.load)
  const add = useCategoryStore((s) => s.add)
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmoji, setNewEmoji] = useState('📌')
  const [newColor, setNewColor] = useState<string>(CATEGORY_COLORS[0])

  useEffect(() => {
    load()
  }, [load])

  const handleAddCategory = async () => {
    if (!newName.trim()) return

    await add({
      user_id: '',
      name: newName.trim(),
      emoji: newEmoji,
      color: newColor,
    })

    onChange(newName.trim())
    setNewName('')
    setNewEmoji('📌')
    setNewColor(CATEGORY_COLORS[0])
    setShowForm(false)
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.name)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
              value === cat.name
                ? 'border-sky-400 bg-sky-50 dark:bg-sky-900/30'
                : 'border-transparent bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span className="text-xl">{cat.emoji}</span>
            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 truncate w-full text-center">
              {cat.name}
            </span>
          </button>
        ))}

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex flex-col items-center gap-1 p-2 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-all"
        >
          <Plus className="h-5 w-5 text-slate-400" />
          <span className="text-[10px] font-medium text-slate-400">Nueva</span>
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold">Crear categoría</h4>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>

              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nombre de la categoría"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 px-3 text-sm outline-none focus:border-sky-400"
              />

              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Emoji</p>
                <div className="flex flex-wrap gap-1">
                  {EMOJI_OPTIONS.slice(0, 20).map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setNewEmoji(e)}
                      className={`p-2 text-lg rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all ${newEmoji === e ? 'bg-sky-100 dark:bg-sky-900/50' : ''}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Color</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewColor(c)}
                      className={`w-8 h-8 rounded-full transition-all ${newColor === c ? 'ring-2 ring-offset-2 ring-sky-400' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <motion.button
                type="button"
                onClick={handleAddCategory}
                disabled={!newName.trim()}
                whileTap={{ scale: 0.97 }}
                className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                Crear categoría
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}