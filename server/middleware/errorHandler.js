const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.stack)
  
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message)
      return res.status(400).json({
        error: 'Validation Error',
        details: errors
      })
    }
  
    // Mongoose duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0]
      return res.status(400).json({
        error: `Duplicate field value: ${field}`,
        details: [`${field} already exists`]
      })
    }
  
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' })
    }
  
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    }
  
    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' })
    }
  
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Unexpected file field' })
    }
  
    // Default error
    res.status(err.status || 500).json({
      error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    })
  }
  
  export default errorHandler