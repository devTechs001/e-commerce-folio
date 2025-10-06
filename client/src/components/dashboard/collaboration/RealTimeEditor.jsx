import React, { useState, useEffect } from 'react'
import { Users, Eye, Edit3, Save, Download } from 'lucide-react'
import Button from '../../common/Button/Button'

const RealTimeEditor = () => {
  const [content, setContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])

  // Simulate online users
  useEffect(() => {
    const users = [
      { id: 1, name: 'You', color: 'bg-primary-500', isYou: true },
      { id: 2, name: 'Sarah', color: 'bg-green-500', isYou: false },
      { id: 3, name: 'Mike', color: 'bg-blue-500', isYou: false }
    ]
    setOnlineUsers(users)
  }, [])

  const handleSave = () => {
    setIsEditing(false)
    // Save content logic
    console.log('Content saved:', content)
  }

  const handleDownload = () => {
    // Download logic
    const element = document.createElement('a')
    const file = new Blob([content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'portfolio-content.txt'
    document.body.appendChild(element)
    element.click()
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Real-time Editor</h3>
          <p className="text-sm text-gray-500">Collaborate with your team in real-time</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Online Users */}
          <div className="flex items-center space-x-2">
            {onlineUsers.map(user => (
              <div
                key={user.id}
                className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-white text-xs font-medium relative`}
                title={user.name}
              >
                {user.name.charAt(0)}
                {user.isYou && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                )}
              </div>
            ))}
          </div>

          <Button
            variant={isEditing ? "primary" : "outline"}
            icon={isEditing ? Save : Edit3}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="border border-gray-200 rounded-lg">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded">
              <strong>B</strong>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded">
              <em>I</em>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded">
              <u>U</u>
            </button>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded">
              H1
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded">
              H2
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={handleDownload}
          >
            Export
          </Button>
        </div>

        {/* Content Area */}
        <div className="p-4">
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing your content here... You can collaborate with your team in real-time."
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
          ) : (
            <div className="h-64 p-4 border border-gray-300 rounded-lg bg-gray-50">
              {content ? (
                <div className="prose max-w-none">
                  {content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Edit3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p>No content yet. Click Edit to start writing.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between p-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>{content.length} characters</span>
            <span>{content.split(' ').filter(word => word.length > 0).length} words</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>All changes saved</span>
          </div>
        </div>
      </div>

      {/* Collaboration Features */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Users className="h-6 w-6 text-blue-600 mb-2" />
          <h4 className="font-medium text-blue-900 mb-1">Live Collaboration</h4>
          <p className="text-sm text-blue-700">See teammates' cursors and edits in real-time</p>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <Eye className="h-6 w-6 text-green-600 mb-2" />
          <h4 className="font-medium text-green-900 mb-1">Version History</h4>
          <p className="text-sm text-green-700">Track changes and revert to previous versions</p>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <Edit3 className="h-6 w-6 text-purple-600 mb-2" />
          <h4 className="font-medium text-purple-900 mb-1">Comments & Feedback</h4>
          <p className="text-sm text-purple-700">Leave comments and suggestions for teammates</p>
        </div>
      </div>
    </div>
  )
}

export default RealTimeEditor