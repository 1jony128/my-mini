import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'
import { useSupabase } from '@/components/providers/supabase-provider'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { useMeta } from '@/hooks/useMeta'

export default function LoginPage() {
  // SEO мета-теги для страницы входа
  useMeta({
    title: "Вход в аккаунт - ChatAI PRO | Доступ к ИИ без VPN",
    description: "Войдите в свой аккаунт ChatAI PRO для доступа к GPT-4, Claude, DeepSeek и другим ИИ-моделям. Безопасная авторизация без VPN.",
    keywords: "вход chatai pro, логин чат gpt, авторизация ии чат, войти в gpt-4, доступ к claude, вход в deepseek",
    ogTitle: "Вход в аккаунт - ChatAI PRO",
    ogDescription: "Войдите в свой аккаунт для доступа к передовым ИИ-моделям без VPN.",
    ogUrl: "https://aichat-pro.ru/login"
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user, loading: authLoading } = useSupabase()

  // Если пользователь уже авторизован, перенаправляем в чат
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/chat', { replace: true })
    }
  }, [user, authLoading, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        const msg = (error.message || '').toLowerCase()
        if (msg.includes('email not confirmed') || msg.includes('confirm your email') || msg.includes('email needs verification')) {
          toast.error('Почта не подтверждена. Проверьте email и подтвердите аккаунт.')
        } else if (msg.includes('invalid login credentials')) {
          toast.error('Неверный email или пароль')
        } else {
          toast.error(error.message)
        }
      } else {
        toast.success('Успешный вход!')
        navigate('/chat', { replace: true })
      }
    } catch (error) {
      toast.error('Произошла ошибка при входе')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/chat`
        }
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Перенаправление на Google...')
      }
    } catch (error) {
      toast.error('Ошибка при входе через Google')
    }
  }

  // Показываем загрузку пока проверяем состояние аутентификации
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background-secondary to-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Загрузка...</p>
        </div>
      </div>
    )
  }

  // Если пользователь уже авторизован, не показываем форму
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background-secondary to-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-background rounded-2xl border border-border shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            Войти в аккаунт
          </h2>
          <p className="text-text-secondary">
            Войдите в свой аккаунт для продолжения
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text-primary placeholder-text-secondary transition-all"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Пароль
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text-primary placeholder-text-secondary transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 hover:bg-primary-dark"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-text-secondary">Или</span>
          </div>
        </div>

        <button
          className="w-full bg-background border border-border text-text-primary py-3 rounded-xl font-medium transition-all duration-200 hover:bg-muted"
          onClick={handleGoogleLogin}
        >
          Войти через Google
        </button>

        <div className="text-center">
          <Link to="/forgot-password" className="text-primary hover:text-primary-dark text-sm transition-colors">
            Забыли пароль?
          </Link>
        </div>

        <div className="text-center text-sm text-text-secondary">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-primary hover:text-primary-dark font-medium transition-colors">
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  )
}
