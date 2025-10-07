import { useEffect, useCallback, useState } from 'react'
import { socketService } from '../services/socket'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export const useRealTimeSync = (portfolioId) => {
  const { user } = useAuth()
  const [onlineUsers, setOnlineUsers] = useState([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!user || !portfolioId) return

    // Connect socket with auth token
    const token = localStorage.getItem('token')
    if (token && !socketService.isConnected) {
      socketService.connect(token)
    }

    // Join portfolio room
    socketService.joinPortfolioRoom(portfolioId)

    // Setup event listeners
    const handleConnect = () => {
      setIsConnected(true)
      toast.success('Connected to real-time sync')
    }

    const handleDisconnect = () => {
      setIsConnected(false)
      toast.error('Disconnected from real-time sync')
    }

    const handleUserJoined = (data) => {
      setOnlineUsers(prev => [...prev, data.user])
      toast(`${data.user.name} joined`, { icon: '👋' })
    }

    const handleUserLeft = (data) => {
      setOnlineUsers(prev => prev.filter(u => u.id !== data.userId))
      toast(`${data.user.name} left`, { icon: '👋' })
    }

    socketService.on('connect', handleConnect)
    socketService.on('disconnect', handleDisconnect)
    socketService.on('user_joined', handleUserJoined)
    socketService.on('user_left', handleUserLeft)

    // Get initial online users
    socketService.getOnlineUsers(portfolioId).then(setOnlineUsers)

    return () => {
      socketService.off('connect', handleConnect)
      socketService.off('disconnect', handleDisconnect)
      socketService.off('user_joined', handleUserJoined)
      socketService.off('user_left', handleUserLeft)
      socketService.leavePortfolioRoom(portfolioId)
    }
  }, [user, portfolioId])

  const updateContent = useCallback((sectionId, content) => {
    socketService.updateContent(portfolioId, sectionId, content)
  }, [portfolioId])

  const updateCursor = useCallback((position) => {
    socketService.updateCursor(portfolioId, position)
  }, [portfolioId])

  return {
    isConnected,
    onlineUsers,
    updateContent,
    updateCursor,
    socketService
  }
}

export default useRealTimeSync
