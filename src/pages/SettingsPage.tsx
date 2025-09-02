import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useTheme } from '@/components/providers/theme-provider'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Moon, Sun, Settings, Save, X, Crown, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, loading, supabase } = useSupabase()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [aiRules, setAiRules] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [userData, setUserData] = useState({
    isPro: false,
    proPlanType: null,
    proExpiresAt: null
  })

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (user) {
      loadUserSettings()
    }
  }, [user])

  const loadUserSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('display_name, ai_rules, is_pro, pro_plan_type, pro_active_date')
        .eq('id', user?.id)
        .single()

      console.log('Загрузка настроек пользователя:', { data, error })

      if (!error && data) {
        setDisplayName(data.display_name || user?.email?.split('@')[0] || 'Пользователь')
        setAiRules(data.ai_rules || '')
        setUserData({
          isPro: data.is_pro || false,
          proPlanType: data.pro_plan_type,
          proExpiresAt: data.pro_active_date
        })
        console.log('AI Rules загружены:', data.ai_rules)
      } else {
        console.error('Ошибка или нет данных:', error)
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
      console.log('Сохранение настроек:', { displayName: displayName.trim(), aiRules: aiRules.trim() })
      
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
        toast.error('Ошибка сохранения настроек: ' + error.message)
      } else {
        toast.success('Настройки сохранены')
        setIsEditing(false)
        // Перезагружаем настройки для проверки
        loadUserSettings()
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
        <div className="text-text-primary text-lg">Загрузка...</div>
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
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center space-x-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/chat')}
                className="p-2 rounded-lg bg-background hover:bg-muted transition-colors text-text-primary"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              
              <div className="flex items-center space-x-3">
                <Link to="/" className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors">
                  <Settings className="w-5 h-5 text-white" />
                </Link>
                <h1 className="text-xl font-bold text-text-primary">Настройки</h1>
              </div>
            </motion.div>

            <div className="flex items-center space-x-2">
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
                    className="flex items-center space-x-2 px-4 py-2 bg-muted text-text-primary rounded-lg hover:bg-accent transition-colors"
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
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-background-secondary rounded-lg p-6 border border-border"
        >
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-text-primary">Профиль</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Отображаемое имя
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary disabled:opacity-50"
                placeholder="Введите ваше имя"
              />
            </div>
          </div>
        </motion.div>

        {/* Theme Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-background-secondary rounded-lg p-6 border border-border"
        >
          <div className="flex items-center space-x-3 mb-4">
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-primary" />
            ) : (
              <Sun className="w-5 h-5 text-primary" />
            )}
            <h2 className="text-xl font-semibold text-text-primary">Тема</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'light'
                  ? 'bg-primary text-white'
                  : 'bg-background text-text-primary hover:bg-muted'
              }`}
            >
              Светлая
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-primary text-white'
                  : 'bg-background text-text-primary hover:bg-muted'
              }`}
            >
              Темная
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'system'
                  ? 'bg-primary text-white'
                  : 'bg-background text-text-primary hover:bg-muted'
              }`}
            >
              Системная
            </button>
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
            <h2 className="text-xl font-semibold text-text-primary">Правила для ИИ</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Персональные инструкции
              </label>
              <textarea
                value={aiRules}
                onChange={(e) => setAiRules(e.target.value)}
                disabled={!isEditing}
                rows={4}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary disabled:opacity-50 resize-none"
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
            <h2 className="text-xl font-semibold text-text-primary">Статус аккаунта</h2>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-text-primary">
                {userData.isPro ? 'PRO' : 'Free'}
              </h3>
              <p className="text-sm text-text-secondary">
                {userData.isPro ? 'Текущий план' : 'Статус аккаунта'}
              </p>
              {userData.isPro && (
                <p className="text-xs text-text-secondary mt-1">
                  Управляйте подпиской и лимитами
                </p>
              )}
            </div>
            <button
              onClick={() => navigate('/upgrade')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              {userData.isPro ? 'Управление подпиской' : 'Перейти на PRO'}
            </button>
            
            {!userData.isPro && (
              <p className="text-xs text-text-secondary text-center mt-3">
                Оплачивая, вы соглашаетесь с{' '}
                <a href="/terms" className="text-primary hover:underline">пользовательским соглашением</a>
                {' '}и{' '}
                <a href="/privacy" className="text-primary hover:underline">политикой конфиденциальности</a>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}