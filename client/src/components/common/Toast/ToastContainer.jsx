import React from 'react'
import { createPortal } from 'react-dom'
import Toast from './Toast'

const ToastContainer = ({ toasts, onRemove }) => {
  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>,
    document.body
  )
}

export default ToastContainer