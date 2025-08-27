'use client'

import { useState, useEffect } from 'react'
import { Crown, Zap, Clock, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { SafeNumber } from '@/components/ui/safe-number'
import { getModelCost, getAvailableModelsForPlan, MODEL_COST_MULTIPLIERS } from '@/lib/pro-credits'
import { supabase } from '@/lib/supabase'

interface ProUsageData {
  today: {
    messages_count: number
    tokens_used: number
    credits_spent: number
  }
  user: {
    is_pro: boolean
    plan_type: string
    credits_remaining: number
    credits_total: number
    expires_at?: string
  }
}

export default function ProUsageStats() {
  const [usageData, setUsageData] = useState<ProUsageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        // Получаем токен сессии
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.access_token) {
          console.error('No access token available')
          setError('Не авторизован')
          return
        }

        const response = await fetch('/api/pro/usage', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          setUsageData(data)
          
          // Получаем доступные модели для плана
          if (data.user.plan_type) {
            const models = getAvailableModelsForPlan(data.user.plan_type as any)
            setAvailableModels(models)
          }
        } else if (response.status === 401) {
          console.error('Unauthorized access to PRO usage')
          setError('Не авторизован')
        } else if (response.status === 403) {
          console.error('PRO subscription required')
          setError('Требуется PRO подписка')
        } else {
          console.error('Error fetching PRO usage:', response.status)
          setError('Ошибка загрузки данных')
        }
      } catch (error) {
        console.error('Error fetching PRO usage:', error)
        setError('Ошибка загрузки данных')
      } finally {
        setLoading(false)
      }
    }

    fetchUsageData()
  }, [])

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-center text-text-secondary">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!usageData) {
    return null
  }

  const planTypeDisplay = usageData.user.plan_type === 'sale20' ? 'Недельный' :
                         usageData.user.plan_type === 'month' ? 'Месячный' :
                         usageData.user.plan_type === 'year' ? 'Годовой' :
                         usageData.user.plan_type === 'weekly' ? 'Недельный' :
                         usageData.user.plan_type === 'monthly' ? 'Месячный' :
                         usageData.user.plan_type === 'yearly' ? 'Годовой' : 'PRO'

  // Группируем модели по стоимости
  const modelsByCost = Object.entries(MODEL_COST_MULTIPLIERS).reduce((acc, [modelId, cost]) => {
    if (!acc[cost]) acc[cost] = []
    acc[cost].push(modelId)
    return acc
  }, {} as Record<number, string[]>)

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
          <Crown className="w-5 h-5 text-amber-500" />
          <span>PRO Статистика</span>
        </h3>
        <div className="text-sm text-text-secondary">
          {planTypeDisplay} план
        </div>
      </div>

      {/* Кредиты */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-text-primary">Остаток кредитов</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">
            <SafeNumber value={usageData.user.credits_remaining} />
          </div>
          <div className="text-xs text-text-secondary">
            из <SafeNumber value={usageData.user.credits_total} />
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-text-primary">Использовано сегодня</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">
            <SafeNumber value={usageData.today.credits_spent} />
          </div>
          <div className="text-xs text-text-secondary">
            кредитов
          </div>
        </div>
      </div>

      {/* Информация о плане */}
      <div className="bg-muted/30 rounded-lg p-3">
        <div className="flex items-center space-x-2 mb-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-text-primary">Информация о плане</span>
        </div>
        <div className="space-y-1 text-sm">
          <p className="font-medium text-text-primary">
            План: {planTypeDisplay}
          </p>
          <p className="text-text-secondary">
            Всего кредитов: <SafeNumber value={usageData.user.credits_total} />
          </p>
          {usageData.user.expires_at && (
            <p className="text-text-secondary">
              Активна до: {new Date(usageData.user.expires_at).toLocaleDateString('ru-RU')}
            </p>
          )}
        </div>
      </div>

      {/* Доступные модели */}
      <div className="bg-muted/30 rounded-lg p-3">
        <div className="flex items-center space-x-2 mb-2">
          <Crown className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-text-primary">Доступные модели</span>
        </div>
        <div className="space-y-2">
          {Object.entries(modelsByCost)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([cost, models]) => {
              const availableModelsInGroup = models.filter(model => 
                availableModels.includes(model)
              )
              
              if (availableModelsInGroup.length === 0) return null
              
              return (
                <div key={cost} className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Crown className="w-3 h-3 text-amber-500" />
                    <span className="text-xs font-medium text-amber-600">{cost}x</span>
                  </div>
                  <span className="text-xs text-text-secondary">
                    {availableModelsInGroup.length} модель{availableModelsInGroup.length !== 1 ? 'и' : ''}
                  </span>
                </div>
              )
            })}
        </div>
      </div>

      {/* Сегодняшнее использование */}
      <div className="bg-muted/30 rounded-lg p-3">
        <div className="text-sm font-medium text-text-primary mb-2">Использование сегодня</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-text-secondary">Сообщения:</span>
            <span className="ml-1 font-medium">
              <SafeNumber value={usageData.today.messages_count} />
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Токены:</span>
            <span className="ml-1 font-medium">
              <SafeNumber value={usageData.today.tokens_used} />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
