import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useFinance } from '../../context/FinanceContext'
import { useCurrency } from '../../hooks'
import { CATEGORIES } from '../../utils/currencyFormatter'
import { format } from 'date-fns'

const schema = yup.object({
  title: yup.string().required('Title is required').min(2, 'Too short'),
  amount: yup.number().typeError('Enter a valid amount').positive('Must be positive').required('Amount is required'),
  category: yup.string().required('Category is required'),
  type: yup.string().oneOf(['income', 'expense']).required(),
  date: yup.string().required('Date is required'),
  notes: yup.string().optional(),
  recurring: yup.boolean().default(false),
})

export default function AddTransaction() {
  const { addTransaction } = useFinance()
  const { selectedCurrency, convertAmount, symbol } = useCurrency()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'expense',
      date: format(new Date(), 'yyyy-MM-dd'),
      recurring: false,
    },
  })

  const type = watch('type')

  const onSubmit = (data) => {
    const amountInINR = selectedCurrency === 'INR'
      ? Number(data.amount)
      : convertAmount(data.amount, selectedCurrency, 'INR')

    addTransaction({ ...data, amount: amountInINR })
    toast.success('Transaction added!', {
      style: { background: '#18181b', color: '#f4f4f5', border: '1px solid #27272a' },
    })
    reset()
    navigate('/transactions')
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-100">Add Transaction</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Record a new income or expense</p>
      </div>

      <div className="card">
        {/* Type toggle */}
        <div className="mb-5">
          <label className="label">Type</label>
          <div className="flex gap-2 p-1 bg-zinc-800 rounded-xl w-fit">
            {['expense', 'income'].map(t => (
              <label key={t} className={`px-5 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                type === t
                  ? t === 'income' ? 'bg-emerald-500 text-zinc-950' : 'bg-rose-500 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}>
                <input type="radio" value={t} {...register('type')} className="sr-only" />
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="label">Title</label>
            <input {...register('title')} className="input" placeholder="e.g. Grocery shopping" />
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title.message}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="label">Amount ({symbol(selectedCurrency)})</label>
            <input type="number" step="0.01" {...register('amount')} className="input font-mono" placeholder="0" />
            {errors.amount && <p className="text-xs text-rose-400 mt-1">{errors.amount.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="label">Category</label>
            <select {...register('category')} className="input">
              <option value="">Select category</option>
              {type === 'income'
                ? <option value="Income">Income</option>
                : CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)
              }
            </select>
            {errors.category && <p className="text-xs text-rose-400 mt-1">{errors.category.message}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="label">Date</label>
            <input type="date" {...register('date')} className="input" />
            {errors.date && <p className="text-xs text-rose-400 mt-1">{errors.date.message}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="label">Notes <span className="normal-case text-zinc-600">(optional)</span></label>
            <textarea {...register('notes')} className="input resize-none h-20" placeholder="Any additional details..." />
          </div>

          {/* Recurring */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input type="checkbox" {...register('recurring')} className="sr-only peer" />
              <div className="w-9 h-5 bg-zinc-700 peer-checked:bg-emerald-500 rounded-full transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
            </div>
            <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">Mark as recurring</span>
          </label>

          {/* Submit */}
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
              {isSubmitting ? 'Saving...' : 'Save Transaction'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-ghost">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
