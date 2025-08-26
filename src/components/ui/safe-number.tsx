'use client'

import { useState, useEffect } from 'react'

interface SafeNumberProps {
  value: number
  className?: string
  children?: (formattedValue: string) => React.ReactNode
}

export function SafeNumber({ value, className, children }: SafeNumberProps) {
  const [formattedValue, setFormattedValue] = useState<string>('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setFormattedValue(value.toLocaleString('ru-RU'))
  }, [value])

  if (!isClient) {
    // На сервере показываем простое число без форматирования
    return <span className={className}>{value}</span>
  }

  if (children) {
    return <>{children(formattedValue)}</>
  }

  return <span className={className}>{formattedValue}</span>
}
