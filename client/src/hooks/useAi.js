import { useState, useCallback } from 'react'
import { aiService } from '../services/ai'

export const useAI = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generateContent = useCallback(async (portfolioId, sectionType, prompt, tone = 'professional') => {
    try {
      setLoading(true)
      setError(null)
      const response = await aiService.generateContent(portfolioId, sectionType, prompt, tone)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const optimizeSEO = useCallback(async (text, keywords = []) => {
    try {
      setLoading(true)
      setError(null)
      const response = await aiService.optimizeSEO(text, keywords)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getSuggestions = useCallback(async (portfolioId, sectionType, currentContent) => {
    try {
      setLoading(true)
      setError(null)
      const response = await aiService.suggestImprovements(portfolioId, sectionType, currentContent)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    generateContent,
    optimizeSEO,
    getSuggestions,
    loading,
    error,
    clearError: () => setError(null)
  }
}