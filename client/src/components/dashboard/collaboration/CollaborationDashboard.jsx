import React, { useState, useEffect } from 'react'
import { Users, MessageSquare, Video, Share2, Clock, Activity } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import { useRealTimeSync } from '../../../hooks/useRealTimeSync'
import RealTimeChat from './RealTimeChat'
import TeamManagement from './TeamManagement'
import RealTimeEditor from './RealTimeEditor'
import VersionHistory from './VersionHistory'

const CollaborationDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('chat')
  const [selectedPortfolio, setSelectedPortfolio] = useState(null)
  const { isConnected, onlineUsers } = useRealTimeSync(selectedPortfolio)

  const tabs = [
    { id: 'chat', label: 'Team Chat', icon: MessageSquare },
    { id: 'editor', label: 'Live Editor', icon: Activity },
    { id: 'team', label: 'Team Members', icon: Users },
    { id: 'history', label: 'Version History', icon: Clock }
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Collaboration Hub</h1>
            <p className="mt-2 text-gray-600">Work together in real-time with your team</p>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            {/* Online Users */}
            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">
                {onlineUsers.length} Online
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && <RealTimeChat portfolioId={selectedPortfolio} />}
        {activeTab === 'editor' && <RealTimeEditor portfolioId={selectedPortfolio} />}
        {activeTab === 'team' && <TeamManagement />}
        {activeTab === 'history' && <VersionHistory portfolioId={selectedPortfolio} />}
      </div>
    </div>
  )
}

export default CollaborationDashboard
