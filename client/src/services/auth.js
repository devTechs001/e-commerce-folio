import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
})

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(` Making ${config.method?.toUpperCase()} request to: ${config.url}`)
    console.log('Request data:', config.data)
    return config
  },
  (error) => {
    console.error(' Request error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(` Response received:`, response.status, response.data)
    return response
  },
  (error) => {
    console.error(' Response error:')
    console.error('Status:', error.response?.status)
    console.error('Data:', error.response?.data)
    console.error('Headers:', error.response?.headers)
    console.error('Full error:', error)
    return Promise.reject(error)
  }
)

export const authService = {
  register: async (userData) => {
    try {
      console.log(' Starting registration service call...')
      console.log('User data to send:', {
        ...userData,
        password: '***' // Don't log actual password
      })
      
      const response = await api.post('/auth/register', userData)
      console.log(' Registration service call successful')
      return response.data
    } catch (error) {
      console.error(' Registration service error:')
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      throw error
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      console.error('Login service error:', error.response?.data)
      throw error
    }
  },

  getMe: async (token) => {
    try {
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      console.error('Get me service error:', error.response?.data)
      throw error
    }
  },

  updateProfile: async (token, profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      console.error('Update profile service error:', error.response?.data)
      throw error
    }
  }
}

export default authService