'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCategoryStore } from '@/stores/categories'
import { CATEGORY_COLORS } from '@/lib/types'
import { Plus, X, Tag, Hash } from 'lucide-react'

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
  const [newColor, setNewColor] = useState<string>(CATEGORY_COLORS[0])

  useEffect(() => {
    load()
  }, [load])

  const handleAddCategory = async () => {
    if (!newName.trim()) return

    await add({
      user_id: '',
      name: newName.trim(),
      emoji: '', // Sin emoji
      color: newColor,
    })

    onChange(newName.trim())
    setNewName('')
    setNewColor(CATEGORY_COLORS[0])
    setShowForm(false)
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {categories.map((cat, index) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.name)}
            className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all ${
              value === cat.name
                ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800'
                : 'border-transparent bg-slate-100 dark:bg-slate-800 hover:bg-slate-150 dark:hover:bg-slate-700'
            }`}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold text-white"
              style={{ backgroundColor: cat.color || '#6366f1' }}
            >
              {cat.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 truncate w-full text-center">
              {cat.name}
            </span>
          </button>
        ))}

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
            <Plus className="h-4 w-4 text-slate-400" />
          </div>
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
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-slate-500" />
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Crear categoría</h4>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>

              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nombre de la categoría"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-slate-400 dark:focus:border-slate-500 transition-colors"
                />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Color</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewColor(c)}
                      className={`w-7 h-7 rounded-full transition-all ${
                        newColor === c 
                          ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-800 scale-110' 
                          : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <motion.button
                type="button"
                onClick={handleAddCategory}
                disabled={!newName.trim()}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-lg bg-slate-900 dark:bg-white py-2.5 text-sm font-medium text-white dark:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-slate-800 dark:hover:bg-slate-100"
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
