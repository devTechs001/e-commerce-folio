import express from 'express'
import mongoose from 'mongoose'

const router = express.Router()

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    
    // Get system info
    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      database: {
        status: dbStatus,
        name: mongoose.connection.name || 'unknown'
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
        external: Math.round(process.memoryUsage().external / 1024 / 1024 * 100) / 100
      },
      services: {
        api: 'running',
        socket: 'running'
      }
    }

    // Check if database is actually working
    if (dbStatus === 'connected') {
      try {
        await mongoose.connection.db.admin().ping()
        healthCheck.database.ping = 'success'
      } catch (error) {
        healthCheck.database.ping = 'failed'
        healthCheck.database.error = error.message
      }
    }

    res.status(200).json(healthCheck)
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    })
  }
})

// Readiness check (for Kubernetes/Docker)
router.get('/ready', async (req, res) => {
  try {
    // Check if all required services are ready
    const isDbReady = mongoose.connection.readyState === 1
    
    if (isDbReady) {
      res.status(200).json({
        status: 'READY',
        timestamp: new Date().toISOString()
      })
    } else {
      res.status(503).json({
        status: 'NOT_READY',
        timestamp: new Date().toISOString(),
        reason: 'Database not connected'
      })
    }
  } catch (error) {
    res.status(503).json({
      status: 'NOT_READY',
      timestamp: new Date().toISOString(),
      error: error.message
    })
  }
})

// Liveness check (for Kubernetes/Docker)
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'ALIVE',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

export default router
