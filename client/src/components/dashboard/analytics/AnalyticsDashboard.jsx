import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { BarChart3, TrendingUp, Globe, Search } from 'lucide-react'

const AnalyticsDashboard = () => {
  const location = useLocation()
  
  const tabs = [
    { name: 'Overview', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'SEO Analysis', href: '/dashboard/analytics/seo', icon: Search },
    { name: 'Traffic Sources', href: '/dashboard/analytics/traffic', icon: TrendingUp },
    { name: 'Visitor Map', href: '/dashboard/analytics/visitors', icon: Globe }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-gray-600">Track your portfolio performance and visitor insights</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Link
                key={tab.name}
                to={tab.href}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive(tab.href)
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <Outlet />
    </div>
  )
}

export default AnalyticsDashboard
