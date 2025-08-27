import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, Bot, Zap, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Чат GPT без VPN | Бесплатный доступ к GPT-4 без VPN - ChatAIPRO',
  description: 'Чат GPT без VPN - бесплатный доступ к GPT-4, Claude, DeepSeek без необходимости VPN. Общайтесь с ИИ без ограничений и регистрации.',
  keywords: 'чат гпт без впн, gpt 4 без vpn, gpt 5 без впн, чат gpt без vpn, gpt-4 онлайн, ии чат бесплатно, claude без vpn, deepseek без впн, gpt онлайн, чат с ии без регистрации',
  openGraph: {
    title: 'Чат GPT без VPN | Бесплатный доступ к GPT-4 без VPN',
    description: 'Чат GPT без VPN - бесплатный доступ к GPT-4, Claude, DeepSeek без необходимости VPN. Общайтесь с ИИ без ограничений.',
    url: 'https://aichatpro.com/gpt-bez-vpn',
    siteName: 'ChatAIPRO',
    locale: 'ru_RU',
    type: 'website',
  },
}

export default function GptBezVpnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
      {/* Header */}
      <header className="relative z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary">ChatAIPRO</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/register"
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all font-medium"
              >
                Начать бесплатно
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-6">
              Чат GPT без{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                VPN
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-8 leading-relaxed">
              Бесплатный доступ к GPT-4, Claude, DeepSeek и другим ИИ моделям без необходимости VPN или прокси-серверов
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                href="/auth/register"
                className="group px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl transition-all font-semibold text-lg flex items-center space-x-2"
              >
                <span>Начать бесплатно</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/chat"
                className="px-8 py-4 border-2 border-border hover:border-primary text-text-primary hover:text-primary rounded-2xl transition-all font-semibold text-lg"
              >
                Попробовать сейчас
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Почему ChatAIPRO - лучший выбор?
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Полный доступ к ИИ моделям без ограничений и VPN
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-background p-8 rounded-2xl border border-border hover:border-primary transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                GPT-4 без VPN
              </h3>
              <p className="text-text-secondary">
                Полный доступ к GPT-4, Claude, DeepSeek и другим ИИ моделям без необходимости VPN или прокси-серверов.
              </p>
            </div>

            <div className="bg-background p-8 rounded-2xl border border-border hover:border-primary transition-all">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                Бесплатный старт
              </h3>
              <p className="text-text-secondary">
                Начните общение с ИИ бесплатно. Без скрытых платежей, без ограничений по времени использования.
              </p>
            </div>

            <div className="bg-background p-8 rounded-2xl border border-border hover:border-primary transition-all">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                Без регистрации
              </h3>
              <p className="text-text-secondary">
                Начните общение с ИИ сразу, без регистрации и подтверждения email. Просто и удобно.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">
              Чат GPT без VPN - Полное руководство
            </h2>
            
            <div className="prose prose-lg max-w-none text-text-secondary">
              <h3 className="text-2xl font-semibold text-text-primary mb-4">
                Что такое "Чат GPT без VPN"?
              </h3>
              <p className="mb-6">
                "Чат GPT без VPN" - это возможность общаться с искусственным интеллектом GPT-4 и другими ИИ моделями без необходимости использования VPN (Virtual Private Network) или прокси-серверов. ChatAIPRO предоставляет прямой доступ к лучшим ИИ моделям через веб-интерфейс.
              </p>

              <h3 className="text-2xl font-semibold text-text-primary mb-4">
                Преимущества ChatAIPRO
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Полный доступ к GPT-4</strong> - используйте GPT-4 без ограничений и VPN</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Множество ИИ моделей</strong> - GPT-4, Claude, DeepSeek, Grok и другие</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Бесплатный старт</strong> - начните общение без оплаты</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Быстрые ответы</strong> - потоковая передача текста в реальном времени</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Безопасность</strong> - ваши данные защищены и шифруются</span>
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-text-primary mb-4">
                Популярные запросы
              </h3>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-text-primary mb-2">GPT-4 без VPN</h4>
                  <p>Полный доступ к GPT-4 без необходимости использования VPN или прокси-серверов. Общайтесь с самой мощной ИИ моделью напрямую.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-text-primary mb-2">GPT-4 онлайн</h4>
                  <p>Общайтесь с GPT-4 в реальном времени через веб-интерфейс. Быстрые ответы и удобный интерфейс.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-text-primary mb-2">ИИ чат бесплатно</h4>
                  <p>Начните общение с искусственным интеллектом без оплаты. Бесплатный доступ к множеству ИИ моделей.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-text-primary mb-2">Claude без VPN</h4>
                  <p>Доступ к модели Claude от Anthropic без ограничений. Используйте Claude для сложных задач и анализа.</p>
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-text-primary mb-4">
                Как начать использовать ChatAIPRO?
              </h3>
              <ol className="space-y-3 mb-6">
                <li className="flex items-start space-x-2">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                  <span>Перейдите на главную страницу ChatAIPRO</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                  <span>Нажмите "Начать бесплатно" или "Попробовать сейчас"</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                  <span>Выберите ИИ модель (GPT-4, Claude, DeepSeek и др.)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                  <span>Начните общение с ИИ без VPN и ограничений</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-text-primary mb-6">
              Готовы начать общение с ИИ?
            </h2>
            <p className="text-xl text-text-secondary mb-8">
              Присоединяйтесь к тысячам пользователей, которые уже используют ChatAIPRO для общения с искусственным интеллектом
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                href="/auth/register"
                className="group px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl transition-all font-semibold text-lg flex items-center space-x-2"
              >
                <span>Начать бесплатно</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/chat"
                className="px-8 py-4 border-2 border-border hover:border-primary text-text-primary hover:text-primary rounded-2xl transition-all font-semibold text-lg"
              >
                Попробовать сейчас
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">ChatAIPRO</h3>
            </div>
            <p className="text-text-secondary mb-6">
              © 2025 ChatAIPRO. Чат GPT без VPN - лучший выбор для общения с ИИ.
            </p>
            <div className="flex items-center justify-center space-x-6">
              <Link href="/auth/login" className="text-text-secondary hover:text-primary transition-colors">
                Войти
              </Link>
              <Link href="/auth/register" className="text-text-secondary hover:text-primary transition-colors">
                Регистрация
              </Link>
              <Link href="/chat" className="text-text-secondary hover:text-primary transition-colors">
                Чат
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
