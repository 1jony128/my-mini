// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useApp } from '@/components/providers/app-provider'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import ProUsageStats from '@/components/ui/pro-usage-stats'
import { DailyLimitsDisplay } from '@/components/ui/daily-limits-display'
import { ArrowLeft, User, Mail, Calendar, Shield, LogOut, Edit, Save, X, Crown, Zap, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, loading } = useSupabase()
  const { userTokens, isPro } = useApp()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [userStats, setUserStats] = useState({
    totalChats: 0,
    totalMessages: 0,
    tokensUsed: 0,
    remainingTokens: userTokens,
    isPro: isPro
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadUserData()
      loadUserStats()
    }
  }, [user, userTokens, isPro])

  const loadUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (!error && data) {
        setDisplayName(data.display_name || user?.email?.split('@')[0] || 'Пользователь')
      } else {
        setDisplayName(user?.email?.split('@')[0] || 'Пользователь')
      }
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error)
      setDisplayName(user?.email?.split('@')[0] || 'Пользователь')
    }
  }

  const loadUserStats = async () => {
    try {
      // Загружаем статистику чатов
      const { count: chatsCount } = await supabase
        .from('chats')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)

      // Загружаем статистику сообщений
      const { count: messagesCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)

      // Загружаем данные пользователя для токенов и статуса Pro
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('tokens_balance, daily_tokens_used, is_pro')
        .eq('id', user?.id)
        .single()

      // Загружаем общее количество использованных токенов
      const { data: tokensData, error: tokensError } = await supabase
        .from('messages')
        .select('tokens_used')
        .eq('user_id', user?.id)

      const totalTokensUsed = tokensData?.reduce((sum, msg) => sum + (msg.tokens_used || 0), 0) || 0
      const remainingTokens = userData ? Math.max(0, (userData.tokens_balance || 1250) - (userData.daily_tokens_used || 0)) : 1250

      setUserStats({
        totalChats: chatsCount || 0,
        totalMessages: messagesCount || 0,
        tokensUsed: totalTokensUsed,
        remainingTokens: userTokens,
        isPro: isPro
      })
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error)
    }
  }

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          display_name: displayName,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id)

      if (error) {
        throw error
      }

      toast.success('Профиль обновлен!')
      setIsEditing(false)
    } catch (error) {
      console.error('Ошибка сохранения профиля:', error)
      toast.error('Ошибка сохранения профиля')
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
      toast.success('Вы вышли из аккаунта')
      router.push('/auth/login')
    } catch (error) {
      console.error('Ошибка выхода:', error)
      toast.error('Ошибка выхода из аккаунта')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between p-6 border-b border-border bg-background"
      >
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/chat')}
            className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors text-text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">Профиль</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Сохранить</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-muted text-text-primary rounded-lg font-semibold hover:bg-accent transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-muted text-text-primary rounded-lg font-semibold hover:bg-accent transition-colors flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Редактировать</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-background-secondary rounded-xl p-6 border border-border"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="text-2xl font-bold text-text-primary bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <h2 className="text-2xl font-bold text-text-primary">{displayName}</h2>
              )}
              <p className="text-text-secondary">{user.email}</p>
            </div>
            {userStats.isPro && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-secondary/10 rounded-full">
                <Crown className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">PRO</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-background rounded-lg">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold text-text-primary">{userStats.totalChats}</p>
                <p className="text-sm text-text-secondary">Чатов</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-background rounded-lg">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-lg font-bold text-text-primary">{userStats.totalMessages}</p>
                <p className="text-sm text-text-secondary">Сообщений</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-background rounded-lg">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-lg font-bold text-text-primary">{userStats.totalMessages.toLocaleString()}</p>
                <p className="text-sm text-text-secondary">Всего сообщений</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/upgrade')}
              className="flex items-center space-x-3 p-4 bg-background rounded-lg hover:bg-muted transition-colors w-full text-left"
            >
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-lg font-bold text-text-primary">
                  {userStats.isPro ? 'PRO' : 'Free'}
                </p>
                <p className="text-sm text-text-secondary">
                  {userStats.isPro ? 'Текущий план' : 'Статус аккаунта'}
                </p>
                {userStats.isPro && (
                  <p className="text-xs text-text-secondary mt-1">
                    Управляйте подпиской и лимитами
                  </p>
                )}
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-background-secondary rounded-xl p-6 border border-border"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-4">Информация об аккаунте</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-background rounded-lg">
              <Mail className="w-5 h-5 text-text-secondary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Email</p>
                <p className="text-sm text-text-secondary">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-background rounded-lg">
              <Calendar className="w-5 h-5 text-text-secondary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Дата регистрации</p>
                <p className="text-sm text-text-secondary">
                  {new Date(user.created_at).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Дневные лимиты */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <DailyLimitsDisplay />
        </motion.div>

        {/* Статистика PRO */}
        {userStats.isPro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <ProUsageStats />
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/upgrade')}
            className="w-full p-4 bg-secondary text-white rounded-xl font-semibold hover:bg-secondary/90 transition-colors flex items-center justify-center space-x-2"
          >
            <Crown className="w-5 h-5" />
            <span>{userStats.isPro ? 'Управление подпиской' : 'Перейти на PRO'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignOut}
            className="w-full p-4 bg-error text-white rounded-xl font-semibold hover:bg-error/90 transition-colors flex items-center justify-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Выйти из аккаунта</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

