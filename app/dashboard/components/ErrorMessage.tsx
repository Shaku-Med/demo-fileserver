import React from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ErrorMessageProps {
    message?: string
    onClose?: () => void
    className?: string
}

const ErrorMessage = ({ message, onClose, className }: ErrorMessageProps) => {
  if (!message) return null

  return (
    <>
    <div className={`w-full h-full flex items-center justify-center px-4`}>
        <div className={cn(
          "flex items-start gap-3 p-4 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive",
          "dark:border-destructive/30 dark:bg-destructive/10",
          className
        )}>
          <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1 text-sm font-medium">
            {message}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="h-5 w-5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}
        </div>
    </div>
    </>
  )
}

export default ErrorMessage
