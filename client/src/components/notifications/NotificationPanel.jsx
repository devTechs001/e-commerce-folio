import React, { useState, useEffect } from 'react'
import { X, Bell, Check, Trash2, Settings, Mail, MessageSquare, DollarSign, UserPlus, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSocket } from '../../hooks/useSocket'
import Button from '../common/Button/Button'

const NotificationPanel = ({ isOpen, onClose }) => {
  const socket = useSocket()
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all') // all, unread, read
  const [loading, setLoading] = useState(false)

  // Load notifications
  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen])

  // Real-time notification listener
  useEffect(() => {
    if (!socket.isConnected) return

    const handleNewNotification = (notification) => {
      setNotifications(prev => [notification, ...prev])
      // Play notification sound
      playNotificationSound()
    }

    socket.on('notification', handleNewNotification)

    return () => {
      socket.off('notification', handleNewNotification)
    }
  }, [socket.isConnected])

  const loadNotifications = async () => {
    setLoading(true)
    try {
      // TODO: Replace with actual API call
      const mockNotifications = [
        {
          id: '1',
          type: 'payment',
          title: 'Payment Received',
          message: 'Your payment of $19.00 was successful',
          timestamp: new Date(Date.now() - 300000),
          read: false,
          icon: DollarSign,
          color: 'green'
        },
        {
          id: '2',
          type: 'message',
          title: 'New Message',
          message: 'John Doe sent you a message about your portfolio',
          timestamp: new Date(Date.now() - 3600000),
          read: false,
          icon: MessageSquare,
          color: 'blue'
        },
        {
          id: '3',
          type: 'alert',
          title: 'Portfolio Published',
          message: 'Your portfolio "Creative Showcase" is now live',
          timestamp: new Date(Date.now() - 7200000),
          read: true,
          icon: CheckCircle,
          color: 'green'
        },
        {
          id: '4',
          type: 'user',
          title: 'New Follower',
          message: 'Sarah Smith started following you',
          timestamp: new Date(Date.now() - 86400000),
          read: true,
          icon: UserPlus,
          color: 'purple'
        },
        {
          id: '5',
          type: 'info',
          title: 'System Update',
          message: 'New features are now available in your dashboard',
          timestamp: new Date(Date.now() - 172800000),
          read: true,
          icon: Info,
          color: 'blue'
        }
      ]
      setNotifications(mockNotifications)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const playNotificationSound = () => {
    // Optional: play notification sound
    const audio = new Audio('/notification.mp3')
    audio.volume = 0.5
    audio.play().catch(() => {}) // Ignore errors if sound doesn't exist
  }

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
    // TODO: Update on backend
  }

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
    // TODO: Delete on backend
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
    // TODO: Update on backend
  }

  const clearAll = () => {
    setNotifications([])
    // TODO: Clear on backend
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read
    if (filter === 'read') return notif.read
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const getRelativeTime = (timestamp) => {
    const now = new Date()
    const diff = now - new Date(timestamp)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(timestamp).toLocaleDateString()
  }

  const getNotificationColor = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600'
    }
    return colors[color] || colors.blue
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-gray-200">
              {[
                { id: 'all', label: 'All' },
                { id: 'unread', label: 'Unread' },
                { id: 'read', label: 'Read' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    filter === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'unread' && unreadCount > 0 && (
                    <span className="ml-1 text-xs">({unreadCount})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Actions */}
            {notifications.length > 0 && (
              <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
                >
                  <Check className="h-3 w-3" />
                  <span>Mark all read</span>
                </button>
                <button
                  onClick={clearAll}
                  className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center space-x-1"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Clear all</span>
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent" />
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <Bell className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                  <p className="text-sm text-gray-500">
                    {filter === 'unread' 
                      ? "You're all caught up!"
                      : "You don't have any notifications yet"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => {
                    const Icon = notification.icon
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          !notification.read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {/* Icon */}
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.color)}`}>
                            <Icon className="h-5 w-5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className={`text-sm font-medium ${
                                !notification.read ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <span className="ml-2 w-2 h-2 bg-primary-600 rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                              <span>{getRelativeTime(notification.timestamp)}</span>
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-primary-600 hover:text-primary-700 font-medium"
                                >
                                  Mark as read
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="text-red-600 hover:text-red-700 font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4">
              <Button
                variant="outline"
                size="sm"
                icon={Settings}
                className="w-full"
                onClick={() => {
                  onClose()
                  // Navigate to notification settings
                }}
              >
                Notification Settings
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NotificationPanel
