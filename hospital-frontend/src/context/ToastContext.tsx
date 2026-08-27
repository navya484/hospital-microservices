import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  variant: ToastVariant
  title: string
  description?: string
}

interface ToastContextValue {
  showToast: (variant: ToastVariant, title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const variantConfig: Record<ToastVariant,
  { icon: typeof CheckCircle2; iconClass: string; borderClass: string }
> = {
  success: { icon: CheckCircle2, iconClass: 'text-success-600', borderClass: 'border-l-success-500' },
  error: { icon: XCircle, iconClass: 'text-error-600', borderClass: 'border-l-error-500' },
  warning: { icon: AlertTriangle, iconClass: 'text-warning-600', borderClass: 'border-l-warning-500' },
  info: { icon: Info, iconClass: 'text-info-600', borderClass: 'border-l-info-500' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      const id = crypto.randomUUID()
      setToasts((prev) => [...prev, { id, variant, title, description }])
      setTimeout(() => removeToast(id), 5000)
    },
    [removeToast]
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
        {toasts.map((toast) => {
          const config = variantConfig[toast.variant]
          const Icon = config.icon
          return (
            <div
              key={toast.id}
              role="alert"
              className={[
                'flex items-start gap-3 bg-white border border-neutral-200 border-l-4 rounded-md shadow-md p-4 animate-in fade-in slide-in-from-top-2 duration-200',
                config.borderClass,
              ].join(' ')}
            >
              <Icon size={20} className={['shrink-0 mt-0.5', config.iconClass].join(' ')} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-sm text-neutral-500">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-neutral-400 hover:text-neutral-600"
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}