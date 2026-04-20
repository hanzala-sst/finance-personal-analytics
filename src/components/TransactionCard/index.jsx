import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiDeleteBin6Line, RiEditLine, RiRepeatLine, RiCheckLine, RiCloseLine } from 'react-icons/ri'
import { format as formatDate, parseISO } from 'date-fns'
import { CATEGORY_COLORS } from '../../utils/currencyFormatter'
import { useFinance } from '../../context/FinanceContext'
import { useCurrency } from '../../hooks'

export default function TransactionCard({ tx }) {
  const { deleteTransaction, updateTransaction } = useFinance()
  const { format } = useCurrency()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(tx.title)
  const [amount, setAmount] = useState(tx.amount)

  const dot = CATEGORY_COLORS[tx.category] || '#6b7280'

  const save = () => {
    updateTransaction(tx.id, { title, amount: Number(amount) })
    setEditing(false)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors group"
    >
      {/* Color dot */}
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dot }} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            className="input py-1 text-sm mb-1"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-zinc-100 truncate">{tx.title}</span>
            {tx.recurring && (
              <RiRepeatLine className="text-emerald-400 text-xs flex-shrink-0" title="Recurring" />
            )}
          </div>
        )}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-zinc-500">{tx.category}</span>
          <span className="text-zinc-700">·</span>
          <span className="text-xs text-zinc-500">
            {formatDate(parseISO(tx.date), 'MMM d, yyyy')}
          </span>
        </div>
      </div>

      {/* Amount */}
      <div className="text-right flex-shrink-0">
        {editing ? (
          <input
            type="number"
            className="input py-1 text-sm w-28 text-right"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        ) : (
          <span className={`text-sm font-semibold font-mono ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {tx.type === 'income' ? '+' : '-'}{format(tx.amount)}
          </span>
        )}
        <div className="mt-0.5">
          <span className={tx.type === 'income' ? 'badge-income' : 'badge-expense'}>
            {tx.type}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <AnimatePresence mode="wait">
          {editing ? (
            <motion.div key="edit-actions" className="flex gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button onClick={save} className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-400">
                <RiCheckLine />
              </button>
              <button onClick={() => setEditing(false)} className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-400">
                <RiCloseLine />
              </button>
            </motion.div>
          ) : (
            <motion.div key="view-actions" className="flex gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100">
                <RiEditLine className="text-sm" />
              </button>
              <button onClick={() => deleteTransaction(tx.id)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400">
                <RiDeleteBin6Line className="text-sm" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
