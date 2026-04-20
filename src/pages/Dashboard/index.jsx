import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useFinance } from '../../context/FinanceContext'
import { useBudget, useCurrency } from '../../hooks'
import { CATEGORY_COLORS } from '../../utils/currencyFormatter'
import { SpendingPieChart } from '../../components/Charts'
import BudgetCard from '../../components/BudgetCard'
import CurrencyConverter from '../../components/CurrencyConverter'
import StatCard from '../../components/StatCard'
import TransactionCard from '../../components/TransactionCard'
import { RiArrowRightLine } from 'react-icons/ri'
import { format as formatDate, parseISO } from 'date-fns'

export default function Dashboard() {
  const { transactions } = useFinance()
  const { budget, monthlyExpenses, remaining, percentUsed } = useBudget()
  const { selectedCurrency, setSelectedCurrency, supportedCurrencies, format, convertAmount, symbol } = useCurrency()

  const totalIncome = useMemo(() => transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + convertAmount(t.amount, 'INR', selectedCurrency), 0)
  , [transactions, convertAmount, selectedCurrency])

  const totalExpenses = useMemo(() => transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + convertAmount(t.amount, 'INR', selectedCurrency), 0)
  , [transactions, convertAmount, selectedCurrency])

  const netBalance = totalIncome - totalExpenses

  const categoryData = useMemo(() => {
    const map = {}
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const converted = convertAmount(t.amount, 'INR', selectedCurrency)
      map[t.category] = (map[t.category] || 0) + converted
    })
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [transactions, convertAmount, selectedCurrency])

  const topCategory = categoryData[0]
  const recent = transactions.slice(0, 5)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Overview</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{formatDate(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-400">
          <span>Currency</span>
          <select
            value={selectedCurrency}
            onChange={e => setSelectedCurrency(e.target.value)}
            className="input input-sm"
          >
            {supportedCurrencies.map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Net Balance" value={format(netBalance)} accent={netBalance >= 0 ? 'green' : 'red'} />
        <StatCard label="Total Income" value={format(totalIncome)} accent="green" />
        <StatCard label="Total Expenses" value={format(totalExpenses)} accent="red" />
        <StatCard label="Top Category" value={topCategory?.name || '—'} sub={topCategory ? format(topCategory.value) : ''} />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Budget */}
        <BudgetCard
          budget={budget}
          monthlyExpenses={monthlyExpenses}
          remaining={remaining}
          percentUsed={percentUsed}
        />

        {/* Currency Converter */}
        <CurrencyConverter />
      </div>

      <div className="card mb-6">
        <p className="label mb-3">Spending by Category</p>
        {categoryData.length > 0 ? (
          <SpendingPieChart data={categoryData} currencySymbol={symbol()} />
        ) : (
          <div className="flex items-center justify-center h-48 text-zinc-600 text-sm">No expense data</div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <p className="label">Recent Transactions</p>
          <Link to="/transactions" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
            View all <RiArrowRightLine />
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {recent.length > 0 ? recent.map(tx => (
            <TransactionCard key={tx.id} tx={tx} />
          )) : (
            <p className="text-sm text-zinc-600 py-6 text-center">No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
