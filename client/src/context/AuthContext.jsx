import React, { createContext, useContext, useEffect, useState } from 'react'

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
    if (raw) {
      try { setUser(JSON.parse(raw)) } catch {}
    }
    setLoading(false)
  }, [])

  const login = async (data) => {
    setUser(data)
    localStorage.setItem('auth:user', JSON.stringify(data))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth:user')
    localStorage.removeItem('token')
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


