import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Search, Link2, FileText, TrendingUp } from 'lucide-react'
import Button from '../../common/Button/Button'
import { analyticsService } from '../../../services/analytics'

const SEOAnalyzer = () => {
  const [seoData, setSeoData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fixing, setFixing] = useState(null)

  useEffect(() => {
    loadSEOData()
  }, [])

  const loadSEOData = async () => {
    try {
      setLoading(true)
      const response = await analyticsService.getSEOReport()
      if (response.success) {
        setSeoData(response.data)
      }
    } catch (error) {
      console.error('Error loading SEO data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFixIssue = async (issueId) => {
    setFixing(issueId)
    try {
      const response = await analyticsService.fixSEIssue(issueId)
      if (response.success) {
        // Update local state
        setSeoData(prev => ({
          ...prev,
          issues: prev.issues.map(issue =>
            issue.id === issueId ? { ...issue, fixed: true } : issue
          )
        }))
      }
    } catch (error) {
      console.error('Error fixing SEO issue:', error)
    } finally {
      setFixing(null)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-green-100'
    if (score >= 70) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getIssueIcon = (type) => {
    switch (type) {
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />
      default: return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto"></div>
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">SEO Analyzer</h3>
          <p className="text-sm text-gray-500">Optimize your portfolio for search engines</p>
        </div>
        <Search className="h-6 w-6 text-primary-600" />
      </div>

      {/* SEO Score */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-24 h-24 ${getScoreBg(seoData?.score)} rounded-full border-8 border-gray-100 mb-4`}>
          <span className={`text-2xl font-bold ${getScoreColor(seoData?.score)}`}>
            {seoData?.score || 0}
          </span>
        </div>
        <p className="text-gray-600">Overall SEO Score</p>
        <p className={`text-sm font-medium ${getScoreColor(seoData?.score)} mt-1`}>
          {seoData?.score >= 90 ? 'Excellent' : seoData?.score >= 70 ? 'Good' : 'Needs Improvement'}
        </p>
      </div>

      {/* Issues & Recommendations */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Issues & Recommendations</h4>
        <div className="space-y-3">
          {seoData?.issues?.map((issue) => (
            <div key={issue.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
              {getIssueIcon(issue.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium text-gray-900">{issue.title}</h5>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    issue.priority === 'high' ? 'bg-red-100 text-red-800' :
                    issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {issue.priority} priority
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                {issue.fix && !issue.fixed && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-blue-900 mb-1">How to fix:</p>
                    <p className="text-sm text-blue-700">{issue.fix}</p>
                  </div>
                )}
                {issue.fixed && (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Issue has been fixed
                  </div>
                )}
              </div>
              {!issue.fixed && issue.fix && (
                <Button
                  variant="primary"
                  size="sm"
                  loading={fixing === issue.id}
                  onClick={() => handleFixIssue(issue.id)}
                >
                  Fix
                </Button>
              )}
            </div>
          )) || (
            <div className="text-center py-4 text-gray-500">
              No SEO issues found
            </div>
          )}
        </div>
      </div>

      {/* Keywords */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Top Keywords</h4>
        <div className="space-y-2">
          {seoData?.keywords?.map((keyword, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">{keyword.term}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Pos: {keyword.position}</span>
                <span className="text-sm text-gray-500">Vol: {keyword.volume}</span>
                <span className={`text-sm font-medium ${
                  keyword.trend === 'up' ? 'text-green-600' : 
                  keyword.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {keyword.trend === 'up' ? '↑' : keyword.trend === 'down' ? '↓' : '→'}
                </span>
              </div>
            </div>
          )) || (
            <div className="text-center py-2 text-gray-500">
              No keyword data available
            </div>
          )}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Link2 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <p className="text-lg font-bold text-blue-900">{seoData?.backlinks || 0}</p>
          <p className="text-sm text-blue-600">Backlinks</p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
          <p className="text-lg font-bold text-purple-900">{seoData?.domainAuthority || 0}/100</p>
          <p className="text-sm text-purple-600">Domain Authority</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
        <Button variant="outline" className="flex-1" onClick={loadSEOData}>
          Re-analyze
        </Button>
        <Button variant="primary" className="flex-1">
          Generate Report
        </Button>
      </div>
    </div>
  )
}

export default SEOAnalyzer