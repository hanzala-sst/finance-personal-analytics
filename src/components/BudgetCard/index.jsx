import { useCurrency } from '../../hooks'

export default function BudgetCard({ monthlyExpenses, remaining, percentUsed, budget }) {
  const { format } = useCurrency()
  const pct = Math.round(percentUsed)
  const isOver = remaining < 0
  const barColor = pct < 60 ? 'bg-emerald-500' : pct < 85 ? 'bg-amber-500' : 'bg-rose-500'

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="label">Monthly Budget</p>
          <p className="text-2xl font-semibold font-mono text-zinc-100">
            {format(budget.monthlyBudget)}
          </p>
        </div>
        <span className={`text-xs font-mono px-2 py-1 rounded-lg ${isOver ? 'bg-rose-500/10 text-rose-400' : 'bg-zinc-800 text-zinc-400'}`}>
          {pct}% used
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-zinc-800 rounded-full mb-4 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-800 rounded-xl p-3">
          <p className="text-xs text-zinc-500 mb-1">Spent</p>
          <p className="text-sm font-semibold font-mono text-rose-400">{format(monthlyExpenses)}</p>
        </div>
        <div className="bg-zinc-800 rounded-xl p-3">
          <p className="text-xs text-zinc-500 mb-1">{isOver ? 'Overspent' : 'Remaining'}</p>
          <p className={`text-sm font-semibold font-mono ${isOver ? 'text-rose-400' : 'text-emerald-400'}`}>
            {format(Math.abs(remaining))}
          </p>
        </div>
      </div>
    </div>
  )
}
