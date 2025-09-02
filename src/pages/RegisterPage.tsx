import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'
import { useSupabase } from '@/components/providers/supabase-provider'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { useMeta } from '@/hooks/useMeta'

export default function RegisterPage() {
  // SEO мета-теги для страницы регистрации
  useMeta({
    title: "Регистрация аккаунта - ChatAI PRO | Бесплатный доступ к ИИ",
    description: "Создайте бесплатный аккаунт ChatAI PRO для доступа к GPT-4, Claude, DeepSeek и другим ИИ-моделям. Регистрация без VPN за 1 минуту.",
    keywords: "регистрация chatai pro, создать аккаунт gpt, бесплатная регистрация ии чат, signup deepseek, аккаунт claude чат",
    ogTitle: "Регистрация аккаунта - ChatAI PRO",
    ogDescription: "Создайте бесплатный аккаунт для доступа к передовым ИИ-моделям без VPN.",
    ogUrl: "https://aichat-pro.ru/register"
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user, loading: authLoading } = useSupabase()

  // Если пользователь уже авторизован, перенаправляем
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/chat', { replace: true })
    }
  }, [user, authLoading, navigate])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('Пароли не совпадают')
      return
    }

    if (password.length < 6) {
      toast.error('Пароль должен содержать минимум 6 символов')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/chat`
        }
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Регистрация успешна! Проверьте email для подтверждения.')
        navigate('/login', { replace: true })
      }
    } catch (error) {
      toast.error('Произошла ошибка при регистрации')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
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
      toast.error('Ошибка при регистрации через Google')
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
          <Link to="/" className="inline-block w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 hover:bg-primary-dark transition-colors">
            <Sparkles className="w-8 h-8 text-white" />
          </Link>
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            Создать аккаунт
          </h2>
          <p className="text-text-secondary">
            Зарегистрируйтесь для начала работы
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleRegister}>
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

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Подтвердите пароль
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text-primary placeholder-text-secondary transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 hover:bg-primary-dark"
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
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
          className="w-full bg-background border border-border text-text-primary py-3 rounded-xl font-medium transition-all duration-200 hover:bg-muted flex items-center justify-center space-x-3"
          onClick={handleGoogleRegister}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Зарегистрироваться через Google</span>
        </button>

        <div className="text-center text-sm text-text-secondary">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-primary hover:text-primary-dark font-medium transition-colors">
            Войти
          </Link>
        </div>
      </div>
    </div>
  )
}
