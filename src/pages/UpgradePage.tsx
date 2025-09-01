import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Crown, Check, Star, Zap, ArrowLeft, Shield } from 'lucide-react'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useApp } from '@/components/providers/app-provider'
import { createPayment } from '@/api/payments'

export default function UpgradePage() {
  const { user, loading, supabase } = useSupabase()
  const { isPro } = useApp()
  const navigate = useNavigate()
  const [selectedPlan] = useState<'weekly'|'monthly'|'yearly'>('weekly')

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
    navigate('/login', { replace: true })
    return null
  }

  const plans = [
    { id: 'weekly', name: 'Недельный', price: '299', originalPrice: '599', period: 'неделя', features: ['Неограниченные чаты','Доступ к GPT-4','Доступ к Claude','Приоритетная поддержка','Экспорт чатов'], popular: false },
    { id: 'monthly', name: 'Месячный', price: '999', originalPrice: '1999', period: 'месяц', features: ['Неограниченные чаты','Доступ к GPT-4','Доступ к Claude','Приоритетная поддержка','Экспорт чатов','Настройки модели'], popular: true },
    { id: 'yearly', name: 'Годовой', price: '8999', originalPrice: '19999', period: 'год', features: ['Неограниченные чаты','Доступ к GPT-4','Доступ к Claude','Приоритетная поддержка','Экспорт чатов','Настройки модели','API доступ'], popular: false }
  ]

  const handleUpgrade = async (planId: string) => {
    try {
      if (!user) { navigate('/login', { replace: true }); return }
      const pricing: Record<string, { price: number }> = { weekly: { price: 199 }, monthly: { price: 999 }, yearly: { price: 9999 } }
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token || ''
      const response = await createPayment({ type: 'subscription', plan: planId, price: pricing[planId].price, userId: user.id, accessToken })
      window.location.href = response.paymentUrl
    } catch (error) {
      console.error('Ошибка при переходе на план:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between p-6 border-b border-border bg-background">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/profile')} className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">Перейти на PRO</h1>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-primary mb-4">{isPro ? 'Управление подпиской' : 'Откройте полный потенциал ИИ'}</h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">{isPro ? 'Управляйте своей PRO подпиской и получайте максимум от нашего сервиса' : 'Получите неограниченный доступ к самым мощным ИИ моделям'}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-background-secondary rounded-xl p-6 border border-border text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Неограниченные чаты</h3>
            <p className="text-text-secondary">Создавайте столько чатов, сколько нужно</p>
          </div>
          <div className="bg-background-secondary rounded-xl p-6 border border-border text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Премиум модели</h3>
            <p className="text-text-secondary">Доступ к GPT-4, Claude и другим топовым моделям</p>
          </div>
          <div className="bg-background-secondary rounded-xl p-6 border border-border text-center">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Приоритетная поддержка</h3>
            <p className="text-text-secondary">Быстрые ответы на ваши вопросы</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className={`relative bg-background-secondary rounded-xl p-6 border-2 transition-all ${selectedPlan === plan.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'} ${plan.popular ? 'ring-2 ring-primary/20' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">Популярный</span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-text-primary mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-text-primary">{plan.price}₽</span>
                  <span className="text-text-secondary">/{plan.period}</span>
                </div>
                {plan.originalPrice && (<p className="text-sm text-text-secondary line-through">{plan.originalPrice}₽</p>)}
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => handleUpgrade(plan.id)} className={`w-full py-3 rounded-lg font-semibold transition-colors ${selectedPlan === plan.id ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-muted text-text-primary hover:bg-accent'}`}>
                {isPro ? 'Изменить план' : 'Выбрать план'}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-text-primary mb-6 text-center">Часто задаваемые вопросы</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background-secondary rounded-xl p-6 border border-border">
              <h4 className="text-lg font-semibold text-text-primary mb-2">Можно ли отменить подписку?</h4>
              <p className="text-text-secondary">Да, вы можете отменить подписку в любое время в настройках профиля.</p>
            </div>
            <div className="bg-background-secondary rounded-xl p-6 border border-border">
              <h4 className="text-lg font-semibold text-text-primary mb-2">Есть ли пробный период?</h4>
              <p className="text-text-secondary">Да, мы предлагаем 7 дней бесплатного пробного периода для всех планов.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
