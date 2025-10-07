import React, { createContext, useContext, useEffect, useState } from 'react'
import { socketService } from '../services/socket'
import { updateService } from '../services/updateService'
import { realTimeService } from '../services/realtime'

export const AuthContext = createContext(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem('auth:user')
    const token = localStorage.getItem('token')
    
    if (raw) {
      try { 
        const userData = JSON.parse(raw)
        setUser(userData)
        
        // Initialize services for authenticated user
        if (token && userData && userData.email) {
          realTimeService.init(token)
          socketService.connect(token)
          updateService.init(userData)
        }
      } catch {}
    }
    setLoading(false)
  }, [])

  const login = async (userData) => {
    try {
      if (!userData || !userData.user) {
        throw new Error('Invalid user data received')
      }
      
      setUser(userData.user)
      localStorage.setItem('auth:user', JSON.stringify(userData.user))
      localStorage.setItem('token', userData.token)
      
      // Initialize real-time services with null checks
      if (userData.token) {
        realTimeService.init(userData.token)
        socketService.connect(userData.token)
      }
      
      // Initialize update service with null check
      if (updateService && userData.user) {
        updateService.init(userData.user)
      }
      
      return userData
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth:user')
    localStorage.removeItem('token')
    
    // Cleanup services
    socketService.disconnect()
    updateService.destroy()
  }

  const hasRole = (role) => {
    if (!user) return false
    const roles = user.roles || user.role ? [user.role].filter(Boolean).concat(user.roles || []) : []
    return roles.includes(role)
  }

  const value = { user, loading, login, logout, hasRole }
  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}


