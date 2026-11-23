import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/products', label: 'Daftar Produk' },
]

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 lg:flex">
      {/* sidebar */}
      <aside className="border-b border-slate-800 bg-slate-900/60 px-5 py-5 lg:min-h-screen lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
        <h1 className="mb-1 text-lg font-bold tracking-tight text-emerald-300">
          Product Manager
        </h1>
        <p className="mb-6 text-xs text-slate-500">Tugas 4 Pemrograman Web</p>

        <nav className="flex gap-2 lg:flex-col">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* konten halaman, ganti mengikuti URL */}
      <main className="flex-1 px-4 py-6 sm:px-8">
        <Outlet />
      </main>
    </div>
  )
}
