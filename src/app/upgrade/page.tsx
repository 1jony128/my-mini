'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSupabase } from '@/components/providers/supabase-provider'
import { motion } from 'framer-motion'
import { ArrowLeft, Zap, Check, Sparkles, Shield, Star, Crown } from 'lucide-react'
import toast from 'react-hot-toast'
import { SafeNumber } from '@/components/ui/safe-number'

export default function UpgradePage() {
  const { user, supabase } = useSupabase()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly' | 'yearly'>('weekly')

  const subscriptionPlans = {
    weekly: {
      price: 199,
      originalPrice: 299,
      period: 'неделю',
      savings: '33%'
    },
    monthly: {
      price: 999,
      originalPrice: 1299,
      period: 'месяц',
      savings: '23%'
    },
    yearly: {
      price: 9999,
      originalPrice: 15588,
      period: 'год',
      savings: '36%'
    }
  }

  const tokenPackages = [
    {
      id: 'starter',
      name: 'Стартер',
      tokens: 2500,
      price: 50,
      popular: false,
      bonus: 0
    },
    {
      id: 'standard',
      name: 'Стандарт',
      tokens: 10000,
      price: 150,
      popular: true,
      bonus: 1000
    },
    {
      id: 'premium',
      name: 'Премиум',
      tokens: 25000,
      price: 300,
      popular: false,
      bonus: 3000
    },
    {
      id: 'unlimited',
      name: 'Безлимит',
      tokens: 100000,
      price: 1000,
      popular: false,
      bonus: 15000
    }
  ]

  const subscriptionFeatures = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Неограниченные токены',
      description: 'Отправляйте столько сообщений, сколько хотите'
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'Все модели ИИ',
      description: 'Доступ к GPT-4, Claude, DeepSeek и другим'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Приоритетная поддержка',
      description: 'Быстрые ответы от нашей команды'
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: 'Расширенные настройки',
      description: 'Персонализация под ваши нужды'
    },
    {
      icon: <Crown className="w-5 h-5" />,
      title: 'Эксклюзивные функции',
      description: 'Ранний доступ к новым возможностям'
    }
  ]

  const tokenFeatures = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Мгновенная доставка',
      description: 'Токены зачисляются сразу после оплаты'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Безопасная оплата',
      description: 'Защищенные платежи через YooKassa'
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: 'Бонусные токены',
      description: 'Дополнительные токены при покупке больших пакетов'
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'Все модели ИИ',
      description: 'Доступ к GPT-4, Claude, DeepSeek и другим'
    }
  ]

  const handleSubscribe = async () => {
    try {
      if (!user) {
        toast.error('Необходимо войти в аккаунт')
        router.push('/auth/login')
        return
      }

      // Получаем токен сессии
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error('Ошибка авторизации')
        return
      }

      const plan = subscriptionPlans[selectedPlan]
      
      // Создаем платеж подписки через API
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          type: 'subscription',
          plan: selectedPlan,
          price: plan.price,
          userId: user.id
        })
      })

      if (response.ok) {
        const { paymentUrl } = await response.json()
        window.location.href = paymentUrl
      } else {
        toast.error('Ошибка создания платежа')
      }
    } catch (error) {
      toast.error('Ошибка при переходе к оплате')
    }
  }

  const handleSubscribeWithTerms = () => {
    // setPendingAction(() => handleSubscribe) // Removed as per edit hint
    // setShowTermsModal(true) // Removed as per edit hint
    handleSubscribe() // Directly call handleSubscribe
  }

  const handleBuyTokens = async (packageId: string) => {
    try {
      const pkg = tokenPackages.find(p => p.id === packageId)
      if (!pkg) return
      
      if (!user) {
        toast.error('Необходимо войти в аккаунт')
        router.push('/auth/login')
        return
      }

      // Получаем токен сессии
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error('Ошибка авторизации')
        return
      }
      
      // Создаем платеж через API
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          packageId: pkg.id,
          tokens: pkg.tokens + pkg.bonus,
          price: pkg.price,
          userId: user.id
        })
      })

      if (response.ok) {
        const { paymentUrl } = await response.json()
        window.location.href = paymentUrl
      } else {
        toast.error('Ошибка создания платежа')
      }
    } catch (error) {
      toast.error('Ошибка при переходе к оплате')
    }
  }

  const handleBuyTokensWithTerms = (packageId: string) => {
    // setPendingAction(() => () => handleBuyTokens(packageId)) // Removed as per edit hint
    // setShowTermsModal(true) // Removed as per edit hint
    handleBuyTokens(packageId) // Directly call handleBuyTokens
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
              <Crown className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">Upgrade до PRO</h1>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Crown className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-text-primary mb-4"
          >
            Откройте полный потенциал AI Chat
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-text-secondary max-w-2xl mx-auto"
          >
            Выберите подходящий план или купите токены для разового использования
          </motion.p>
        </div>

        {/* Subscription Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              PRO подписка
            </h3>
            <p className="text-text-secondary">
              Неограниченный доступ ко всем функциям
            </p>
          </div>

          {/* Plan Selection */}
          <div className="flex justify-center mb-8">
            <div className="bg-background-secondary rounded-xl p-1 border border-border">
              <div className="flex">
                <button
                  onClick={() => setSelectedPlan('weekly')}
                  className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                    selectedPlan === 'weekly'
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Недельно
                </button>
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                    selectedPlan === 'monthly'
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Ежемесячно
                </button>
                <button
                  onClick={() => setSelectedPlan('yearly')}
                  className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                    selectedPlan === 'yearly'
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Ежегодно
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
            {/* Pricing Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-background-secondary rounded-xl p-8 border border-border"
            >
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Crown className="w-6 h-6 text-secondary" />
                  <h3 className="text-2xl font-bold text-text-primary">PRO план</h3>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-baseline justify-center space-x-2">
                    <span className="text-4xl font-bold text-text-primary">
                      {subscriptionPlans[selectedPlan].price}
                    </span>
                    <span className="text-text-secondary">₽</span>
                    <span className="text-text-secondary">/ {subscriptionPlans[selectedPlan].period}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <span className="text-sm text-text-secondary line-through">
                      {subscriptionPlans[selectedPlan].originalPrice} ₽
                    </span>
                    <span className="text-sm bg-success/10 text-success px-2 py-1 rounded-full">
                      Экономия {subscriptionPlans[selectedPlan].savings}
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubscribeWithTerms}
                className="w-full py-4 bg-secondary text-white rounded-xl font-semibold hover:bg-secondary/90 transition-colors flex items-center justify-center space-x-2"
              >
                <Crown className="w-5 h-5" />
                <span>Перейти на PRO</span>
              </motion.button>

              <p className="text-xs text-text-secondary text-center mt-4">
                Отмена в любое время • Без скрытых комиссий • <strong>Без привязки карты</strong>
                <br />
                <span className="mt-2 block">
                  Нажимая кнопку выше, вы соглашаетесь с{' '}
                  <Link href="/terms" target="_blank" className="text-primary hover:underline">
                    пользовательским соглашением
                  </Link>
                  {' '}и{' '}
                  <Link href="/privacy" target="_blank" className="text-primary hover:underline">
                    политикой конфиденциальности
                  </Link>
                </span>
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-text-primary mb-6">
                Что включено в PRO
              </h3>
              
              {subscriptionFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-start space-x-4 p-4 bg-background rounded-lg border border-border"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-text-secondary">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center mb-16"
        >
          <div className="flex-1 h-px bg-border"></div>
          <span className="px-4 text-text-secondary">или</span>
          <div className="flex-1 h-px bg-border"></div>
        </motion.div>

        {/* Token Packages - ЗАКОММЕНТИРОВАНО */}
        {/*
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-text-primary mb-4">
              Купите токены
            </h3>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Не нужна подписка? Купите токены для разового использования. 
              <br />
              <span className="text-sm">Примерно 1 токен = 4 символа текста</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {tokenPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className={`relative bg-background rounded-2xl border-2 p-6 ${
                  pkg.popular 
                    ? 'border-primary shadow-lg' 
                    : 'border-border hover:border-primary/50 transition-colors'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      Популярный
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-text-primary mb-2">
                    {pkg.name}
                  </h4>
                  <div className="text-3xl font-bold text-primary mb-1">
                    {pkg.price}₽
                  </div>
                  <div className="text-sm text-text-secondary">
                    <SafeNumber value={pkg.tokens} /> токенов
                  </div>
                  {pkg.bonus > 0 && (
                    <div className="text-xs text-success font-medium mt-1">
                      +<SafeNumber value={pkg.bonus} /> бонус
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Всего токенов:</span>
                    <span className="font-medium text-text-primary">
                      <SafeNumber value={pkg.tokens + pkg.bonus} />
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Примерно сообщений:</span>
                    <span className="font-medium text-text-primary">
                      ~{Math.floor((pkg.tokens + pkg.bonus) / 100)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Цена за 1000 токенов:</span>
                    <span className="font-medium text-text-primary">
                      {((pkg.price / (pkg.tokens + pkg.bonus)) * 1000).toFixed(1)}₽
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-all"
                  onClick={() => handleBuyTokensWithTerms(pkg.id)}
                >
                  Купить за {pkg.price}₽
                </motion.button>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-text-secondary">
              Токены не сгорают • Используйте когда удобно • Без подписки
            </p>
            <p className="text-xs text-text-secondary mt-4">
              Нажимая кнопки выше, вы соглашаетесь с{' '}
              <Link href="/terms" target="_blank" className="text-primary hover:underline">
                пользовательским соглашением
              </Link>
              {' '}и{' '}
              <Link href="/privacy" target="_blank" className="text-primary hover:underline">
                политикой конфиденциальности
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Features for Tokens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mb-16"
        >
          <h3 className="text-xl font-semibold text-text-primary text-center mb-8">
            Преимущества покупки токенов
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {tokenFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="flex items-start space-x-4 p-4 bg-background-secondary rounded-lg border border-border"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="text-primary">
                    {feature.icon}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        */}

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <h3 className="text-xl font-semibold text-text-primary text-center mb-8">
            Часто задаваемые вопросы
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-background-secondary rounded-lg p-6 border border-border">
              <h4 className="font-semibold text-text-primary mb-2">
                Можно ли отменить подписку?
              </h4>
              <p className="text-sm text-text-secondary">
                Да, вы можете отменить подписку в любое время в настройках профиля.
              </p>
            </div>
            
            <div className="bg-background-secondary rounded-lg p-6 border border-border">
              <h4 className="font-semibold text-text-primary mb-2">
                Что такое токены?
              </h4>
              <p className="text-sm text-text-secondary">
                Токены - это единица измерения текста. Примерно 1 токен = 4 символа. Одно сообщение обычно занимает 50-200 токенов.
              </p>
            </div>
            
            <div className="bg-background-secondary rounded-lg p-6 border border-border">
              <h4 className="font-semibold text-text-primary mb-2">
                Сгорают ли токены?
              </h4>
              <p className="text-sm text-text-secondary">
                Нет, токены не сгорают. Вы можете использовать их в любое время, пока они не закончатся.
              </p>
            </div>
            
            <div className="bg-background-secondary rounded-lg p-6 border border-border">
              <h4 className="font-semibold text-text-primary mb-2">
                Какие способы оплаты?
              </h4>
              <p className="text-sm text-text-secondary">
                Банковские карты, СБП, электронные кошельки и другие популярные методы через YooKassa.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Terms Modal */}
      {/* Removed as per edit hint */}
    </div>
  )
}
