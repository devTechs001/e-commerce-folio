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
  HelpCircle,
  Shield,
  Package,
  Briefcase
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

const SideNavbar = ({ onClose }) => {
  const location = useLocation()
  const { user, hasRole } = useAuth()

  // Base navigation for all users
  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: []
    },
    {
      name: 'My Portfolio',
      href: '/dashboard/portfolio',
      icon: FileText,
      roles: []
    },
    {
      name: 'Workspace',
      href: '/dashboard/workspace',
      icon: Briefcase,
      roles: []
    },
    {
      name: 'Templates',
      href: '/dashboard/templates',
      icon: Palette,
      roles: []
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
      roles: [],
      submenu: [
        { name: 'Overview', href: '/dashboard/analytics' },
        { name: 'Visitors', href: '/dashboard/visitors' },
        { name: 'SEO Analysis', href: '/dashboard/analytics/seo' },
        { name: 'Traffic Sources', href: '/dashboard/analytics/traffic' }
      ]
    },
    {
      name: 'AI Assistant',
      href: '/dashboard/ai',
      icon: Zap,
      roles: [],
      badge: user?.subscription?.plan === 'free' ? 'Pro' : null,
      submenu: [
        { name: 'Insights', href: '/dashboard/ai' },
        { name: 'Content Generator', href: '/dashboard/ai/content' },
        { name: 'Design Optimizer', href: '/dashboard/ai/design' },
        { name: 'SEO Suggestions', href: '/dashboard/ai/seo' }
      ]
    },
    {
      name: 'Collaboration',
      href: '/dashboard/collaboration',
      icon: Users,
      roles: [],
      badge: user?.subscription?.plan === 'free' ? 'Pro' : null,
      submenu: [
        { name: 'Hub', href: '/dashboard/collaboration' },
        { name: 'Team Chat', href: '/dashboard/team/chat' },
        { name: 'Team Members', href: '/dashboard/team' }
      ]
    },
    {
      name: 'Billing',
      href: '/dashboard/billing',
      icon: CreditCard,
      roles: []
    }
  ]

  // Admin-only navigation
  const adminNavigation = [
    {
      name: 'Admin Panel',
      href: '/dashboard/admin',
      icon: Shield,
      roles: ['admin']
    },
    {
      name: 'User Management',
      href: '/dashboard/users',
      icon: Users,
      roles: ['admin']
    },
    {
      name: 'All Portfolios',
      href: '/dashboard/admin/portfolios',
      icon: Briefcase,
      roles: ['admin']
    },
    {
      name: 'Template Manager',
      href: '/dashboard/admin/templates',
      icon: Package,
      roles: ['admin']
    }
  ]

  const secondaryNavigation = [
    {
      name: 'Notifications',
      href: '/dashboard/notifications',
      icon: Bell,
      roles: []
    },
    {
      name: 'Themes',
      href: '/dashboard/themes',
      icon: Palette,
      roles: []
    },
    {
      name: 'Help & Support',
      href: '/dashboard/help',
      icon: HelpCircle,
      roles: []
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      roles: []
    }
  ]

  // Filter navigation based on roles
  const filterByRole = (items) => {
    return items.filter(item => {
      if (!item.roles || item.roles.length === 0) return true
      return item.roles.some(role => hasRole(role))
    })
  }

  const visibleNavigation = filterByRole(navigation)
  const visibleAdminNavigation = filterByRole(adminNavigation)
  const visibleSecondaryNavigation = filterByRole(secondaryNavigation)

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
          {/* Main Navigation */}
          {visibleNavigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={onClose}
              >
                <div className="flex items-center">
                  <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-primary-500 to-blue-500 text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}

          {/* Admin Navigation Section */}
          {visibleAdminNavigation.length > 0 && (
            <>
              <div className="pt-4 pb-2">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Administration
                </h3>
              </div>
              {visibleAdminNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-red-50 text-red-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={onClose}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${
                      isActive(item.href) ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`} />
                    {item.name}
                  </Link>
                )
              })}
            </>
          )}

          {/* Secondary Navigation */}
          <div className="pt-4 pb-2">
            <div className="border-t border-gray-200 my-2"></div>
          </div>
          {visibleSecondaryNavigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-600'
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