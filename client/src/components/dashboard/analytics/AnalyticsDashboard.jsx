import React, { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Globe, Search, Eye, Users, Clock, Target, ArrowUp, ArrowDown, Download, RefreshCw } from 'lucide-react'

const AnalyticsDashboard = () => {
  const location = useLocation()
  const [refreshing, setRefreshing] = useState(false)
  const [quickStats, setQuickStats] = useState({
    pageViews: 12543,
    uniqueVisitors: 8234,
    avgDuration: '3:42',
    bounceRate: 42.3,
    viewsChange: 12.5,
    visitorsChange: 8.3,
    durationChange: -2.1,
    bounceChange: -5.4
  })

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }
  
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
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600">Track your portfolio performance and visitor insights</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="h-4 w-4" />
            Export
          </motion.button>
        </div>
      </motion.div>
      
      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <span className={`flex items-center text-sm font-medium ${
              quickStats.viewsChange > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {quickStats.viewsChange > 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              {Math.abs(quickStats.viewsChange)}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{quickStats.pageViews.toLocaleString()}</h3>
          <p className="text-sm text-gray-600 mt-1">Total Page Views</p>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <span className={`flex items-center text-sm font-medium ${
              quickStats.visitorsChange > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {quickStats.visitorsChange > 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              {Math.abs(quickStats.visitorsChange)}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{quickStats.uniqueVisitors.toLocaleString()}</h3>
          <p className="text-sm text-gray-600 mt-1">Unique Visitors</p>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <span className={`flex items-center text-sm font-medium ${
              quickStats.durationChange > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {quickStats.durationChange > 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              {Math.abs(quickStats.durationChange)}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{quickStats.avgDuration}</h3>
          <p className="text-sm text-gray-600 mt-1">Avg. Session Duration</p>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
            <span className={`flex items-center text-sm font-medium ${
              quickStats.bounceChange < 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {quickStats.bounceChange < 0 ? <ArrowDown className="h-4 w-4 mr-1" /> : <ArrowUp className="h-4 w-4 mr-1" />}
              {Math.abs(quickStats.bounceChange)}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{quickStats.bounceRate}%</h3>
          <p className="text-sm text-gray-600 mt-1">Bounce Rate</p>
        </motion.div>
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
