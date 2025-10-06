import React from 'react'
import { Eye, EyeOff } from 'lucide-react'

const Input = ({
  label,
  type = 'text',
  error,
  helperText,
  icon: Icon,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false)

  const inputType = type === 'password' && showPassword ? 'text' : type

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={inputType}
          className={`
            block w-full rounded-lg border-gray-300 shadow-sm
            focus:border-primary-500 focus:ring-primary-500
            disabled:bg-gray-50 disabled:text-gray-500
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
            ${Icon ? 'pl-10' : 'pl-3'}
            ${type === 'password' ? 'pr-10' : 'pr-3'}
            py-2
          `}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}

export default Input