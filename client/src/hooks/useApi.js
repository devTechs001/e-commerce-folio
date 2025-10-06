import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for handling API calls with loading and error states
 * @param {Function} apiFunction - The API function to call
 * @param {boolean} immediate - Whether to call the API immediately
 * @param {Array} dependencies - Dependencies for the API call
 * @returns {Object} API state and execute function
 */
export const useApi = (apiFunction, immediate = true, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)
  const [called, setCalled] = useState(false)

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiFunction(...args)
      setData(response.data || response)
      setCalled(true)
      return response
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred'
      setError(errorMessage)
      setCalled(true)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiFunction])

  const reset = useCallback(() => {
    setData(null)
    setLoading(false)
    setError(null)
    setCalled(false)
  }, [])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate, ...dependencies])

  return { 
    data, 
    loading, 
    error, 
    execute, 
    reset,
    called,
    // Helper states
    hasData: data !== null,
    hasError: error !== null,
    isSuccess: called && !loading && !error,
    isError: called && !loading && error !== null
  }
}