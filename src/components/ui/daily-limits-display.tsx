'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, XCircle, Info, Clock, AlertCircle } from 'lucide-react'
import { useSupabase } from '@/components/providers/supabase-provider'
import { SafeNumber } from '@/components/ui/safe-number'

interface DailyLimitsData {
  isPro: boolean
  proPlanType: string | null
  dailyLimits: {
    allowed: boolean
    limit: number
    used: number
    remaining: number
    reason?: string
  }
  dailyTokens: {
    limit: number
    used: number
    remaining: number
  }
}

export function DailyLimitsDisplay() {
  const [dailyLimits, setDailyLimits] = useState<DailyLimitsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { supabase } = useSupabase()

  useEffect(() => {
    fetchDailyLimits()
  }, [])

  const fetchDailyLimits = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Не авторизован')
        setLoading(false)
        return
      }

      const response = await fetch('/api/daily-limits', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Ошибка загрузки лимитов')
      }

      const data = await response.json()
      setDailyLimits(data)
    } catch (err) {
      console.error('Ошибка загрузки дневных лимитов:', err)
      setError('Не удалось загрузить лимиты')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 bg-background rounded-lg border border-border">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-primary/20 rounded-full animate-pulse"></div>
          <span className="text-sm text-text-secondary">Загрузка лимитов...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-background rounded-lg border border-border">
        <div className="flex items-center space-x-2 text-error">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    )
  }

  if (!dailyLimits) {
    return null
  }

  const { dailyLimits: limits, dailyTokens: tokens } = dailyLimits
  const requestsPercentage = (limits.used / limits.limit) * 100
  const tokensPercentage = (tokens.used / tokens.limit) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-background rounded-lg border border-border"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium text-text-primary">Дневные лимиты</h3>
        </div>
        {limits.allowed ? (
          <CheckCircle className="w-4 h-4 text-success" />
        ) : (
          <AlertCircle className="w-4 h-4 text-error" />
        )}
      </div>

      <div className="space-y-3">
        {/* Прогресс бар запросов */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-text-secondary">
            <span>Запросы: <SafeNumber value={limits.used} />/<SafeNumber value={limits.limit} /></span>
            <span><SafeNumber value={limits.remaining} /> осталось</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(requestsPercentage, 100)}%` }}
              transition={{ duration: 0.5 }}
              className={`h-2 rounded-full ${
                requestsPercentage > 80 ? 'bg-error' : 
                requestsPercentage > 60 ? 'bg-warning' : 'bg-primary'
              }`}
            />
          </div>
        </div>

        {/* Прогресс бар токенов */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-text-secondary">
            <span>Токены: <SafeNumber value={tokens.used} />/<SafeNumber value={tokens.limit} /></span>
            <span><SafeNumber value={tokens.remaining} /> осталось</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(tokensPercentage, 100)}%` }}
              transition={{ duration: 0.5 }}
              className={`h-2 rounded-full ${
                tokensPercentage > 80 ? 'bg-error' : 
                tokensPercentage > 60 ? 'bg-warning' : 'bg-primary'
              }`}
            />
          </div>
        </div>

        {/* Статус */}
        <div className="text-xs text-text-secondary">
          {limits.allowed ? (
            <span className="text-success">Лимиты не превышены</span>
          ) : (
            <div className="space-y-1">
              <span className="text-error">
                {limits.reason === 'DAILY_REQUEST_LIMIT_EXCEEDED' 
                  ? 'Превышен лимит запросов' 
                  : 'Превышен лимит токенов'
                }
              </span>
              <div className="flex items-center space-x-1 text-info">
                <Clock className="w-3 h-3" />
                <span>Завтра будет обновление</span>
              </div>
            </div>
          )}
        </div>

        {/* Информация о плане */}
        <div className="text-xs text-text-secondary">
          План: {dailyLimits.isPro ? `PRO ${dailyLimits.proPlanType || ''}` : 'Starter'}
        </div>
      </div>
    </motion.div>
  )
}
