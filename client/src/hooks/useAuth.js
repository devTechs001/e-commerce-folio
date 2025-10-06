import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'

/**
 * Custom hook for authentication state and actions
 * @returns {Object} Auth context with user, loading, login, logout, and updateUser
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}