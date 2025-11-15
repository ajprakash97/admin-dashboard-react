import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useToast } from '../contexts/ToastContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/advanced-analytics', label: 'Advanced Analytics' },
  { to: '/users', label: 'Users' },
  { to: '/products', label: 'Products' },
  { to: '/reports', label: 'Reports' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/content', label: 'Content' },
  { to: '/files', label: 'Files' },
  { to: '/custom-fields', label: 'Custom Fields' },
  { to: '/data-insights', label: 'Data & Insights' },
  { to: '/settings', label: 'Settings' },
]

export const DashboardLayout = () => {
  const [unreadCount] = useState(3) // In a real app, this would come from state/API
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { showToast } = useToast()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const handleLogout = () => {
    // In a real app, this would clear auth tokens, call logout API, etc.
    showToast('Logged out successfully', 'success')
    setShowUserMenu(false)
    // In a real app, navigate to login page
    // navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-900">
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white md:block">
        <div className="flex h-16 items-center px-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white">
              AD
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Admin Dashboard</p>
              <p className="text-xs text-slate-500">Multipurpose Control Panel</p>
            </div>
          </Link>
        </div>
        <nav className="mt-4 space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand/10 text-brand'
                    : 'text-slate-600 hover:bg-gray-100 hover:text-slate-900',
                ].join(' ')
              }
            >
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur">
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white">
              AD
            </div>
            <span className="text-sm font-semibold text-slate-900">Admin Dashboard</span>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm hover:border-gray-400"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Live
            </button>
            <Link
              to="/notifications"
              className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-xs font-medium text-slate-700 hover:border-gray-400"
            >
              <span className="text-base">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-xs font-medium text-slate-700 hover:border-gray-400 transition-colors"
              >
                AK
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-10 z-50 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <div className="border-b border-gray-200 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">Admin User</p>
                    <p className="text-xs text-slate-600">admin@example.com</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate('/settings')
                        setShowUserMenu(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-gray-50"
                    >
                      <span className="mr-2">⚙️</span>
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        navigate('/profile')
                        setShowUserMenu(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-gray-50"
                    >
                      <span className="mr-2">👤</span>
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate('/account')
                        setShowUserMenu(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-gray-50"
                    >
                      <span className="mr-2">🔐</span>
                      Account
                    </button>
                    <div className="my-1 border-t border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                    >
                      <span className="mr-2">🚪</span>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 bg-gray-50">
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}


