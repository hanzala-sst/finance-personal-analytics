import { AnimatePresence } from 'framer-motion'
import { useTransactions } from '../../hooks'
import TransactionCard from '../../components/TransactionCard'
import SearchBar from '../../components/SearchBar'
import Filters from '../../components/Filters'
import { Link } from 'react-router-dom'
import { RiAddLine } from 'react-icons/ri'

export default function Transactions() {
  const {
    transactions,
    search, setSearch,
    filters, setFilters,
    sort, setSort,
  } = useTransactions()

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Transactions</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{transactions.length} records</p>
        </div>
        <Link to="/transactions/new" className="btn-primary flex items-center gap-1.5">
          <RiAddLine /> Add
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 mb-5">
        <SearchBar value={search} onChange={setSearch} />
        <Filters filters={filters} setFilters={setFilters} sort={sort} setSort={setSort} />
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {transactions.length > 0 ? (
            transactions.map(tx => <TransactionCard key={tx.id} tx={tx} />)
          ) : (
            <div className="text-center py-16 text-zinc-600">
              <p className="text-sm">No transactions found</p>
              <Link to="/transactions/new" className="text-emerald-400 text-xs mt-2 inline-block hover:text-emerald-300">
                Add your first transaction →
              </Link>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
