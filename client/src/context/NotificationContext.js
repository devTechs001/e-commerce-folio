import React, { createContext, useState, useContext, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useSocket } from '../hooks/useSocket'

const NotificationContext = createContext()

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { socket, isConnected } = useSocket()

  useEffect(() => {
    if (socket && isConnected) {
      // Join notification room
      socket.emit('join-notifications')

      // Listen for new notifications
      socket.on('new-notification', (data) => {
        setNotifications(prev => [data.notification, ...prev])
        setUnreadCount(prev => prev + 1)
        
        // Show toast notification
        toast.success(data.notification.title, {
          duration: 5000,
          position: 'top-right',
        })
      })

      // Get initial unread count
      socket.emit('get-unread-count')

      socket.on('unread-count', (data) => {
        setUnreadCount(data.count)
      })

      return () => {
        socket.off('new-notification')
        socket.off('unread-count')
      }
    }
  }, [socket, isConnected])

  const markAsRead = async (notificationId) => {
    try {
      if (socket) {
        socket.emit('mark-notification-read', { notificationId })
      }
      
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      // Mark all notifications as read in the backend
      const unreadIds = notifications
        .filter(n => !n.isRead)
        .map(n => n.id)
      
      unreadIds.forEach(markAsRead)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev])
    setUnreadCount(prev => prev + 1)
  }

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    isConnected
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}