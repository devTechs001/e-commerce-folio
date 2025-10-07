import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Sparkles, FileText, Palette, Search } from 'lucide-react'

const AIDashboard = () => {
  const location = useLocation()
  
  const tabs = [
    { name: 'Insights', href: '/dashboard/ai', icon: Sparkles },
    { name: 'Content Generator', href: '/dashboard/ai/content', icon: FileText },
    { name: 'Design Optimizer', href: '/dashboard/ai/design', icon: Palette },
    { name: 'SEO Suggestions', href: '/dashboard/ai/seo', icon: Search }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
          <p className="mt-2 text-gray-600">Enhance your portfolio with AI-powered suggestions</p>
        </div>
        <div className="badge-primary">
          <Sparkles className="w-4 h-4 mr-1 inline" />
          Pro Feature
        </div>
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

export default AIDashboard
