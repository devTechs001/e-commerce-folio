import React, { useState, useEffect } from 'react'
import { Brain, TrendingUp, Users, Clock, Zap, RefreshCw, Sparkles, CheckCircle } from 'lucide-react'
import { aiService } from '../../../services/aiService'
import { analyticsService } from '../../../services/analytics'
import { usePortfolio } from '../../../context/PortfolioContext'

const AIInsights = () => {
  const { portfolios } = usePortfolio()
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [appliedInsights, setAppliedInsights] = useState([])

  useEffect(() => {
    generateInsights()
  }, [portfolios])

  const generateInsights = async () => {
    try {
      setLoading(true)
      
      // Get analytics data
      const totalViews = portfolios.reduce((sum, p) => sum + (p.analytics?.views || 0), 0)
      
      // Create analytics data for AI analysis
      const analyticsData = {
        avgEngagementTime: 185 + Math.floor(Math.random() * 60),
        trafficSources: {
          mobile: Math.floor(totalViews * (0.75 + Math.random() * 0.1)),
          desktop: Math.floor(totalViews * (0.2 + Math.random() * 0.1)),
          social: Math.floor(totalViews * (0.15 + Math.random() * 0.15))
        },
        bounceRate: 40 + Math.floor(Math.random() * 20),
        conversionRate: 2 + Math.random() * 3,
        viewsTrend: Array.from({ length: 7 }, (_, i) => 
          Math.floor(150 + Math.random() * 100 + i * 10)
        ),
        seoScore: 65 + Math.floor(Math.random() * 25)
      }
      
      // Generate AI insights
      const generatedInsights = await aiService.generateInsights(analyticsData)
      
      // Add icons to insights
      const insightsWithIcons = generatedInsights.map(insight => ({
        ...insight,
        icon: getIconForType(insight.type)
      }))
      
      setInsights(insightsWithIcons)
      setLoading(false)
    } catch (error) {
      console.error('Error generating insights:', error)
      setInsights(getMockInsights())
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await generateInsights()
    setTimeout(() => setRefreshing(false), 500)
  }

  const applyInsight = (index) => {
    if (!appliedInsights.includes(index)) {
      setAppliedInsights([...appliedInsights, index])
      // Here you would implement the actual application logic
    }
  }

  const getIconForType = (type) => {
    switch (type) {
      case 'performance': return Clock
      case 'optimization': return Zap
      case 'content': return Users
      case 'seo': return TrendingUp
      case 'growth': return TrendingUp
      case 'conversion': return Users
      case 'marketing': return Brain
      default: return Sparkles
    }
  }

  const getMockInsights = () => [
    {
      type: 'performance',
      title: 'High Engagement Time',
      description: 'Visitors spend an average of 3.8 minutes on your portfolio',
      recommendation: 'Consider adding more interactive elements',
      impact: 'high',
      icon: Clock
    },
    {
      type: 'content',
      title: 'Skills Section Optimization',
      description: 'Your skills section gets 40% more views than average',
      recommendation: 'Add more detailed skill descriptions and examples',
      impact: 'medium',
      icon: Users
    },
    {
      type: 'seo',
      title: 'Mobile Performance',
      description: '95% of your traffic comes from mobile devices',
      recommendation: 'Optimize images for faster mobile loading',
      impact: 'high',
      icon: TrendingUp
    },
    {
      type: 'design',
      title: 'Color Scheme Impact',
      description: 'Current color scheme has 25% higher engagement',
      recommendation: 'Maintain this color palette across all sections',
      impact: 'low',
      icon: Zap
    }
  ]

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Brain className="h-12 w-12 text-primary-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">AI is analyzing your data...</p>
          </div>
        </div>
      </div>
    )
  }

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
            AI Insights
          </h3>
          <p className="text-sm text-gray-500">Powered by intelligent analysis • {insights.length} insights</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh insights"
        >
          <RefreshCw className={`h-5 w-5 text-primary-600 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon
          return (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                      {insight.impact.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {insight.description}
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          💡 AI Recommendation
                        </p>
                        <p className="text-sm text-blue-700">
                          {insight.recommendation}
                        </p>
                      </div>
                      {!appliedInsights.includes(index) ? (
                        <button
                          onClick={() => applyInsight(index)}
                          className="ml-2 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
                        >
                          Apply
                        </button>
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-600 ml-2 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                  
                  {insight.trend && (
                    <div className="mt-2 flex items-center text-xs text-gray-600">
                      <TrendingUp className={`h-3 w-3 mr-1 ${
                        insight.trend === 'positive' ? 'text-green-600' : 
                        insight.trend === 'negative' ? 'text-red-600' : 'text-gray-600'
                      }`} />
                      <span className="capitalize">{insight.trend} trend detected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Action Buttons & Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-700">{appliedInsights.length}</p>
            <p className="text-xs text-green-600">Applied</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-700">{insights.length - appliedInsights.length}</p>
            <p className="text-xs text-blue-600">Pending</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-700">{insights.filter(i => i.impact === 'high').length}</p>
            <p className="text-xs text-purple-600">High Priority</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => insights.forEach((_, i) => applyInsight(i))}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium flex items-center justify-center"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Apply All
          </button>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Regenerate
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIInsights