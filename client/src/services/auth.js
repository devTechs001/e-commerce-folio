import api from './api'

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      console.log('Login response:', response.data) // Check the structure
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      
      return response.data
    } catch (error) {
      console.error('Login service error:', error.response?.data)
      throw error
    }
  },
  
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      console.log('Registration response:', response.data) // Check the structure
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      
      return response.data
    } catch (error) {
      console.error('Registration service error:', error.response?.data)
      throw error
    }
  },

  async logout() {
    await api.post('/auth/logout')
    localStorage.removeItem('token')
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response.data
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  async resetPassword(token, password) {
    const response = await api.post('/auth/reset-password', { token, password })
    return response.data
  },

  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData)
    return response.data
  }
}