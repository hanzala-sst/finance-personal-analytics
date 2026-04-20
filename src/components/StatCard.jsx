export default function StatCard({ label, value, sub, accent = 'default' }) {
  const accentColors = {
    green: 'text-emerald-400',
    red: 'text-rose-400',
    blue: 'text-blue-400',
    default: 'text-zinc-100',
  }
  return (
    <div className="card">
      <p className="label">{label}</p>
      <p className={`text-2xl font-semibold font-mono mt-1 ${accentColors[accent]}`}>{value}</p>
      {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
    </div>
  )
}
