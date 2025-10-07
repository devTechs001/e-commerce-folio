/**
 * Socket Service
 * Handles real-time communication and user management
 * 
 * @author devtechs001
 * @copyright © 2025 devtechs001. All rights reserved.
 */

class SocketService {
  constructor() {
    this.io = null
    this.connectedUsers = new Map()
  }

  initialize(io) {
    this.io = io
    console.log('Socket service initialized')
  }

  // Broadcast to all connected clients
  broadcast(event, data) {
    if (this.io) {
      this.io.emit(event, data)
    }
  }

  // Send to specific user
  to(userId) {
    return {
      emit: (event, data) => {
        if (this.io) {
          this.io.to(userId).emit(event, data)
        }
      }
    }
  }

  // Send to specific room
  toRoom(room) {
    return {
      emit: (event, data) => {
        if (this.io) {
          this.io.to(room).emit(event, data)
        }
      }
    }
  }

  // Join user to room
  joinRoom(socketId, room) {
    if (this.io) {
      const socket = this.io.sockets.sockets.get(socketId)
      if (socket) {
        socket.join(room)
      }
    }
  }

  // Leave room
  leaveRoom(socketId, room) {
    if (this.io) {
      const socket = this.io.sockets.sockets.get(socketId)
      if (socket) {
        socket.leave(room)
      }
    }
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.connectedUsers.size
  }

  // Add connected user
  addUser(socketId, userId) {
    this.connectedUsers.set(socketId, userId)
    this.broadcast('user_online', userId)
  }

  // Remove connected user
  removeUser(socketId) {
    const userId = this.connectedUsers.get(socketId)
    if (userId) {
      this.connectedUsers.delete(socketId)
      this.broadcast('user_offline', userId)
    }
  }

  // Get online users
  getOnlineUsers() {
    return Array.from(this.connectedUsers.values())
  }

  // Check if user is online
  isUserOnline(userId) {
    return Array.from(this.connectedUsers.values()).includes(userId)
  }
}

// Create singleton instance
export const socketService = new SocketService()
export default socketService
