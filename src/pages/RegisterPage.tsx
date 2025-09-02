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
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
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
          className="w-full bg-background border border-border text-text-primary py-3 rounded-xl font-medium transition-all duration-200 hover:bg-muted"
          onClick={handleGoogleRegister}
        >
          Зарегистрироваться через Google
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
