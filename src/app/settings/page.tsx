'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/providers/supabase-provider'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Bot, User, Settings, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, loading } = useSupabase()
  const router = useRouter()
  const [aiRules, setAiRules] = useState('')
  const [userPreferences, setUserPreferences] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadSettings()
    }
  }, [user])

  const loadSettings = async () => {
    try {
      // Загружаем настройки из localStorage
      const cachedSettings = localStorage.getItem('chatAI_user_settings')
      if (cachedSettings) {
        const settings = JSON.parse(cachedSettings)
        setAiRules(settings.aiRules || '')
        setUserPreferences(settings.userPreferences || '')
      }

      // Загружаем с сервера
      const { data, error } = await supabase
        .from('users')
        .select('ai_rules, user_preferences')
        .eq('id', user?.id)
        .single()

      if (!error && data) {
        setAiRules(data.ai_rules || '')
        setUserPreferences(data.user_preferences || '')
        
        // Сохраняем в localStorage
        localStorage.setItem('chatAI_user_settings', JSON.stringify({
          aiRules: data.ai_rules || '',
          userPreferences: data.user_preferences || ''
        }))
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error)
    }
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      // Сохраняем в localStorage
      localStorage.setItem('chatAI_user_settings', JSON.stringify({
        aiRules,
        userPreferences
      }))

      // Сохраняем на сервере
      const { error } = await supabase
        .from('users')
        .update({
          ai_rules: aiRules,
          user_preferences: userPreferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id)

      if (error) {
        throw error
      }

      toast.success('Настройки сохранены!')
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error)
      toast.error('Ошибка сохранения настроек')
    } finally {
      setIsSaving(false)
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
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">Настройки</h1>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={saveSettings}
          disabled={isSaving}
          className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Сохранение...' : 'Сохранить'}</span>
        </motion.button>
      </motion.div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* AI Rules Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-background-secondary rounded-xl p-6 border border-border"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Правила для ИИ</h2>
              <p className="text-sm text-text-secondary">Настройте поведение ИИ в чатах</p>
            </div>
          </div>

          <textarea
            value={aiRules}
            onChange={(e) => setAiRules(e.target.value)}
            placeholder="Например:&#10;- Отвечай кратко и по делу&#10;- Используй простой язык&#10;- Всегда давай практические советы&#10;- Не используй сложные термины без объяснения"
            className="w-full h-32 p-4 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary text-text-primary placeholder-text-secondary"
          />
        </motion.div>

        {/* User Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-background-secondary rounded-xl p-6 border border-border"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Ваши предпочтения</h2>
              <p className="text-sm text-text-secondary">Настройте интерфейс под себя</p>
            </div>
          </div>

          <textarea
            value={userPreferences}
            onChange={(e) => setUserPreferences(e.target.value)}
            placeholder="Например:&#10;- Показывать токены в реальном времени&#10;- Автоматически сохранять черновики&#10;- Уведомления о новых сообщениях&#10;- Темная тема по умолчанию"
            className="w-full h-32 p-4 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary text-text-primary placeholder-text-secondary"
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/profile')}
            className="p-4 bg-background-secondary rounded-xl border border-border hover:bg-muted transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-text-primary">Профиль</h3>
                <p className="text-sm text-text-secondary">Управление аккаунтом</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/upgrade')}
            className="p-4 bg-background-secondary rounded-xl border border-border hover:bg-muted transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <h3 className="font-medium text-text-primary">Upgrade</h3>
                <p className="text-sm text-text-secondary">Расширенные возможности</p>
              </div>
            </div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
