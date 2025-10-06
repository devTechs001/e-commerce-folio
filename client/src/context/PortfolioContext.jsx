import React, { createContext, useContext, useEffect, useState } from 'react'
import { portfolioService } from '../services/portfolio'

export const PortfolioContext = createContext(null)

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider')
  return ctx
}

export const PortfolioProvider = ({ children }) => {
  const [portfolios, setPortfolios] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadPortfolios = async () => {
    try {
      setLoading(true)
      const res = await portfolioService.getMyPortfolios()
      if (res?.success) setPortfolios(res.data)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load portfolios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPortfolios() }, [])

  const value = {
    portfolios,
    loading,
    error,
    reload: loadPortfolios,
    setPortfolios
  }

  return (
    <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
  )
}


