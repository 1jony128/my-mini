'use client'

import { motion } from 'framer-motion'
import { Sparkles, MessageCircle, Zap, Shield, Users, ArrowRight, Bot, Crown } from 'lucide-react'
import Link from 'next/link'
import { useSupabase } from '@/components/providers/supabase-provider'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const { user, loading } = useSupabase()
  const router = useRouter()

  // Отладочная информация (убираем для чистоты консоли)

  // Отладочная информация (убираем для чистоты)

  // Показываем загрузку пока проверяем состояние авторизации
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background-secondary to-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
      {/* Header */}
      <header className="relative z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary">ChatAIPRO</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/blog"
                className="px-6 py-2 text-text-primary hover:text-primary transition-colors"
              >
                Блог
              </Link>
              {user ? (
                <Link 
                  href="/chat"
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all font-medium"
                >
                  Перейти в чат
                </Link>
              ) : (
                <>
                  <Link 
                    href="/auth/login"
                    className="px-6 py-2 text-text-primary hover:text-primary transition-colors"
                  >
                    Войти
                  </Link>
                  <Link 
                    href="/auth/register"
                    className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all font-medium"
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-6">
                Чат GPT без{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  VPN
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-text-secondary mb-8 leading-relaxed">
                Бесплатный доступ к GPT-4, Claude, DeepSeek и другим ИИ моделям без VPN. Общайтесь с искусственным интеллектом без ограничений и регистрации.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                {user ? (
                  <Link 
                    href="/chat"
                    className="group px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl transition-all font-semibold text-lg flex items-center space-x-2"
                  >
                    <span>Перейти в чат</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <>
                    <Link 
                      href="/auth/register"
                      className="group px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl transition-all font-semibold text-lg flex items-center space-x-2"
                    >
                      <span>Начать бесплатно</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                      href="/auth/login"
                      className="px-8 py-4 border-2 border-border hover:border-primary text-text-primary hover:text-primary rounded-2xl transition-all font-semibold text-lg"
                    >
                      Уже есть аккаунт
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-40 right-20 w-32 h-32 bg-secondary/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              x: [0, 10, 0]
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 left-1/4 w-16 h-16 bg-primary/10 rounded-full blur-xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Чат GPT без VPN - Лучший выбор
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Бесплатный доступ к GPT-4, Claude и другим ИИ моделям без необходимости VPN
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-background p-8 rounded-2xl border border-border hover:border-primary transition-all"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                GPT-4 без VPN
              </h3>
              <p className="text-text-secondary">
                Полный доступ к GPT-4, Claude, DeepSeek и другим ИИ моделям без необходимости VPN или прокси.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-background p-8 rounded-2xl border border-border hover:border-primary transition-all"
            >
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                Бесплатный доступ
              </h3>
              <p className="text-text-secondary">
                Начните общение с ИИ бесплатно. Без скрытых платежей, без ограничений по времени использования.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-background p-8 rounded-2xl border border-border hover:border-primary transition-all"
            >
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                Без регистрации
              </h3>
              <p className="text-text-secondary">
                Начните общение с ИИ сразу, без регистрации и подтверждения email. Просто и удобно.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Простые тарифы
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Начните бесплатно и обновитесь, когда понадобится больше возможностей
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-background p-8 rounded-2xl border-2 border-border"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-text-primary mb-2">Starter</h3>
                <p className="text-text-secondary">Для начала работы</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span className="text-text-primary">Базовые модели</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span className="text-text-primary">Базовые модели ИИ</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span className="text-text-primary">Неограниченные чаты</span>
                </div>
              </div>

              <Link 
                href={user ? "/chat" : "/auth/register"}
                className="w-full block text-center px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all font-medium"
              >
                {user ? "Перейти в чат" : "Начать бесплатно"}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-background p-8 rounded-2xl border-2 border-primary relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <Crown className="w-4 h-4" />
                  <span>PRO</span>
                </div>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-text-primary mb-2">PRO</h3>
                <p className="text-text-secondary">Для профессионалов</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span className="text-text-primary">Безлимитные токены</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span className="text-text-primary">Все модели ИИ</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span className="text-text-primary">Приоритетная поддержка</span>
                </div>
              </div>

              <Link 
                href="/upgrade"
                className="w-full block text-center px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all font-medium"
              >
                Обновить до PRO
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEO Section */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">
              Чат GPT без VPN - Лучшая альтернатива
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">
                  Почему выбирают ChatAIPRO?
                </h3>
                <ul className="space-y-3 text-text-secondary">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Полный доступ к GPT-4 без VPN и прокси</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Бесплатный старт без регистрации</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Множество ИИ моделей: Claude, DeepSeek, Grok</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Быстрые ответы с потоковой передачей</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>Безопасность и конфиденциальность</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">
                  Популярные запросы
                </h3>
                <div className="space-y-3 text-text-secondary">
                  <p><strong>Чат GPT без VPN</strong> - наш сервис предоставляет полный доступ к GPT-4 без необходимости использования VPN или прокси-серверов.</p>
                  <p><strong>GPT-4 онлайн</strong> - общайтесь с GPT-4 в реальном времени через веб-интерфейс.</p>
                  <p><strong>ИИ чат бесплатно</strong> - начните общение с искусственным интеллектом без оплаты.</p>
                  <p><strong>Claude без VPN</strong> - доступ к модели Claude от Anthropic без ограничений.</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Начните общение с ИИ прямо сейчас
              </h3>
              <p className="text-text-secondary mb-6">
                Присоединяйтесь к тысячам пользователей, которые уже используют ChatAIPRO для общения с искусственным интеллектом
              </p>
              <Link 
                href={user ? "/chat" : "/auth/register"}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl transition-all font-semibold text-lg"
              >
                <span>{user ? "Перейти в чат" : "Начать бесплатно"}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background-secondary py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">ChatAIPRO</h3>
            </div>
            <p className="text-text-secondary mb-6">
              © 2025 ChatAIPRO. Все права защищены.
            </p>
            <div className="flex items-center justify-center space-x-6">
              <Link href="/" className="text-text-secondary hover:text-primary transition-colors">
                Главная
              </Link>
              <Link href="/blog" className="text-text-primary font-medium">
                Блог
              </Link>
              {user ? (
                <Link 
                  href="/chat"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Перейти в чат
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="text-text-secondary hover:text-primary transition-colors">
                    Войти
                  </Link>
                  <Link href="/auth/register" className="text-text-secondary hover:text-primary transition-colors">
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
