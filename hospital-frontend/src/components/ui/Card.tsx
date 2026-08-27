import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={[
        'bg-white border border-neutral-200 rounded-lg shadow-sm',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={['px-5 py-4 border-b border-neutral-200', className].join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardBody({ children, className = '', ...props }: CardProps) {
  return (
    <div className={['p-5', className].join(' ')} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={['px-5 py-4 border-t border-neutral-200 bg-neutral-50 rounded-b-lg', className].join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}