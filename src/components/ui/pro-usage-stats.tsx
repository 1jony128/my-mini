'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Clock, Zap, Activity, MessageSquare } from 'lucide-react'
import { useSupabase } from '@/components/providers/supabase-provider'
import { SafeNumber } from '@/components/ui/safe-number'

interface ProUsageData {
  user: {
    is_pro: boolean
    plan_type: string
    credits_remaining: number
    credits_total: number
  }
  today: {
    messages_count: number
    tokens_used: number
    credits_spent: number
  }
  weekly: {
    messages_count: number
    tokens_used: number
    credits_spent: number
  }
  recent_usage: Array<{
    id: string
    model_id: string
    tokens_used: number
    credits_spent: number
    message_length: number
    created_at: string
    chats: { title: string }
  }>
}

export default function ProUsageStats() {
  const { user, supabase } = useSupabase()
  const [usageData, setUsageData] = useState<ProUsageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchUsageData = async () => {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          setError('Не удалось получить сессию')
          return
        }

        const response = await fetch('/api/pro/usage', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })

        if (!response.ok) {
          throw new Error('Ошибка загрузки данных')
        }

        const data = await response.json()
        setUsageData(data)
      } catch (err) {
        console.error('Error fetching PRO usage:', err)
        setError('Ошибка загрузки статистики')
      } finally {
        setLoading(false)
      }
    }

    fetchUsageData()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-text-secondary">{error}</p>
      </div>
    )
  }

  if (!usageData || !usageData.user.is_pro) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getModelName = (modelId: string) => {
    const modelNames: Record<string, string> = {
      'deepseek/deepseek-r1:free': 'DeepSeek R1',
      'gpt-4': 'GPT-4',
      'gpt-4-turbo': 'GPT-4 Turbo',
      'claude-3-opus': 'Claude 3 Opus',
      'gemini-pro': 'Gemini Pro'
    }
    return modelNames[modelId] || modelId
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center space-x-3">
        <Activity className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold text-text-primary">Статистика PRO</h3>
      </div>

      {/* Основная статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background rounded-lg p-4 border border-border"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold text-text-primary">
                {usageData.user.credits_remaining}
              </p>
              <p className="text-sm text-text-secondary">Кредитов осталось</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-background rounded-lg p-4 border border-border"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-lg font-bold text-text-primary">
                {usageData.today.messages_count}
              </p>
              <p className="text-sm text-text-secondary">Сообщений сегодня</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-background rounded-lg p-4 border border-border"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-lg font-bold text-text-primary">
                <div className="text-2xl font-bold text-text-primary">
                  <SafeNumber value={usageData.today.tokens_used} />
                </div>
              </p>
              <p className="text-sm text-text-secondary">Токенов сегодня</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-background rounded-lg p-4 border border-border"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-lg font-bold text-text-primary">
                {usageData.weekly.messages_count}
              </p>
              <p className="text-sm text-text-secondary">Сообщений за неделю</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Недавнее использование */}
      <div className="bg-background rounded-lg p-6 border border-border">
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="w-5 h-5 text-text-secondary" />
          <h4 className="text-lg font-semibold text-text-primary">Недавнее использование</h4>
        </div>
        
        {usageData.recent_usage.length > 0 ? (
          <div className="space-y-3">
            {usageData.recent_usage.map((usage) => (
              <motion.div
                key={usage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-text-primary">
                    {getModelName(usage.model_id)}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {usage.chats?.title || 'Без названия'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-text-primary">
                    {usage.credits_spent} кредит{usage.credits_spent !== 1 ? 'ов' : ''}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {formatDate(usage.created_at)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-text-secondary text-center py-4">
            Пока нет данных об использовании
          </p>
        )}
      </div>

      {/* Информация о плане */}
      <div className="bg-background rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-text-primary">
              План: {usageData.user.plan_type === 'weekly' ? 'Недельный' : 
                     usageData.user.plan_type === 'monthly' ? 'Месячный' : 'Годовой'}
            </p>
            <p className="text-sm text-text-secondary">
              Всего кредитов: {usageData.user.credits_total}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-secondary">
              Использовано: {usageData.user.credits_total - usageData.user.credits_remaining}
            </p>
            <div className="w-24 h-2 bg-muted rounded-full mt-1">
              <div 
                className="h-2 bg-primary rounded-full transition-all duration-300"
                style={{ 
                  width: `${((usageData.user.credits_total - usageData.user.credits_remaining) / usageData.user.credits_total) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
