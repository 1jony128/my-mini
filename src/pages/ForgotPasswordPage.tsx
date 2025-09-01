import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`
      })

      if (error) {
        toast.error(error.message)
      } else {
        setSent(true)
        toast.success('Инструкции отправлены на ваш email')
      }
    } catch (error) {
      toast.error('Произошла ошибка при отправке')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background-secondary to-background">
        <div className="max-w-md w-full space-y-8 p-8 bg-background rounded-2xl border border-border shadow-lg">
          <div className="text-center">
            <Mail className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-text-primary">
              Проверьте email
            </h2>
            <p className="mt-2 text-text-secondary">
              Мы отправили инструкции по восстановлению пароля на {email}
            </p>
          </div>
          <div className="text-center">
            <Link to="/login">
              <button className="w-full bg-background border border-border text-text-primary py-3 rounded-xl font-medium transition-all duration-200 hover:bg-muted">
                <ArrowLeft className="h-4 w-4 mr-2 inline" />
                Вернуться к входу
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background-secondary to-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-background rounded-2xl border border-border shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-primary">
            Восстановление пароля
          </h2>
          <p className="mt-2 text-text-secondary">
            Введите email для получения инструкций
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleResetPassword}>
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

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 hover:bg-primary-dark"
            disabled={loading}
          >
            {loading ? 'Отправка...' : 'Отправить инструкции'}
          </button>
        </form>

        <div className="text-center">
          <Link to="/login" className="text-primary hover:text-primary-dark text-sm">
            Вспомнили пароль? Войти
          </Link>
        </div>
      </div>
    </div>
  )
}
