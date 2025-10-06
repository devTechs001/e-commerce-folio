import React from 'react'
import { Check } from 'lucide-react'

const Checkbox = ({ 
  label, 
  checked, 
  onChange, 
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <label className={`flex items-center space-x-3 cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div className={`
          w-5 h-5 border-2 rounded transition-all duration-200
          ${checked 
            ? 'bg-primary-600 border-primary-600' 
            : 'bg-white border-gray-300'
          }
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:border-primary-500'
          }
        `}>
          {checked && (
            <Check className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          )}
        </div>
      </div>
      {label && (
        <span className={`text-sm ${
          disabled ? 'text-gray-500' : 'text-gray-700'
        }`}>
          {label}
        </span>
      )}
    </label>
  )
}

export default Checkbox