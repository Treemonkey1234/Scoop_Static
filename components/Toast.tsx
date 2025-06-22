'use client'

import React, { useEffect, useState } from 'react'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { createPortal } from 'react-dom'

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  onClose: () => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center'
}

const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  duration = 5000,
  onClose,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Entrance animation
    setTimeout(() => setIsVisible(true), 10)

    // Auto close
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  }

  const styles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: 'text-green-500',
      title: 'text-green-800',
      message: 'text-green-700',
      progress: 'bg-green-500'
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: 'text-red-500',
      title: 'text-red-800',
      message: 'text-red-700',
      progress: 'bg-red-500'
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-500',
      title: 'text-yellow-800',
      message: 'text-yellow-700',
      progress: 'bg-yellow-500'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-500',
      title: 'text-blue-800',
      message: 'text-blue-700',
      progress: 'bg-blue-500'
    }
  }

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2'
  }

  const Icon = icons[type]
  const style = styles[type]

  return (
    <div
      className={`fixed z-50 ${positionClasses[position]} transition-all duration-300 ease-out ${
        isVisible && !isLeaving
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-2 scale-95'
      }`}
    >
      <div className={`max-w-sm w-full ${style.bg} border rounded-xl shadow-lg backdrop-blur-sm overflow-hidden`}>
        {/* Progress Bar */}
        <div className="h-1 bg-slate-200">
          <div 
            className={`h-full ${style.progress} transition-all ease-linear`}
            style={{ 
              width: '100%',
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>

        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Icon className={`w-6 h-6 ${style.icon}`} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-semibold ${style.title}`}>
                {title}
              </h3>
              {message && (
                <p className={`mt-1 text-sm ${style.message}`}>
                  {message}
                </p>
              )}
            </div>

            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors duration-200"
            >
              <XMarkIcon className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Toast Manager Hook
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([])

  const addToast = (toast: Omit<ToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = {
      ...toast,
      id,
      onClose: () => removeToast(id)
    }
    setToasts(prev => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const showSuccess = (title: string, message?: string) => {
    addToast({ type: 'success', title, message })
  }

  const showError = (title: string, message?: string) => {
    addToast({ type: 'error', title, message })
  }

  const showWarning = (title: string, message?: string) => {
    addToast({ type: 'warning', title, message })
  }

  const showInfo = (title: string, message?: string) => {
    addToast({ type: 'info', title, message })
  }

  const ToastContainer = () => (
    <>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </>
  )

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    ToastContainer
  }
}

export default Toast 