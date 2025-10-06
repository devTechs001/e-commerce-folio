import { useState, useEffect, useRef } from 'react'
import { socketService } from '../services/socket'

/**
 * Custom hook for managing socket connections and events
 * @param {Array} events - Array of event names to listen to
 * @returns {Object} Socket connection state and methods
 */
export const useSocket = (events = []) => {
  const [isConnected, setIsConnected] = useState(socketService.getConnectionStatus())
  const [socketId, setSocketId] = useState(socketService.getSocketId())
  const eventCallbacks = useRef(new Map())

  useEffect(() => {
    // Connection status listeners
    const handleConnect = (id) => {
      setIsConnected(true)
      setSocketId(id)
    }

    const handleDisconnect = () => {
      setIsConnected(false)
      setSocketId(null)
    }

    // Register connection events
    socketService.on('connect', handleConnect)
    socketService.on('disconnect', handleDisconnect)
    socketService.on('reconnect', handleConnect)

    // Register custom events
    events.forEach(event => {
      const callback = (data) => {
        const eventCallbacks = eventCallbacks.current.get(event)
        if (eventCallbacks) {
          eventCallbacks.forEach(cb => cb(data))
        }
      }
      socketService.on(event, callback)
    })

    return () => {
      // Cleanup
      socketService.off('connect', handleConnect)
      socketService.off('disconnect', handleDisconnect)
      socketService.off('reconnect', handleConnect)
      
      events.forEach(event => {
        socketService.off(event)
      })
    }
  }, [events])

  const on = (event, callback) => {
    if (!eventCallbacks.current.has(event)) {
      eventCallbacks.current.set(event, new Set())
    }
    eventCallbacks.current.get(event).add(callback)
    socketService.on(event, callback)
  }

  const off = (event, callback) => {
    if (eventCallbacks.current.has(event)) {
      eventCallbacks.current.get(event).delete(callback)
    }
    socketService.off(event, callback)
  }

  const emit = (event, data) => {
    socketService.emit(event, data)
  }

  const joinRoom = (roomId) => {
    socketService.emit('join_room', { roomId })
  }

  const leaveRoom = (roomId) => {
    socketService.emit('leave_room', { roomId })
  }

  return {
    isConnected,
    socketId,
    on,
    off,
    emit,
    joinRoom,
    leaveRoom,
    // Socket service methods
    connect: socketService.connect.bind(socketService),
    disconnect: socketService.disconnect.bind(socketService),
    reconnect: socketService.reconnect.bind(socketService)
  }
}