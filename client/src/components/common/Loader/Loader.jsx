import React from 'react'

const Loader = ({ 
  size = 'md', 
  variant = 'spinner',
  className = '' 
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  if (variant === 'dots') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`${sizes[size]} bg-primary-600 rounded-full animate-bounce`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <div
        className={`${sizes[size]} animate-spin rounded-full border-2 border-gray-300 border-t-primary-600`}
      />
    </div>
  )
}

export default Loader