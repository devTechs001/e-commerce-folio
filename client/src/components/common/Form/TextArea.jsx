import React from 'react'

const Textarea = ({
  label,
  error,
  helperText,
  className = '',
  rows = 3,
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={`
          block w-full rounded-lg border-gray-300 shadow-sm
          focus:border-primary-500 focus:ring-primary-500
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
          py-2 px-3
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}

export default Textarea