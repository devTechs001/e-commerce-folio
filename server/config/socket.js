import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const createSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  })

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.userId).select('profile email subscription')
      
      if (!user) {
        return next(new Error('Authentication error: User not found'))
      }

      socket.userId = user._id.toString()
      socket.user = user
      next()
    } catch (error) {
      console.error('Socket authentication error:', error)
      next(new Error('Authentication error: Invalid token'))
    }
  })

  return io
}

// Socket event handlers
export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`User ${socket.user.profile.firstName} connected (${socket.id})`)

    // Join user to their personal room
    socket.join(`user:${socket.userId}`)

    // Setup collaboration handlers
    setupCollaborationHandlers(io, socket)
    
    // Setup notification handlers
    setupNotificationHandlers(io, socket)

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`User ${socket.userId} disconnected: ${reason}`)
      
      // Notify collaboration rooms about user leaving
      socket.rooms.forEach(room => {
        if (room.startsWith('collaboration:')) {
          socket.to(room).emit('user-left', {
            userId: socket.userId,
            user: socket.user.profile.firstName,
            timestamp: new Date()
          })
        }
      })
    })

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  })
}

const setupCollaborationHandlers = (io, socket) => {
  // Import collaboration handlers
  const { setupCollaborationSocket } = require('../socket/collaboration.js')
  setupCollaborationSocket(io, socket)
}

const setupNotificationHandlers = (io, socket) => {
  // Import notification handlers
  const { setupNotificationSocket } = require('../socket/notifications.js')
  setupNotificationSocket(io, socket)
}

// Utility functions for emitting to specific users
export const emitToUser = (io, userId, event, data) => {
  io.to(`user:${userId}`).emit(event, data)
}

export const emitToRoom = (io, room, event, data) => {
  io.to(room).emit(event, data)
}

export const broadcastToAll = (io, event, data) => {
  io.emit(event, data)
}