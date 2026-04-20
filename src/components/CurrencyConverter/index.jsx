import { useState, useEffect } from 'react'
import { useCurrency } from '../../hooks'

export default function CurrencyConverter() {
  const { supportedCurrencies, currencyError, convertAmount } = useCurrency()
  const [amount, setAmount] = useState('1000')
  const [fromCurrency, setFromCurrency] = useState('INR')
  const [toCurrency, setToCurrency] = useState('USD')
  const [convertedValue, setConvertedValue] = useState('')

  useEffect(() => {
    const value = Number(amount)
    if (Number.isNaN(value)) {
      setConvertedValue('')
      return
    }

    const result = convertAmount(value, fromCurrency, toCurrency)
    setConvertedValue(result.toFixed(2))
  }, [amount, fromCurrency, toCurrency, convertAmount])

  return (
    <div className="card">
      <p className="label mb-4">Currency Converter</p>
      <div className="grid gap-3">
        <label className="block">
          <span className="text-xs text-zinc-400">Amount</span>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="input w-full"
            placeholder="Enter amount"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs text-zinc-400">From</span>
            <select
              value={fromCurrency}
              onChange={e => setFromCurrency(e.target.value)}
              className="input w-full"
            >
              {supportedCurrencies.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs text-zinc-400">To</span>
            <select
              value={toCurrency}
              onChange={e => setToCurrency(e.target.value)}
              className="input w-full"
            >
              {supportedCurrencies.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-md bg-zinc-900 p-4">
          {currencyError ? (
            <p className="text-sm text-rose-400">{currencyError}</p>
          ) : (
            <>
              <p className="text-sm text-zinc-400 mb-2">Converted amount</p>
              <p className="text-lg font-semibold text-white">
                {amount === '' || convertedValue === '' ? '—' : `${convertedValue} ${toCurrency}`}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
