import React, { useState } from 'react'
import { Search, TrendingUp, CheckCircle, AlertTriangle, Zap } from 'lucide-react'
import Button from '../../common/Button/Button'

const SEOSuggestions = () => {
  const [appliedSuggestions, setAppliedSuggestions] = useState([])

  const seoSuggestions = [
    {
      id: 1,
      title: 'Optimize Meta Description',
      description: 'Your meta description is too short. Expand it to 120-160 characters for better search visibility.',
      current: 'Web developer portfolio with projects and skills',
      suggested: 'Professional web developer specializing in React, Node.js, and modern web technologies. View my portfolio of successful projects and case studies.',
      priority: 'high',
      category: 'on-page'
    },
    {
      id: 2,
      title: 'Add Alt Text to Images',
      description: '5 images are missing alt text. Adding descriptive alt text improves accessibility and SEO.',
      missing: 5,
      priority: 'medium',
      category: 'accessibility'
    },
    {
      id: 3,
      title: 'Improve Page Load Speed',
      description: 'Your portfolio loads in 3.2s. Optimize images and enable compression to achieve under 2s.',
      current: '3.2s',
      target: '2.0s',
      priority: 'high',
      category: 'performance'
    },
    {
      id: 4,
      title: 'Add Schema Markup',
      description: 'Implement structured data to help search engines understand your content better.',
      priority: 'medium',
      category: 'technical'
    },
    {
      id: 5,
      title: 'Internal Linking',
      description: 'Add more internal links between your portfolio sections to improve navigation and SEO.',
      priority: 'low',
      category: 'on-page'
    }
  ]

  const keywordOpportunities = [
    { keyword: 'frontend developer', volume: 2400, difficulty: 35, opportunity: 'high' },
    { keyword: 'react developer portfolio', volume: 1200, difficulty: 28, opportunity: 'high' },
    { keyword: 'javascript developer', volume: 1800, difficulty: 42, opportunity: 'medium' },
    { keyword: 'web development services', volume: 3200, difficulty: 65, opportunity: 'low' }
  ]

  const applySuggestion = (suggestionId) => {
    setAppliedSuggestions(prev => [...prev, suggestionId])
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getOpportunityColor = (opportunity) => {
    switch (opportunity) {
      case 'high': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">SEO Suggestions</h3>
          <p className="text-sm text-gray-500">Improve your search engine visibility</p>
        </div>
        <Search className="h-6 w-6 text-primary-600" />
      </div>

      {/* SEO Score */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100">Current SEO Score</p>
            <p className="text-3xl font-bold">72/100</p>
            <p className="text-blue-200 text-sm">Good - Room for improvement</p>
          </div>
          <TrendingUp className="h-12 w-12 text-blue-200" />
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4 mb-8">
        <h4 className="text-sm font-medium text-gray-900">Optimization Suggestions</h4>
        {seoSuggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {suggestion.priority === 'high' ? (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                <div>
                  <h5 className="font-medium text-gray-900">{suggestion.title}</h5>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(suggestion.priority)}`}>
                    {suggestion.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>

              <Button
                variant={appliedSuggestions.includes(suggestion.id) ? "outline" : "primary"}
                size="sm"
                icon={appliedSuggestions.includes(suggestion.id) ? CheckCircle : Zap}
                onClick={() => applySuggestion(suggestion.id)}
                disabled={appliedSuggestions.includes(suggestion.id)}
              >
                {appliedSuggestions.includes(suggestion.id) ? 'Applied' : 'Apply'}
              </Button>
            </div>

            <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>

            {suggestion.current && suggestion.suggested && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <div className="mb-2">
                  <span className="font-medium text-gray-700">Current:</span>
                  <p className="text-gray-600 mt-1">{suggestion.current}</p>
                </div>
                <div>
                  <span className="font-medium text-green-700">Suggested:</span>
                  <p className="text-green-600 mt-1">{suggestion.suggested}</p>
                </div>
              </div>
            )}

            {suggestion.missing && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>{suggestion.missing} items</strong> need attention
                </p>
              </div>
            )}

            {suggestion.current && suggestion.target && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Current: {suggestion.current}</span>
                <span className="text-green-600">Target: {suggestion.target}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Keyword Opportunities */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">Keyword Opportunities</h4>
        <div className="space-y-3">
          {keywordOpportunities.map((keyword, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <span className="font-medium text-gray-900">{keyword.keyword}</span>
                  <span className={`text-xs font-medium ${getOpportunityColor(keyword.opportunity)}`}>
                    {keyword.opportunity.toUpperCase()} OPPORTUNITY
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Volume: {keyword.volume}/month</span>
                  <span>Difficulty: {keyword.difficulty}/100</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Add to Content
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SEOSuggestions