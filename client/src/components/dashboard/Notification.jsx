import React, { useState, useEffect } from 'react'
import { Bell, Check, X, Filter, Archive, Trash2, Mail, MessageSquare, AlertCircle, Info } from 'lucide-react'
import { socketService } from '../../services/socket'

const Notification = () => {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
    setupRealTimeNotifications()

    return () => {
      if (socketService.socket) {
        socketService.socket.off('notification:new')
      }
    }
  }, [])

  const loadNotifications = () => {
    // Mock notifications - would come from API
    const mockNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'Portfolio Published',
        message: 'Your portfolio "Creative Showcase" has been successfully published',
        timestamp: new Date(Date.now() - 600000),
        read: false,
        icon: Check
      },
      {
        id: 2,
        type: 'info',
        title: 'New Visitor',
        message: 'Someone viewed your portfolio from United States',
        timestamp: new Date(Date.now() - 1800000),
        read: false,
        icon: Info
      },
      {
        id: 3,
        type: 'message',
        title: 'New Message',
        message: 'John Doe sent you a message about freelance opportunity',
        timestamp: new Date(Date.now() - 3600000),
        read: true,
        icon: MessageSquare
      },
      {
        id: 4,
        type: 'alert',
        title: 'Subscription Reminder',
        message: 'Your subscription will renew in 3 days',
        timestamp: new Date(Date.now() - 86400000),
        read: true,
        icon: AlertCircle
      },
      {
        id: 5,
        type: 'mail',
        title: 'Email Campaign Sent',
        message: 'Your email campaign was sent to 150 subscribers',
        timestamp: new Date(Date.now() - 172800000),
        read: true,
        icon: Mail
      }
    ]
    setNotifications(mockNotifications)
    setLoading(false)
  }

  const setupRealTimeNotifications = () => {
    if (socketService.socket) {
      socketService.socket.on('notification:new', (notification) => {
        setNotifications(prev => [notification, ...prev])
      })
    }
  }

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const getFilteredNotifications = () => {
    if (filter === 'unread') {
      return notifications.filter(n => !n.read)
    }
    if (filter === 'read') {
      return notifications.filter(n => n.read)
    }
    return notifications
  }

  const formatTimestamp = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-600'
      case 'info': return 'bg-blue-100 text-blue-600'
      case 'message': return 'bg-purple-100 text-purple-600'
      case 'alert': return 'bg-orange-100 text-orange-600'
      case 'mail': return 'bg-indigo-100 text-indigo-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const filteredNotifications = getFilteredNotifications()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Bell className="h-8 w-8 mr-3 text-primary-600" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-3 px-3 py-1 bg-primary-600 text-white text-sm rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="mt-2 text-gray-600">Stay updated with your latest activities</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100">
        <div className="flex space-x-2">
          {['all', 'unread', 'read'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filter === tab
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
              {tab === 'unread' && unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-white text-primary-600 text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = notification.icon
            return (
              <div
                key={notification.id}
                className={`bg-white rounded-xl p-6 shadow-sm border transition-all ${
                  notification.read
                    ? 'border-gray-100 hover:border-gray-200'
                    : 'border-primary-200 bg-primary-50/30 hover:border-primary-300'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${getNotificationColor(notification.type)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {notification.title}
                          {!notification.read && (
                            <span className="ml-2 inline-block w-2 h-2 bg-primary-600 rounded-full"></span>
                          )}
                        </h3>
                        <p className="text-gray-600 text-sm">{notification.message}</p>
                      </div>
                      <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Notification