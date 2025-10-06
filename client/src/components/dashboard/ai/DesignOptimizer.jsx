import React, { useState } from 'react'
import { Palette, Eye, Zap, CheckCircle } from 'lucide-react'
import Button from '../../common/Button/Button'

const DesignOptimizer = () => {
  const [currentDesign, setCurrentDesign] = useState('default')
  const [optimizations, setOptimizations] = useState([])

  const designOptions = [
    {
      id: 'default',
      name: 'Current Design',
      score: 72,
      issues: ['Low contrast ratio', 'Small font sizes on mobile', 'Slow image loading']
    },
    {
      id: 'optimized',
      name: 'AI Optimized',
      score: 89,
      improvements: ['Better contrast', 'Responsive typography', 'Optimized images']
    }
  ]

  const optimizationSuggestions = [
    {
      id: 1,
      title: 'Improve Color Contrast',
      description: 'Increase contrast ratio for better readability',
      impact: 'high',
      effort: 'low',
      automated: true
    },
    {
      id: 2,
      title: 'Optimize Images',
      description: 'Compress and resize images for faster loading',
      impact: 'medium',
      effort: 'low',
      automated: true
    },
    {
      id: 3,
      title: 'Mobile Typography',
      description: 'Adjust font sizes for better mobile experience',
      impact: 'high',
      effort: 'medium',
      automated: false
    },
    {
      id: 4,
      title: 'Layout Spacing',
      description: 'Improve spacing and alignment consistency',
      impact: 'medium',
      effort: 'medium',
      automated: true
    }
  ]

  const applyOptimization = (optimizationId) => {
    setOptimizations(prev => [...prev, optimizationId])
  }

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getEffortColor = (effort) => {
    switch (effort) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Design Optimizer</h3>
          <p className="text-sm text-gray-500">AI-powered design improvements</p>
        </div>
        <Palette className="h-6 w-6 text-primary-600" />
      </div>

      {/* Design Comparison */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {designOptions.map((design) => (
          <div
            key={design.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              currentDesign === design.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setCurrentDesign(design.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">{design.name}</h4>
              <div className={`px-2 py-1 rounded-full text-sm font-medium ${
                design.score >= 80 ? 'bg-green-100 text-green-800' :
                design.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                Score: {design.score}
              </div>
            </div>

            {/* Design Preview */}
            <div className="bg-gray-100 rounded-lg h-32 mb-3 flex items-center justify-center">
              <div className="text-center">
                <Eye className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-500">Design Preview</span>
              </div>
            </div>

            {/* Issues/Improvements */}
            <div className="space-y-2">
              {design.issues?.map((issue, index) => (
                <div key={index} className="flex items-center text-sm text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  {issue}
                </div>
              ))}
              {design.improvements?.map((improvement, index) => (
                <div key={index} className="flex items-center text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  {improvement}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Optimization Suggestions */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">Optimization Suggestions</h4>
        <div className="space-y-3">
          {optimizationSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-start space-x-3 flex-1">
                <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h5 className="font-medium text-gray-900">{suggestion.title}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(suggestion.impact)}`}>
                      {suggestion.impact.toUpperCase()} IMPACT
                    </span>
                    <span className={`text-xs font-medium ${getEffortColor(suggestion.effort)}`}>
                      {suggestion.effort.toUpperCase()} EFFORT
                    </span>
                    {suggestion.automated && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        AUTOMATED
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{suggestion.description}</p>
                </div>
              </div>

              <Button
                variant={optimizations.includes(suggestion.id) ? "outline" : "primary"}
                size="sm"
                icon={optimizations.includes(suggestion.id) ? CheckCircle : Zap}
                onClick={() => applyOptimization(suggestion.id)}
                disabled={optimizations.includes(suggestion.id)}
              >
                {optimizations.includes(suggestion.id) ? 'Applied' : 'Apply'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
        <Button variant="primary" className="flex-1" icon={Zap}>
          Apply All Optimizations
        </Button>
        <Button variant="outline" className="flex-1" icon={RefreshCw}>
          Re-analyze Design
        </Button>
      </div>
    </div>
  )
}

export default DesignOptimizer