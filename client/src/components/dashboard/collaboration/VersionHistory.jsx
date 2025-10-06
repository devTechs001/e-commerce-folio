import React, { useState } from 'react'
import { Clock, User, RotateCcw, Eye, Download, MoreVertical } from 'lucide-react'
import Button from '../../common/Button/Button'

const VersionHistory = () => {
  const [selectedVersion, setSelectedVersion] = useState(null)

  const versions = [
    {
      id: 1,
      version: 'v3.2',
      timestamp: '2024-03-15T14:30:00Z',
      author: 'Sarah Johnson',
      changes: ['Updated project descriptions', 'Added new skills section', 'Optimized images'],
      size: '2.4 MB',
      isCurrent: true
    },
    {
      id: 2,
      version: 'v3.1',
      timestamp: '2024-03-10T09:15:00Z',
      author: 'Mike Chen',
      changes: ['Fixed mobile layout issues', 'Updated contact information'],
      size: '2.3 MB',
      isCurrent: false
    },
    {
      id: 3,
      version: 'v3.0',
      timestamp: '2024-03-01T11:00:00Z',
      author: 'You',
      changes: ['Complete portfolio redesign', 'Added dark mode', 'Integrated AI features'],
      size: '2.5 MB',
      isCurrent: false
    },
    {
      id: 4,
      version: 'v2.5',
      timestamp: '2024-02-20T16:45:00Z',
      author: 'Emily Davis',
      changes: ['Minor content updates', 'SEO optimization'],
      size: '2.1 MB',
      isCurrent: false
    }
  ]

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const past = new Date(timestamp)
    const diff = now - past
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  }

  const restoreVersion = (versionId) => {
    // Restore logic
    console.log('Restoring version:', versionId)
  }

  const downloadVersion = (versionId) => {
    // Download logic
    console.log('Downloading version:', versionId)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Version History</h3>
          <p className="text-sm text-gray-500">Track and manage portfolio versions</p>
        </div>
        <Clock className="h-6 w-6 text-primary-600" />
      </div>

      {/* Versions List */}
      <div className="space-y-4">
        {versions.map((version) => (
          <div
            key={version.id}
            className={`border rounded-lg p-4 transition-all ${
              selectedVersion === version.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                {/* Version Badge */}
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  version.isCurrent
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {version.version} {version.isCurrent && '(Current)'}
                </div>

                {/* Version Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{version.author}</span>
                    <span className="text-sm text-gray-500">{getTimeAgo(version.timestamp)}</span>
                  </div>

                  {/* Changes List */}
                  <ul className="text-sm text-gray-600 space-y-1">
                    {version.changes.map((change, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                        {change}
                      </li>
                    ))}
                  </ul>

                  {/* Metadata */}
                  <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                    <span>Size: {version.size}</span>
                    <span>Saved: {formatDate(version.timestamp)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {!version.isCurrent && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={RotateCcw}
                      onClick={() => restoreVersion(version.id)}
                    >
                      Restore
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      onClick={() => setSelectedVersion(version.id)}
                    >
                      Preview
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Download}
                  onClick={() => downloadVersion(version.id)}
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Version Statistics */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{versions.length}</p>
          <p className="text-sm text-gray-500">Total Versions</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">
            {versions.filter(v => !v.isCurrent).length}
          </p>
          <p className="text-sm text-gray-500">Previous Versions</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">15.3 MB</p>
          <p className="text-sm text-gray-500">Total Storage</p>
        </div>
      </div>

      {/* Auto-save Settings */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-blue-900">Auto-save Enabled</h4>
            <p className="text-sm text-blue-700">
              Changes are automatically saved every 5 minutes
            </p>
          </div>
          <Button variant="outline" size="sm">
            Configure
          </Button>
        </div>
      </div>
    </div>
  )
}

export default VersionHistory