import { Menu, Search, Bell } from 'lucide-react'
import { useLocation } from 'react-router-dom'

interface NavbarProps {
  onOpenMobileSidebar: () => void
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/patients': 'Patients',
  '/billing': 'Billing',
  '/analytics': 'Analytics',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
}

function getPageTitle(pathname: string): string {
  const match = Object.keys(pageTitles).find((path) =>
    pathname.startsWith(path)
  )
  return match ? pageTitles[match] : 'Hospital Management'
}

export default function Navbar({ onOpenMobileSidebar }: NavbarProps) {
  const location = useLocation()
  const title = getPageTitle(location.pathname)

  return (
    <header className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-neutral-200 bg-white shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-md text-neutral-600 hover:bg-neutral-100 shrink-0"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-neutral-900 truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          className="hidden sm:flex items-center justify-center w-9 h-9 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
        <button
          type="button"
          className="relative flex items-center justify-center w-9 h-9 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-error-500" />
        </button>
        <div className="flex items-center gap-2 pl-2 ml-1 border-l border-neutral-200">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">
            DR
          </div>
          <span className="hidden sm:inline text-sm font-medium text-neutral-700">
            admin@hospital.com
          </span>
        </div>
      </div>
    </header>
  )
}