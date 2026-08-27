import type { LucideIcon } from 'lucide-react'

type StatCardTone = 'primary' | 'secondary' | 'success' | 'warning'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  tone?: StatCardTone
  trend?: { value: string; direction: 'up' | 'down' }
}

const toneStyles: Record<StatCardTone, string> = {
  primary: 'bg-primary-50 text-primary-600',
  secondary: 'bg-secondary-50 text-secondary-600',
  success: 'bg-success-50 text-success-600',
  warning: 'bg-warning-50 text-warning-600',
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'primary',
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-neutral-900">{value}</p>
        </div>
        <div className={['flex items-center justify-center w-10 h-10 rounded-md', toneStyles[tone]].join(' ')}>
          <Icon size={20} />
        </div>
      </div>
      {trend && (
        <p
          className={[
            'mt-3 text-xs font-medium',
            trend.direction === 'up' ? 'text-success-600' : 'text-error-600',
          ].join(' ')}
        >
          {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
        </p>
      )}
    </div>
  )
}