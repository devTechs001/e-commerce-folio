import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, FileText, Palette, Search, Zap, Brain, Wand2, TrendingUp, Award } from 'lucide-react'

const AIDashboard = () => {
  const location = useLocation()
  const [aiStats] = useState({
    generationsToday: 24,
    totalGenerations: 1247,
    averageQuality: 94,
    timesSaved: '12.5hrs'
  })
  
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
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">AI Assistant</h1>
          <p className="mt-2 text-gray-600">Enhance your portfolio with AI-powered suggestions</p>
        </div>
        <motion.div 
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <Sparkles className="w-4 h-4" />
          <span className="font-semibold">Pro Feature</span>
        </motion.div>
      </motion.div>
      
      {/* AI Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded-full">Today</span>
          </div>
          <h3 className="text-2xl font-bold text-purple-900">{aiStats.generationsToday}</h3>
          <p className="text-sm text-purple-700 mt-1">AI Generations</p>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-blue-900">{aiStats.totalGenerations.toLocaleString()}</h3>
          <p className="text-sm text-blue-700 mt-1">Total Processed</p>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">Score</span>
          </div>
          <h3 className="text-2xl font-bold text-green-900">{aiStats.averageQuality}%</h3>
          <p className="text-sm text-green-700 mt-1">Quality Score</p>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-xs font-medium text-orange-700 bg-orange-100 px-2 py-1 rounded-full">Saved</span>
          </div>
          <h3 className="text-2xl font-bold text-orange-900">{aiStats.timesSaved}</h3>
          <p className="text-sm text-orange-700 mt-1">Time Saved</p>
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

export default AIDashboard
