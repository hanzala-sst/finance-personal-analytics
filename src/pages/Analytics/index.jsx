import { useMemo } from 'react'
import { useFinance } from '../../context/FinanceContext'
import { useCurrency } from '../../hooks'
import { SpendingPieChart, MonthlyLineChart, IncomeExpenseBar } from '../../components/Charts'
import StatCard from '../../components/StatCard'
import { format as formatDate, parseISO } from 'date-fns'

function groupByMonth(transactions, convertAmount, selectedCurrency) {
  const map = {}
  transactions.forEach(t => {
    try {
      const key = formatDate(parseISO(t.date), 'MMM yy')
      if (!map[key]) map[key] = { month: key, income: 0, expenses: 0 }
      if (t.type === 'income') map[key].income += convertAmount(t.amount, 'INR', selectedCurrency)
      else map[key].expenses += convertAmount(t.amount, 'INR', selectedCurrency)
    } catch {}
  })
  return Object.values(map).slice(-6)
}

export default function Analytics() {
  const { transactions } = useFinance()
  const { selectedCurrency, format, convertAmount, symbol } = useCurrency()

  const totalIncome = useMemo(() => transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + convertAmount(t.amount, 'INR', selectedCurrency), 0)
  , [transactions, convertAmount, selectedCurrency])

  const totalExpenses = useMemo(() => transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + convertAmount(t.amount, 'INR', selectedCurrency), 0)
  , [transactions, convertAmount, selectedCurrency])

  const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : 0

  const categoryData = useMemo(() => {
    const map = {}
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const value = convertAmount(t.amount, 'INR', selectedCurrency)
      map[t.category] = (map[t.category] || 0) + value
    })
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [transactions, convertAmount, selectedCurrency])

  const monthlyData = useMemo(
    () => groupByMonth(transactions, convertAmount, selectedCurrency),
    [transactions, convertAmount, selectedCurrency]
  )

  const recurring = useMemo(() => transactions.filter(t => t.recurring), [transactions])
  const recurringCost = useMemo(() => recurring
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + convertAmount(t.amount, 'INR', selectedCurrency), 0)
  , [recurring, convertAmount, selectedCurrency])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-100">Analytics</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Deep dive into your financial patterns</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Income" value={format(totalIncome)} accent="green" />
        <StatCard label="Total Expenses" value={format(totalExpenses)} accent="red" />
        <StatCard label="Savings Rate" value={`${savingsRate}%`} sub="of total income saved" accent={Number(savingsRate) > 20 ? 'green' : 'red'} />
        <StatCard label="Recurring Costs" value={format(recurringCost)} sub={`${recurring.length} recurring items`} />
      </div>

      {/* Charts row 1 */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="card">
          <p className="label mb-1">Spending by Category</p>
          {categoryData.length > 0
            ? <SpendingPieChart data={categoryData} currencySymbol={symbol()} />
            : <p className="text-sm text-zinc-600 text-center py-16">No data</p>
          }
        </div>
        <div className="card">
          <p className="label mb-1">Monthly Trend</p>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Income
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Expenses
            </div>
          </div>
          {monthlyData.length > 0
            ? <MonthlyLineChart data={monthlyData} currencySymbol={symbol()} />
            : <p className="text-sm text-zinc-600 text-center py-16">No data</p>
          }
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="card">
          <p className="label mb-1">Income vs Expenses</p>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Income
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Expenses
            </div>
          </div>
          {monthlyData.length > 0
            ? <IncomeExpenseBar data={monthlyData} currencySymbol={symbol()} />
            : <p className="text-sm text-zinc-600 text-center py-16">No data</p>
          }
        </div>

        {/* Category breakdown table */}
        <div className="card">
          <p className="label mb-3">Top Expense Categories</p>
          <div className="flex flex-col gap-2">
            {categoryData.slice(0, 6).map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-600 font-mono text-xs w-4">{i + 1}</span>
                  <span className="text-zinc-300">{item.name}</span>
                </div>
                <span className="font-mono text-zinc-400 text-xs">{format(item.value)}</span>
              </div>
            ))}
            {categoryData.length === 0 && (
              <p className="text-sm text-zinc-600 text-center py-8">No expense data</p>
            )}
          </div>
        </div>
      </div>

      {/* Recurring expenses */}
      {recurring.length > 0 && (
        <div className="card">
          <p className="label mb-3">Recurring Transactions</p>
          <div className="flex flex-col gap-2">
            {recurring.map(tx => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                <div>
                  <p className="text-sm text-zinc-200">{tx.title}</p>
                  <p className="text-xs text-zinc-500">{tx.category}</p>
                </div>
                <span className={`text-sm font-mono font-medium ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tx.type === 'income' ? '+' : '-'}{format(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
