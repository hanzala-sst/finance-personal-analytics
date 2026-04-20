import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { fetchExchangeRates } from '../services/api'
import { supportedCurrencies } from '../utils/currencyFormatter'

const FinanceContext = createContext(null)

const SEED_TRANSACTIONS = [
  { id: uuidv4(), title: 'Monthly Salary', amount: 75000, category: 'Income', type: 'income', date: '2024-01-01', notes: 'January salary', recurring: true },
  { id: uuidv4(), title: 'Rent Payment', amount: 18000, category: 'Rent', type: 'expense', date: '2024-01-02', notes: 'Monthly rent', recurring: true },
  { id: uuidv4(), title: 'Grocery Shopping', amount: 3200, category: 'Food', type: 'expense', date: '2024-01-05', notes: 'Weekly groceries', recurring: false },
  { id: uuidv4(), title: 'Netflix', amount: 649, category: 'Subscriptions', type: 'expense', date: '2024-01-06', notes: 'Streaming', recurring: true },
  { id: uuidv4(), title: 'Gym Membership', amount: 1500, category: 'Health', type: 'expense', date: '2024-01-07', notes: 'Monthly gym', recurring: true },
  { id: uuidv4(), title: 'Electricity Bill', amount: 2100, category: 'Utilities', type: 'expense', date: '2024-01-10', notes: 'Power bill', recurring: false },
  { id: uuidv4(), title: 'Restaurant Dinner', amount: 1800, category: 'Food', type: 'expense', date: '2024-01-12', notes: 'Dinner with friends', recurring: false },
  { id: uuidv4(), title: 'Flight Tickets', amount: 8500, category: 'Travel', type: 'expense', date: '2024-01-15', notes: 'Weekend trip', recurring: false },
  { id: uuidv4(), title: 'Freelance Project', amount: 12000, category: 'Income', type: 'income', date: '2024-01-18', notes: 'Web dev project', recurring: false },
  { id: uuidv4(), title: 'Amazon Shopping', amount: 4300, category: 'Shopping', type: 'expense', date: '2024-01-20', notes: 'Clothes and accessories', recurring: false },
  { id: uuidv4(), title: 'Movie Tickets', amount: 800, category: 'Entertainment', type: 'expense', date: '2024-01-22', notes: 'Weekend movie', recurring: false },
  { id: uuidv4(), title: 'Internet Bill', amount: 999, category: 'Utilities', type: 'expense', date: '2024-01-25', notes: 'Broadband', recurring: true },
  { id: uuidv4(), title: 'February Salary', amount: 75000, category: 'Income', type: 'income', date: '2024-02-01', notes: 'February salary', recurring: true },
  { id: uuidv4(), title: 'Rent Payment', amount: 18000, category: 'Rent', type: 'expense', date: '2024-02-02', notes: 'Monthly rent', recurring: true },
  { id: uuidv4(), title: 'Pharmacy', amount: 1200, category: 'Health', type: 'expense', date: '2024-02-08', notes: 'Medicines', recurring: false },
  { id: uuidv4(), title: 'Zomato', amount: 2400, category: 'Food', type: 'expense', date: '2024-02-14', notes: "Valentine's dinner delivery", recurring: false },
  { id: uuidv4(), title: 'Spotify', amount: 119, category: 'Subscriptions', type: 'expense', date: '2024-02-15', notes: 'Music streaming', recurring: true },
  { id: uuidv4(), title: 'Metro Card Recharge', amount: 500, category: 'Travel', type: 'expense', date: '2024-02-18', notes: 'Monthly commute', recurring: true },
]

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('finance_transactions')
      return saved ? JSON.parse(saved) : SEED_TRANSACTIONS
    } catch {
      return SEED_TRANSACTIONS
    }
  })

  const [budget, setBudget] = useState(() => {
    try {
      const saved = localStorage.getItem('finance_budget')
      return saved ? JSON.parse(saved) : { monthlyBudget: 50000 }
    } catch {
      return { monthlyBudget: 50000 }
    }
  })

  const [selectedCurrency, setSelectedCurrency] = useState('INR')
  const [rates, setRates] = useState({ INR: 1 })
  const [currencyError, setCurrencyError] = useState('')

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('finance_budget', JSON.stringify(budget))
  }, [budget])

  useEffect(() => {
    async function loadRates() {
      const fetchedRates = await fetchExchangeRates()
      if (fetchedRates) {
        setRates({ INR: 1, ...fetchedRates })
        setCurrencyError('')
      } else {
        setCurrencyError('Unable to load exchange rates. Please try again later.')
      }
    }

    loadRates()
  }, [])

  const convertAmount = useCallback((amount, fromCurrency = 'INR', toCurrency = selectedCurrency) => {
    const value = Number(amount)
    if (Number.isNaN(value)) return 0
    if (fromCurrency === toCurrency) return value

    const fromRate = fromCurrency === 'INR' ? 1 : rates[fromCurrency]
    const toRate = toCurrency === 'INR' ? 1 : rates[toCurrency]

    if (!fromRate || !toRate) return value
    return value * (toRate / fromRate)
  }, [rates, selectedCurrency])

  const addTransaction = (data) => {
    const tx = { ...data, id: uuidv4() }
    setTransactions(prev => [tx, ...prev])
  }

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const updateTransaction = (id, data) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))
  }

  const updateBudget = (newBudget) => {
    setBudget(newBudget)
  }

  return (
    <FinanceContext.Provider value={{
      transactions,
      budget,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      updateBudget,
      selectedCurrency,
      setSelectedCurrency,
      supportedCurrencies,
      rates,
      currencyError,
      convertAmount,
    }}>
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider')
  return ctx
}
