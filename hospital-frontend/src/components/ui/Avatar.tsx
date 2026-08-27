type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  name: string
  size?: AvatarSize
  className?: string
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'w-7 h-7 text-[10px]',
  md: 'w-9 h-9 text-xs',
  lg: 'w-12 h-12 text-sm',
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  return (
    <div
      className={[
        'flex items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold shrink-0',
        sizeStyles[size],
        className,
      ].join(' ')}
    >
      {getInitials(name)}
    </div>
  )
}