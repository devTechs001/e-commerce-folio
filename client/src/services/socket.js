import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
    this.eventCallbacks = new Map()
  }

  connect(token) {
    if (this.socket) {
      this.disconnect()
    }

    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      forceNew: true,
      reconnection: true,
      timeout: 20000,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      maxReconnectionAttempts: 5
    })

    this.setupEventListeners()
  }

  setupEventListeners() {
    this.socket.on('connect', () => {
      this.isConnected = true
      console.log('Socket connected:', this.socket.id)
      this.triggerEvent('connect', this.socket.id)
    })

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false
      console.log('Socket disconnected:', reason)
      this.triggerEvent('disconnect', reason)
    })

    this.socket.on('error', (error) => {
      console.error('Socket error:', error)
      this.triggerEvent('error', error)
    })

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts')
      this.triggerEvent('reconnect', attemptNumber)
    })

    // Collaboration events
    this.socket.on('user_joined', (data) => {
      this.triggerEvent('user_joined', data)
    })

    this.socket.on('user_left', (data) => {
      this.triggerEvent('user_left', data)
    })

    this.socket.on('content_updated', (data) => {
      this.triggerEvent('content_updated', data)
    })

    this.socket.on('cursor_moved', (data) => {
      this.triggerEvent('cursor_moved', data)
    })

    this.socket.on('comment_added', (data) => {
      this.triggerEvent('comment_added', data)
    })

    this.socket.on('comment_resolved', (data) => {
      this.triggerEvent('comment_resolved', data)
    })
    // Real-time analytics
    this.socket.on('visitor_update', (data) => {
      this.triggerEvent('visitor_update', data)
    })

    // Notification events
    this.socket.on('notification', (data) => {
      this.triggerEvent('notification', data)
    })

    // Freelancing events
    this.socket.on('job_posted', (data) => {
      this.triggerEvent('job_posted', data)
    })

    this.socket.on('job_updated', (data) => {
      this.triggerEvent('job_updated', data)
    })

    this.socket.on('job_deleted', (data) => {
      this.triggerEvent('job_deleted', data)
    })

    this.socket.on('new_proposal', (data) => {
      this.triggerEvent('new_proposal', data)
    })

    // Messaging events
    this.socket.on('private_message', (data) => {
      this.triggerEvent('private_message', data)
    })

    this.socket.on('user_typing', (data) => {
      this.triggerEvent('user_typing', data)
    })

    this.socket.on('user_online', (data) => {
      this.triggerEvent('user_online', data)
    })

    this.socket.on('user_offline', (data) => {
      this.triggerEvent('user_offline', data)
    })

    // Analytics events
    this.socket.on('analytics_updated', (data) => {
      this.triggerEvent('analytics_updated', data)
    })

    this.socket.on('visitor_tracked', (data) => {
      this.triggerEvent('visitor_tracked', data)
    })
  }

  // Event management
  on(event, callback) {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, new Set())
    }
    this.eventCallbacks.get(event).add(callback)
  }

  off(event, callback) {
    if (this.eventCallbacks.has(event)) {
      this.eventCallbacks.get(event).delete(callback)
    }
  }

  triggerEvent(event, data) {
    if (this.eventCallbacks.has(event)) {
      this.eventCallbacks.get(event).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in event callback for ${event}:`, error)
        }
      })
    }
  }

  // Collaboration methods
  joinPortfolioRoom(portfolioId) {
    this.emit('join_portfolio', { portfolioId })
  }

  leavePortfolioRoom(portfolioId) {
    this.emit('leave_portfolio', { portfolioId })
  }

  updateContent(portfolioId, sectionId, content) {
    this.emit('content_update', {
      portfolioId,
      sectionId,
      content,
      timestamp: Date.now()
    })
  }

  updateCursor(portfolioId, position) {
    this.emit('cursor_update', {
      portfolioId,
      position,
      timestamp: Date.now()
    })
  }

  // Real-time methods
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data)
    } else {
      console.warn('Socket not connected, cannot emit event:', event)
    }
  }

  // Presence methods
  getOnlineUsers(portfolioId) {
    return new Promise((resolve) => {
      if (this.socket && this.isConnected) {
        this.socket.emit('get_online_users', { portfolioId }, (users) => {
          resolve(users)
        })
      } else {
        resolve([])
      }
    })
  }

  // Typing indicators
  startTyping(portfolioId, sectionId) {
    this.emit('typing_start', { portfolioId, sectionId })
  }

  stopTyping(portfolioId, sectionId) {
    this.emit('typing_stop', { portfolioId, sectionId })
  }

  // Connection management
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  reconnect() {
    if (this.socket) {
      this.socket.connect()
    }
  }

  getConnectionStatus() {
    return this.isConnected
  }

  getSocketId() {
    return this.socket?.id || null
  }
}

// Create a singleton instance
export const socketService = new SocketService()

// React hook for using socket service
export const useSocket = () => {
  return socketService
}