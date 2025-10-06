export const setupCollaborationSocket = (io, socket) => {
    // Join collaboration room
    socket.on('join-collaboration', (portfolioId) => {
      socket.join(`collaboration:${portfolioId}`)
      console.log(`User ${socket.userId} joined collaboration room for portfolio ${portfolioId}`)
    })
  
    // Leave collaboration room
    socket.on('leave-collaboration', (portfolioId) => {
      socket.leave(`collaboration:${portfolioId}`)
    })
  
    // Handle real-time editing
    socket.on('start-editing', (data) => {
      const { portfolioId, sectionId } = data
      
      socket.to(`collaboration:${portfolioId}`).emit('user-editing', {
        userId: socket.userId,
        user: socket.user.profile.firstName,
        sectionId,
        isEditing: true,
        timestamp: new Date()
      })
    })
  
    socket.on('stop-editing', (data) => {
      const { portfolioId, sectionId } = data
      
      socket.to(`collaboration:${portfolioId}`).emit('user-editing', {
        userId: socket.userId,
        user: socket.user.profile.firstName,
        sectionId,
        isEditing: false,
        timestamp: new Date()
      })
    })
  
    // Handle cursor position
    socket.on('cursor-move', (data) => {
      const { portfolioId, position, sectionId } = data
      
      socket.to(`collaboration:${portfolioId}`).emit('cursor-update', {
        userId: socket.userId,
        user: socket.user.profile.firstName,
        position,
        sectionId,
        timestamp: new Date()
      })
    })
  
    // Handle live changes
    socket.on('live-change', (data) => {
      const { portfolioId, sectionId, changes } = data
      
      socket.to(`collaboration:${portfolioId}`).emit('live-update', {
        userId: socket.userId,
        sectionId,
        changes,
        timestamp: new Date()
      })
    })
  
    // Handle collaboration chat
    socket.on('collaboration-message', (data) => {
      const { portfolioId, message } = data
      
      io.to(`collaboration:${portfolioId}`).emit('new-message', {
        userId: socket.userId,
        user: socket.user.profile.firstName,
        message,
        timestamp: new Date()
      })
    })
  
    // Handle user presence
    socket.on('user-presence', (data) => {
      const { portfolioId, isOnline } = data
      
      socket.to(`collaboration:${portfolioId}`).emit('presence-update', {
        userId: socket.userId,
        user: socket.user.profile.firstName,
        isOnline,
        timestamp: new Date()
      })
    })
  }