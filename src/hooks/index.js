import { useState, useEffect, useMemo } from 'react'
import { useFinance } from '../context/FinanceContext'
import { formatCurrency, CURRENCY_SYMBOLS } from '../utils/currencyFormatter'
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns'

// useDebounce
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

// useTransactions — CRUD + filter/sort/search
export function useTransactions() {
  const { transactions, addTransaction, deleteTransaction, updateTransaction } = useFinance()

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ category: '', type: '', startDate: '', endDate: '' })
  const [sort, setSort] = useState({ field: 'date', dir: 'desc' })

  const debouncedSearch = useDebounce(search)

  const filtered = useMemo(() => {
    let list = [...transactions]

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) || (t.notes || '').toLowerCase().includes(q)
      )
    }

    if (filters.category) list = list.filter(t => t.category === filters.category)
    if (filters.type) list = list.filter(t => t.type === filters.type)
    if (filters.startDate && filters.endDate) {
      list = list.filter(t => {
        const d = parseISO(t.date)
        return isWithinInterval(d, { start: parseISO(filters.startDate), end: parseISO(filters.endDate) })
      })
    }

    list.sort((a, b) => {
      let av = a[sort.field], bv = b[sort.field]
      if (sort.field === 'date') { av = new Date(av); bv = new Date(bv) }
      if (sort.field === 'amount') { av = Number(av); bv = Number(bv) }
      if (sort.field === 'category') { av = av.toLowerCase(); bv = bv.toLowerCase() }
      return sort.dir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })

    return list
  }, [transactions, debouncedSearch, filters, sort])

  return {
    transactions: filtered,
    allTransactions: transactions,
    search, setSearch,
    filters, setFilters,
    sort, setSort,
    addTransaction, deleteTransaction, updateTransaction,
  }
}

// useBudget
export function useBudget() {
  const { transactions, budget, updateBudget } = useFinance()

  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const monthlyExpenses = useMemo(() => {
    return transactions
      .filter(t => {
        if (t.type !== 'expense') return false
        try {
          return isWithinInterval(parseISO(t.date), { start: monthStart, end: monthEnd })
        } catch { return false }
      })
      .reduce((sum, t) => sum + Number(t.amount), 0)
  }, [transactions])

  const remaining = budget.monthlyBudget - monthlyExpenses
  const percentUsed = budget.monthlyBudget > 0
    ? Math.min((monthlyExpenses / budget.monthlyBudget) * 100, 100)
    : 0

  return { budget, updateBudget, monthlyExpenses, remaining, percentUsed }
}

// useCurrency
export function useCurrency() {
  const {
    selectedCurrency,
    setSelectedCurrency,
    supportedCurrencies,
    rates,
    currencyError,
    convertAmount,
  } = useFinance()

  const format = (amount, currency = selectedCurrency) => formatCurrency(amount, currency)
  const symbol = (currency = selectedCurrency) => CURRENCY_SYMBOLS[currency] || currency

  return {
    selectedCurrency,
    setSelectedCurrency,
    supportedCurrencies,
    rates,
    currencyError,
    convertAmount,
    format,
    symbol,
  }
}
