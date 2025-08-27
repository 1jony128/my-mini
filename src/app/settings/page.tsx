// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useTheme } from '@/components/providers/theme-provider'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Moon, Sun, Settings, Save, X, Crown, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, loading } = useSupabase()
  const { theme, toggleTheme, setTheme } = useTheme()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [aiRules, setAiRules] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadUserSettings()
    }
  }, [user])

  const loadUserSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('display_name, ai_rules')
        .eq('id', user?.id)
        .single()

      if (!error && data) {
        setDisplayName(data.display_name || user?.email?.split('@')[0] || 'Пользователь')
        setAiRules(data.ai_rules || '')
      } else {
        setDisplayName(user?.email?.split('@')[0] || 'Пользователь')
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error)
      setDisplayName(user?.email?.split('@')[0] || 'Пользователь')
    }
  }

  const handleSaveSettings = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          display_name: displayName.trim(),
          ai_rules: aiRules.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        console.error('Ошибка сохранения настроек:', error)
        toast.error('Ошибка сохранения настроек')
      } else {
        toast.success('Настройки сохранены')
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error)
      toast.error('Ошибка сохранения настроек')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-foreground text-lg">Загрузка...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background-secondary">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg bg-background hover:bg-muted transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <div className="flex items-center space-x-3">
                <Settings className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Настройки</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Theme Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background-secondary rounded-lg p-6 border border-border"
          >
            <div className="flex items-center space-x-3 mb-4">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-primary" />
              )}
              <h2 className="text-xl font-semibold text-foreground">Внешний вид</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-foreground">Темная тема</h3>
                  <p className="text-sm text-text-secondary">
                    Переключите между светлой и темной темой
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'light'
                        ? 'bg-primary text-white'
                        : 'bg-muted hover:bg-accent text-foreground'
                    }`}
                  >
                    <Sun className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'bg-primary text-white'
                        : 'bg-muted hover:bg-accent text-foreground'
                    }`}
                  >
                    <Moon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-foreground">Автоматическое переключение</h3>
                  <p className="text-sm text-text-secondary">
                    Следовать системным настройкам
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Переключить
                </button>
              </div>
            </div>
          </motion.div>

          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-background-secondary rounded-lg p-6 border border-border"
          >
            <div className="flex items-center space-x-3 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Профиль</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Отображаемое имя
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground disabled:opacity-50"
                  placeholder="Введите ваше имя"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveSettings}
                      disabled={isSaving}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'Сохранение...' : 'Сохранить'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        loadUserSettings()
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Отмена</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Редактировать</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* AI Rules Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-background-secondary rounded-lg p-6 border border-border"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Правила для ИИ</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Персональные инструкции
                </label>
                <textarea
                  value={aiRules}
                  onChange={(e) => setAiRules(e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground disabled:opacity-50 resize-none"
                  placeholder="Опишите, как ИИ должен вести себя в разговоре с вами..."
                />
                <p className="text-xs text-text-secondary mt-1">
                  Эти правила будут применяться ко всем вашим чатам
                </p>
              </div>
            </div>
          </motion.div>

          {/* Account Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-background-secondary rounded-lg p-6 border border-border"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Crown className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Статус аккаунта</h2>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-foreground">Текущий план</h3>
                <p className="text-sm text-text-secondary">
                  Управляйте подпиской и лимитами
                </p>
              </div>
              <button
                onClick={() => router.push('/upgrade')}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Перейти на PRO
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
