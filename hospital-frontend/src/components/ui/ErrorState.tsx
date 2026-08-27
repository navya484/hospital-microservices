import { AlertCircle } from 'lucide-react'
import Button from './Button'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export default function ErrorState({
  title = 'Something went wrong',
  description = 'We ran into a problem loading this data. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-error-50 text-error-600 mb-4">
        <AlertCircle size={22} />
      </div>
      <p className="text-sm font-semibold text-neutral-900">{title}</p>
      <p className="mt-1 text-sm text-neutral-500 max-w-sm">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  )
}