import React from 'react'
import { Brain, TrendingUp, Users, Clock, Zap } from 'lucide-react'

const AIInsights = () => {
  const insights = [
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
          <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
          <p className="text-sm text-gray-500">Smart recommendations for your portfolio</p>
        </div>
        <Brain className="h-6 w-6 text-primary-600" />
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
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      AI Recommendation
                    </p>
                    <p className="text-sm text-blue-700">
                      {insight.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
        <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
          Apply All Recommendations
        </button>
        <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
          Generate More Insights
        </button>
      </div>
    </div>
  )
}

export default AIInsights