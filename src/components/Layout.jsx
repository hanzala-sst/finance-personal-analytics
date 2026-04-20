import { NavLink, Outlet } from 'react-router-dom'
import { RiDashboardLine, RiExchangeLine, RiAddCircleLine, RiWalletLine, RiBarChartLine } from 'react-icons/ri'
import { motion } from 'framer-motion'

const navItems = [
  { to: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
  { to: '/transactions', icon: RiExchangeLine, label: 'Transactions' },
  { to: '/transactions/new', icon: RiAddCircleLine, label: 'Add Transaction' },
  { to: '/budget', icon: RiWalletLine, label: 'Budget' },
  { to: '/analytics', icon: RiBarChartLine, label: 'Analytics' },
]

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-zinc-800 px-3 py-6 gap-1 fixed h-full bg-zinc-950">
        <div className="px-3 mb-6">
          <span className="font-mono text-sm font-medium text-emerald-400">finance.</span>
        </div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon className="text-base flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </aside>

      {/* Mobile nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-zinc-800 flex justify-around py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs transition-colors ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`
            }
          >
            <Icon className="text-lg" />
            <span className="hidden sm:block">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Main */}
      <main className="flex-1 md:ml-56 pb-20 md:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
