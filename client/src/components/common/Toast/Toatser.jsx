import React, { useEffect } from 'react'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info,
  X 
} from 'lucide-react'

const Toast = ({ 
  message, 
  type = 'info', 
  onClose, 
  duration = 5000 
}) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  }

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  const Icon = icons[type]

  return (
    <div className={`flex items-center p-4 rounded-lg border shadow-sm ${styles[type]}`}>
      <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export default Toast