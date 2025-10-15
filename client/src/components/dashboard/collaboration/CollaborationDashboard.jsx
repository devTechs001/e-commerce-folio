import React, { useState, useEffect } from 'react'
import { Users, MessageSquare, Video, Share2, Clock, Activity, UserPlus, FileText, Edit, CheckCircle, Bell } from 'lucide-react'
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Collaboration Hub</h1>
        <p className="mt-2 text-gray-600">Work together in real-time with your team</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Online Now</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{onlineUsers.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Shared Projects</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">8</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Share2 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Messages</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">156</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Team Workspace</h2>
              <p className="text-sm text-gray-600 mt-1">Collaborate with your team in real-time</p>
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
              <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-lg">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">
                  {onlineUsers.length} Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
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

        {/* Content */}
        <div className="p-6">
          {activeTab === 'chat' && <RealTimeChat portfolioId={selectedPortfolio} />}
          {activeTab === 'editor' && <RealTimeEditor portfolioId={selectedPortfolio} />}
          {activeTab === 'team' && <TeamManagement />}
          {activeTab === 'history' && <VersionHistory portfolioId={selectedPortfolio} />}
        </div>
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-primary-50 rounded-lg transition-colors group">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-primary-100">
                <UserPlus className="h-5 w-5 text-blue-600 group-hover:text-primary-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Invite Team Member</p>
                <p className="text-sm text-gray-600">Add collaborators to your workspace</p>
              </div>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-primary-50 rounded-lg transition-colors group">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-primary-100">
                <Share2 className="h-5 w-5 text-green-600 group-hover:text-primary-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Share Project</p>
                <p className="text-sm text-gray-600">Give team access to projects</p>
              </div>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-primary-50 rounded-lg transition-colors group">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-primary-100">
                <Video className="h-5 w-5 text-purple-600 group-hover:text-primary-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">Start Video Call</p>
                <p className="text-sm text-gray-600">Meet with your team live</p>
              </div>
            </button>
          </div>
        </div>

        {/* Team Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-primary-600" />
              Recent Activity
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { user: 'John Doe', action: 'edited', target: 'Homepage Design', time: '5 min ago', icon: Edit, color: 'blue' },
              { user: 'Jane Smith', action: 'commented on', target: 'Project Brief', time: '12 min ago', icon: MessageSquare, color: 'green' },
              { user: 'Bob Wilson', action: 'completed', target: 'Logo Design Task', time: '1 hour ago', icon: CheckCircle, color: 'purple' },
              { user: 'Alice Brown', action: 'shared', target: 'Marketing Assets', time: '2 hours ago', icon: Share2, color: 'orange' }
            ].map((activity, index) => {
              const Icon = activity.icon
              return (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 bg-${activity.color}-100 rounded-lg flex-shrink-0`}>
                    <Icon className={`h-4 w-4 text-${activity.color}-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollaborationDashboard
