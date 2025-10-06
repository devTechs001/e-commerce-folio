import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for managing state with localStorage persistence
 * @param {string} key - localStorage key
 * @param {*} initialValue - Initial value
 * @param {Object} options - Options for serialization/deserialization
 * @returns {Array} [value, setValue, removeValue]
 */
export const useLocalStorage = (key, initialValue, options = {}) => {
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    initializeOnMount = true
  } = options

  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      if (item === null) {
        return initialValue
      }
      return deserializer(item)
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, serializer(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, serializer, storedValue])

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Listen for storage changes in other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorageChange = (event) => {
      if (event.key === key && event.newValue !== event.oldValue) {
        try {
          const newValue = event.newValue ? deserializer(event.newValue) : initialValue
          setStoredValue(newValue)
        } catch (error) {
          console.error(`Error handling storage change for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, initialValue, deserializer])

  return [storedValue, setValue, removeValue]
}