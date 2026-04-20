import { RiSearchLine, RiCloseLine } from 'react-icons/ri'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
      <input
        type="text"
        placeholder="Search transactions..."
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input pl-9 pr-9"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
        >
          <RiCloseLine />
        </button>
      )}
    </div>
  )
}
