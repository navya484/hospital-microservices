import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  UsersRound,
  ReceiptText,
  ChartNoAxesCombined,
  Bell,
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  Stethoscope,
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patients', label: 'Patients', icon: UsersRound },
  { to: '/billing', label: 'Billing', icon: ReceiptText },
  { to: '/analytics', label: 'Analytics', icon: ChartNoAxesCombined },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function SidebarContent({
  collapsed,
  onToggleCollapse,
  isMobile,
  onCloseMobile,
}: {
  collapsed: boolean
  onToggleCollapse: () => void
  isMobile: boolean
  onCloseMobile: () => void
}) {
  const navigate = useNavigate()
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Branding */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-neutral-200 shrink-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary-600 text-white shrink-0">
          <Stethoscope size={20} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-neutral-900 truncate">
              Hospital Management
            </p>
            <p className="text-xs text-neutral-500 truncate">
              Healthcare Platform
            </p>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={isMobile ? onCloseMobile : undefined}
            className={({ isActive }) =>
              [
                'group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                collapsed ? 'justify-center' : '',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r bg-primary-600" />
                )}
                <Icon size={20} className="shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-xs text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 z-50">
                    {label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section: user + logout */}
      <div className="border-t border-neutral-200 p-3 shrink-0">
        <div
          className={[
            'flex items-center gap-3 rounded-md px-2 py-2',
            collapsed ? 'justify-center' : '',
          ].join(' ')}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary-100 text-secondary-700 text-xs font-semibold shrink-0">
            DR
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-neutral-900 truncate">
                Admin User
              </p>
              <p className="text-xs text-neutral-500 truncate">
                admin@hospital.com
              </p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem('token')
            navigate('/login', { replace: true })
          }}
          className={[
            'mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-neutral-600 hover:bg-error-50 hover:text-error-700 transition-colors',
            collapsed ? 'justify-center' : '',
          ].join(' ')}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        {!isMobile && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
          >
            {collapsed ? (
              <ChevronsRight size={16} />
            ) : (
              <>
                <ChevronsLeft size={16} />
                <span>Collapse</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={[
          'hidden lg:flex flex-col border-r border-neutral-200 transition-all duration-200 shrink-0',
          collapsed ? 'w-[76px]' : 'w-64',
        ].join(' ')}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
          isMobile={false}
          onCloseMobile={onCloseMobile}
        />
      </aside>

      {/* Mobile drawer + overlay */}
      <div
        className={[
          'lg:hidden fixed inset-0 z-40 transition-opacity duration-200',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      >
        <div
          className="absolute inset-0 bg-neutral-900/40"
          onClick={onCloseMobile}
        />
        <aside
          className={[
            'absolute left-0 top-0 h-full w-72 shadow-lg transition-transform duration-200',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          ].join(' ')}
        >
          <SidebarContent
            collapsed={false}
            onToggleCollapse={onToggleCollapse}
            isMobile={true}
            onCloseMobile={onCloseMobile}
          />
        </aside>
      </div>
    </>
  )
}