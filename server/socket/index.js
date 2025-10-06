import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const setupSocket = (io) => {
  // Authentication middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) {
        return next(new Error('Authentication error'))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.userId).select('profile email')
      
      if (!user) {
        return next(new Error('Authentication error'))
      }

      socket.userId = user._id.toString()
      socket.user = user
      next()
    } catch (error) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.profile.firstName} connected`)

    // Join portfolio room for real-time collaboration
    socket.on('join-portfolio', (portfolioId) => {
      socket.join(`portfolio:${portfolioId}`)
      console.log(`User ${socket.userId} joined portfolio ${portfolioId}`)
    })

    // Leave portfolio room
    socket.on('leave-portfolio', (portfolioId) => {
      socket.leave(`portfolio:${portfolioId}`)
    })

    // Handle portfolio updates
    socket.on('portfolio-update', (data) => {
      socket.to(`portfolio:${data.portfolioId}`).emit('portfolio-updated', {
        ...data,
        updatedBy: socket.userId,
        timestamp: new Date()
      })
    })

    // Handle real-time editing
    socket.on('editing-start', (data) => {
      socket.to(`portfolio:${data.portfolioId}`).emit('user-editing', {
        userId: socket.userId,
        user: socket.user.profile.firstName,
        section: data.section,
        isEditing: true
      })
    })

    socket.on('editing-stop', (data) => {
      socket.to(`portfolio:${data.portfolioId}`).emit('user-editing', {
        userId: socket.userId,
        user: socket.user.profile.firstName,
        section: data.section,
        isEditing: false
      })
    })

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`)
    })
  })
}