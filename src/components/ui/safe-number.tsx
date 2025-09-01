'use client'

interface SafeNumberProps {
  value: number
  className?: string
}

export function SafeNumber({ value, className = '' }: SafeNumberProps) {
  if (typeof value !== 'number' || isNaN(value)) {
    return <span className={className}>0</span>
  }
  
  return <span className={className}>{value.toLocaleString()}</span>
}
