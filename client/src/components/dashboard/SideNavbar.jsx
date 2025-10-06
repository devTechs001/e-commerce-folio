import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Settings, 
  Palette,
  Users,
  X,
  Zap,
  Globe,
  CreditCard,
  Bell,
  HelpCircle
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

const SideNavbar = ({ onClose }) => {
  const location = useLocation()
  const { user } = useAuth()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Portfolio',
      href: '/dashboard/portfolio',
      icon: FileText
    },
    {
      name: 'Templates',
      href: '/dashboard/templates',
      icon: Palette
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3
    },
    {
      name: 'AI Assistant',
      href: '/dashboard/ai',
      icon: Zap
    },
    {
      name: 'Team',
      href: '/dashboard/team',
      icon: Users
    },
    {
      name: 'Domains',
      href: '/dashboard/domains',
      icon: Globe
    },
    {
      name: 'Billing',
      href: '/dashboard/billing',
      icon: CreditCard
    }
  ]

  const secondaryNavigation = [
    {
      name: 'Notifications',
      href: '/dashboard/notifications',
      icon: Bell
    },
    {
      name: 'Help & Support',
      href: '/dashboard/help',
      icon: HelpCircle
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings
    }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
      {/* Logo and close button */}
      <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 border-b border-gray-200">
        <Link to="/dashboard" className="text-xl font-bold text-primary-600">
          E-Folio
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={onClose}
              >
                <Icon className={`mr-3 h-5 w-5 ${
                  isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                }`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User info */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-semibold text-sm">
                  {user?.profile?.firstName?.[0]}{user?.profile?.lastName?.[0]}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {user?.profile?.firstName} {user?.profile?.lastName}
              </p>
              <p className="text-xs font-medium text-gray-500">
                {user?.subscription?.plan === 'free' ? 'Free Plan' : 'Pro Plan'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideNavbar