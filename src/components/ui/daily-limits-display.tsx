'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useSupabase } from '@/components/providers/supabase-provider'

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
  const [data, setData] = useState<DailyLimitsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { supabase } = useSupabase()

  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setError('Не авторизован')
          setLoading(false)
          return
        }

        // Пользователь
        const { data: userRow } = await supabase
          .from('users')
          .select('is_pro, pro_plan_type, daily_tokens_used')
          .eq('id', session.user.id)
          .single()

        const isPro = !!userRow?.is_pro
        const proPlanType = (userRow as any)?.pro_plan_type ?? null

        // Лимиты (приближенно как в Next)
        const requestLimit = isPro ? 100 : 20
        const tokenLimit = isPro ? 25000 : 5000

        // Подсчет использования за сегодня
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        const { count: requestsUsed } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
          .gte('created_at', startOfDay.toISOString())

        const { data: tokensRows } = await supabase
          .from('messages')
          .select('tokens_used, created_at')
          .eq('user_id', session.user.id)
          .gte('created_at', startOfDay.toISOString())

        const tokensUsed = (tokensRows || []).reduce((sum: number, row: any) => sum + (row.tokens_used || 0), 0)

        const dailyLimits = {
          allowed: (requestsUsed || 0) < requestLimit && tokensUsed < tokenLimit,
          limit: requestLimit,
          used: requestsUsed || 0,
          remaining: Math.max(0, requestLimit - (requestsUsed || 0)),
          reason: (requestsUsed || 0) >= requestLimit ? 'DAILY_REQUEST_LIMIT_EXCEEDED' : (tokensUsed >= tokenLimit ? 'DAILY_TOKEN_LIMIT_EXCEEDED' : undefined)
        }

        const dailyTokens = {
          limit: tokenLimit,
          used: tokensUsed,
          remaining: Math.max(0, tokenLimit - tokensUsed)
        }

        setData({ isPro, proPlanType, dailyLimits, dailyTokens })
      } catch (e) {
        setError('Не удалось загрузить лимиты')
      } finally {
        setLoading(false)
      }
    }

    fetchLimits()
  }, [supabase])

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

  if (error || !data) {
    return (
      <div className="p-4 bg-background rounded-lg border border-border">
        <div className="flex items-center space-x-2 text-error">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">{error || 'Ошибка загрузки лимитов'}</span>
        </div>
      </div>
    )
  }

  const requestsPercentage = (data.dailyLimits.used / data.dailyLimits.limit) * 100
  const tokensPercentage = (data.dailyTokens.used / data.dailyTokens.limit) * 100

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-background rounded-lg border border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium text-text-primary">Дневные лимиты</h3>
        </div>
        {data.dailyLimits.allowed ? (
          <CheckCircle className="w-4 h-4 text-success" />
        ) : (
          <AlertCircle className="w-4 h-4 text-error" />
        )}
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-text-secondary">
            <span>Запросы: {data.dailyLimits.used}/{data.dailyLimits.limit}</span>
            <span>{data.dailyLimits.remaining} осталось</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(requestsPercentage, 100)}%` }} transition={{ duration: 0.5 }} className={`h-2 rounded-full ${requestsPercentage > 80 ? 'bg-error' : requestsPercentage > 60 ? 'bg-warning' : 'bg-primary'}`} />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-text-secondary">
            <span>Токены: {data.dailyTokens.used}/{data.dailyTokens.limit}</span>
            <span>{data.dailyTokens.remaining} осталось</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(tokensPercentage, 100)}%` }} transition={{ duration: 0.5 }} className={`h-2 rounded-full ${tokensPercentage > 80 ? 'bg-error' : tokensPercentage > 60 ? 'bg-warning' : 'bg-primary'}`} />
          </div>
        </div>

        <div className="text-xs text-text-secondary">
          {data.dailyLimits.allowed ? (
            <span className="text-success">Лимиты не превышены</span>
          ) : (
            <div className="space-y-1">
              <span className="text-error">{data.dailyLimits.reason === 'DAILY_REQUEST_LIMIT_EXCEEDED' ? 'Превышен лимит запросов' : 'Превышен лимит токенов'}</span>
              <div className="flex items-center space-x-1 text-info">
                <Clock className="w-3 h-3" />
                <span>Завтра будет обновление</span>
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-text-secondary">План: {data.isPro ? `PRO ${data.proPlanType || ''}` : 'Starter'}</div>
      </div>
    </motion.div>
  )
}

// (legacy simplified component removed)
