import Notification from '../models/Notification.js'

export const setupNotificationSocket = (io, socket) => {
  // Join user's notification room
  socket.on('join-notifications', () => {
    socket.join(`notifications:${socket.userId}`)
    console.log(`User ${socket.userId} joined notification room`)
  })

  // Leave notification room
  socket.on('leave-notifications', () => {
    socket.leave(`notifications:${socket.userId}`)
  })

  // Mark notification as read
  socket.on('mark-notification-read', async (data) => {
    try {
      const { notificationId } = data
      
      const notification = await Notification.findById(notificationId)
      if (notification && notification.userId.toString() === socket.userId) {
        await notification.markAsRead()
        
        socket.emit('notification-read', {
          notificationId,
          success: true
        })
      }
    } catch (error) {
      console.error('Mark notification read error:', error)
      socket.emit('notification-error', {
        error: 'Failed to mark notification as read'
      })
    }
  })

  // Get unread notifications count
  socket.on('get-unread-count', async () => {
    try {
      const count = await Notification.countDocuments({
        userId: socket.userId,
        isRead: false
      })
      
      socket.emit('unread-count', { count })
    } catch (error) {
      console.error('Get unread count error:', error)
    }
  })

  // Handle notification settings update
  socket.on('update-notification-settings', async (data) => {
    try {
      // This would update user's notification preferences
      socket.emit('notification-settings-updated', {
        success: true,
        settings: data.settings
      })
    } catch (error) {
      console.error('Update notification settings error:', error)
      socket.emit('notification-error', {
        error: 'Failed to update notification settings'
      })
    }
  })
}

// Export functions for use in other parts of the application
export const sendNotification = async (io, userId, type, title, message, data = {}) => {
  try {
    const notification = await Notification.createNotification(
      userId,
      type,
      title,
      message,
      data
    )
    
    // Send to user's notification room
    io.to(`notifications:${userId}`).emit('new-notification', {
      notification: {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        createdAt: notification.createdAt,
        isRead: notification.isRead
      }
    })
    
    return notification
  } catch (error) {
    console.error('Send notification error:', error)
    throw error
  }
}

// Broadcast to all users (for admin announcements)
export const broadcastNotification = async (io, type, title, message, data = {}) => {
  try {
    // This would typically be called from an admin service
    io.emit('broadcast-notification', {
      type,
      title,
      message,
      data,
      timestamp: new Date()
    })
  } catch (error) {
    console.error('Broadcast notification error:', error)
    throw error
  }
}