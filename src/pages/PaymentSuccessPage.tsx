import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowRight, Crown } from 'lucide-react'

export default function PaymentSuccessPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Автоматическое перенаправление через 5 секунд
    const timer = setTimeout(() => {
      navigate('/chat', { replace: true })
    }, 5000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Оплата прошла успешно!
          </h1>
          <p className="text-text-secondary">
            Добро пожаловать в PRO! Теперь у вас есть доступ ко всем возможностям.
          </p>
        </div>

        {/* PRO Benefits */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-text-primary">PRO возможности</h2>
          </div>
          
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-text-secondary">Неограниченные чаты</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-text-secondary">Доступ к GPT-4 и Claude</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-text-secondary">Приоритетная поддержка</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-text-secondary">Экспорт чатов</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/chat', { replace: true })}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2"
          >
            <span>Начать чат</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => navigate('/profile')}
            className="w-full bg-background border border-border text-text-primary py-3 rounded-xl font-semibold hover:bg-muted transition-colors"
          >
            Перейти в профиль
          </button>
        </div>

        <p className="text-sm text-text-secondary mt-6">
          Автоматическое перенаправление через 5 секунд...
        </p>
      </div>
    </div>
  )
}
