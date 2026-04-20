import { CATEGORIES } from '../../utils/currencyFormatter'

export default function Filters({ filters, setFilters, sort, setSort }) {
  const update = (key, val) => setFilters(prev => ({ ...prev, [key]: val }))
  const clearAll = () => setFilters({ category: '', type: '', startDate: '', endDate: '' })
  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Category */}
      <select
        className="input w-auto text-xs py-2"
        value={filters.category}
        onChange={e => update('category', e.target.value)}
      >
        <option value="">All Categories</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* Type */}
      <select
        className="input w-auto text-xs py-2"
        value={filters.type}
        onChange={e => update('type', e.target.value)}
      >
        <option value="">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* Date range */}
      <input
        type="date"
        className="input w-auto text-xs py-2"
        value={filters.startDate}
        onChange={e => update('startDate', e.target.value)}
      />
      <input
        type="date"
        className="input w-auto text-xs py-2"
        value={filters.endDate}
        onChange={e => update('endDate', e.target.value)}
      />

      {/* Sort */}
      <select
        className="input w-auto text-xs py-2"
        value={`${sort.field}-${sort.dir}`}
        onChange={e => {
          const [field, dir] = e.target.value.split('-')
          setSort({ field, dir })
        }}
      >
        <option value="date-desc">Newest First</option>
        <option value="date-asc">Oldest First</option>
        <option value="amount-desc">Highest Amount</option>
        <option value="amount-asc">Lowest Amount</option>
        <option value="category-asc">Category A–Z</option>
      </select>

      {hasFilters && (
        <button onClick={clearAll} className="btn-ghost text-xs py-2">
          Clear filters
        </button>
      )}
    </div>
  )
}
