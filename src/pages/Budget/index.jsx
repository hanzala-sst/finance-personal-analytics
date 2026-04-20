import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useBudget, useCurrency } from '../../hooks'
import { CATEGORY_COLORS } from '../../utils/currencyFormatter'
import BudgetCard from '../../components/BudgetCard'
import { useFinance } from '../../context/FinanceContext'
import { useMemo } from 'react'
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns'

export default function Budget() {
  const { budget, updateBudget, monthlyExpenses, remaining, percentUsed } = useBudget()
  const { selectedCurrency, format, symbol, convertAmount } = useCurrency()
  const { transactions } = useFinance()
  const [editing, setEditing] = useState(false)
  const [newBudget, setNewBudget] = useState(() => convertAmount(budget.monthlyBudget, 'INR', selectedCurrency))

  useEffect(() => {
    setNewBudget(convertAmount(budget.monthlyBudget, 'INR', selectedCurrency))
  }, [budget.monthlyBudget, selectedCurrency, convertAmount])

  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const displayBudget = convertAmount(budget.monthlyBudget, 'INR', selectedCurrency)

  const categoryBreakdown = useMemo(() => {
    const map = {}
    transactions
      .filter(t => {
        if (t.type !== 'expense') return false
        try { return isWithinInterval(parseISO(t.date), { start: monthStart, end: monthEnd }) }
        catch { return false }
      })
      .forEach(t => {
        const value = convertAmount(t.amount, 'INR', selectedCurrency)
        map[t.category] = (map[t.category] || 0) + value
      })
    return Object.entries(map)
      .map(([cat, amount]) => ({ cat, amount, pct: displayBudget > 0 ? (amount / displayBudget) * 100 : 0 }))
      .sort((a, b) => b.amount - a.amount)
  }, [transactions, displayBudget, selectedCurrency, convertAmount])

  const save = () => {
    const val = Number(newBudget)
    if (!val || val <= 0) return
    const budgetInINR = convertAmount(val, selectedCurrency, 'INR')
    updateBudget({ monthlyBudget: budgetInINR })
    setEditing(false)
    toast.success('Budget updated!', {
      style: { background: '#18181b', color: '#f4f4f5', border: '1px solid #27272a' },
    })
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-100">Budget</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Track your monthly spending limits</p>
      </div>

      {/* Budget card */}
      <div className="mb-4">
        <BudgetCard budget={budget} monthlyExpenses={monthlyExpenses} remaining={remaining} percentUsed={percentUsed} />
      </div>

      {/* Edit budget */}
      <div className="card mb-5">
        <p className="label mb-3">Set Monthly Budget</p>
        {editing ? (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">{symbol(selectedCurrency)}</span>
              <input
                type="number"
                value={newBudget}
                onChange={e => setNewBudget(e.target.value)}
                className="input pl-7 font-mono"
                autoFocus
              />
            </div>
            <button onClick={save} className="btn-primary">Save</button>
            <button onClick={() => setEditing(false)} className="btn-ghost">Cancel</button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="font-mono text-zinc-300 text-sm">{format(budget.monthlyBudget)} / month</span>
            <button onClick={() => setEditing(true)} className="btn-ghost text-xs">Edit</button>
          </div>
        )}
      </div>

      {/* Category breakdown */}
      <div className="card">
        <p className="label mb-4">This Month by Category</p>
        {categoryBreakdown.length > 0 ? (
          <div className="flex flex-col gap-3">
            {categoryBreakdown.map(({ cat, amount, pct }) => (
              <div key={cat}>
                <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: CATEGORY_COLORS[cat] || '#6b7280' }} />
                    {cat}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-zinc-300">{format(amount)}</span>
                    <span className="text-zinc-600 w-10 text-right">{Math.round(pct)}%</span>
                  </div>
                </div>
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(pct, 100)}%`, background: CATEGORY_COLORS[cat] || '#6b7280' }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-600 text-center py-8">No expenses this month</p>
        )}
      </div>
    </div>
  )
}
