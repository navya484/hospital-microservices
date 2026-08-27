import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  label?: string
  rows?: number
  variant?: 'spinner' | 'skeleton-table'
}

export default function LoadingState({
  label = 'Loading...',
  rows = 5,
  variant = 'spinner',
}: LoadingStateProps) {
  if (variant === 'skeleton-table') {
    return (
      <div className="animate-pulse divide-y divide-neutral-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-4 px-1">
            <div className="w-9 h-9 rounded-full bg-neutral-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 rounded bg-neutral-200" />
              <div className="h-3 w-1/5 rounded bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
      <Loader2 size={24} className="animate-spin mb-3" />
      <p className="text-sm">{label}</p>
    </div>
  )
}