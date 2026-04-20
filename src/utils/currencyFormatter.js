export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  SGD: 'S$',
}

export const supportedCurrencies = Object.keys(CURRENCY_SYMBOLS)

export const getCurrencySymbol = (currency) => CURRENCY_SYMBOLS[currency] || currency

const getLocale = (currency) => currency === 'INR' ? 'en-IN' : 'en-US'

export const formatCurrency = (amount, currency = 'INR') => {
  const value = Number(amount)
  if (Number.isNaN(value)) return ''

  const symbol = getCurrencySymbol(currency)
  const locale = getLocale(currency)
  const formattedNumber = value.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${symbol}${formattedNumber}`
}

export const formatINR = (amount) => formatCurrency(amount, 'INR')

export const CATEGORIES = [
  'Food', 'Travel', 'Rent', 'Shopping',
  'Entertainment', 'Health', 'Utilities', 'Subscriptions',
]

export const CATEGORY_COLORS = {
  Food: '#f97316',
  Travel: '#3b82f6',
  Rent: '#a855f7',
  Shopping: '#ec4899',
  Entertainment: '#eab308',
  Health: '#10b981',
  Utilities: '#6366f1',
  Subscriptions: '#14b8a6',
  Income: '#22c55e',
}
