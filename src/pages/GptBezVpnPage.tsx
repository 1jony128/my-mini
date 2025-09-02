import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, Zap, Globe, CheckCircle, Star } from 'lucide-react'
import { useMeta } from '@/hooks/useMeta'

export default function GptBezVpnPage() {
  // SEO мета-теги для SEO страницы
  useMeta({
    title: "GPT без VPN: Полное руководство - ChatAI PRO",
    description: "Узнайте, как получить доступ к GPT-4 и другим ИИ моделям без использования VPN. Полный гайд по Чат GPT без впн.",
    keywords: "чат гпт без впн, gpt 4 без vpn, как использовать gpt без впн, chatgpt без впн россия, доступ к gpt-4 без vpn, бесплатный чат gpt",
    ogTitle: "GPT без VPN: Полное руководство - ChatAI PRO",
    ogDescription: "Узнайте, как получить доступ к GPT-4 и другим ИИ моделям без VPN.",
    ogUrl: "https://aichat-pro.ru/gpt-bez-vpn"
  })
  const navigate = useNavigate()

  const features = [
    {
      icon: Shield,
      title: 'Безопасность',
      description: 'Все данные шифруются и защищены по стандартам банковского уровня'
    },
    {
      icon: Zap,
      title: 'Скорость',
      description: 'Быстрые ответы без задержек благодаря оптимизированной архитектуре'
    },
    {
      icon: Globe,
      title: 'Доступность',
      description: 'Работает из любой точки мира без необходимости VPN'
    },
    {
      icon: Star,
      title: 'Качество',
      description: 'Доступ к самым современным ИИ моделям с высоким качеством ответов'
    }
  ]

  const models = [
    {
      name: 'GPT-4',
      provider: 'OpenAI',
      description: 'Самая мощная языковая модель от OpenAI',
      features: ['Креативность', 'Анализ', 'Программирование']
    },
    {
      name: 'Claude 3',
      provider: 'Anthropic',
      description: 'Безопасная и этичная модель от Anthropic',
      features: ['Безопасность', 'Этика', 'Анализ текста']
    },
    {
      name: 'DeepSeek',
      provider: 'DeepSeek',
      description: 'Мощная модель для программирования и анализа',
      features: ['Программирование', 'Математика', 'Логика']
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border bg-background">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors text-text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">GPT без VPN</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-text-primary mb-6">
            Доступ к GPT-4 без VPN
          </h2>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Общайтесь с самыми мощными ИИ моделями без необходимости использования VPN. 
            Быстро, безопасно и удобно.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors text-lg"
          >
            Начать бесплатно
          </button>
        </div>
      </div>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-text-primary text-center mb-12">
            Почему выбирают нас
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-text-primary mb-2">
                  {feature.title}
                </h4>
                <p className="text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Models */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-text-primary text-center mb-12">
            Доступные модели
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {models.map((model, index) => (
              <div key={index} className="bg-background rounded-xl border border-border p-6">
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-text-primary mb-1">
                    {model.name}
                  </h4>
                  <p className="text-primary font-medium">
                    {model.provider}
                  </p>
                </div>
                
                <p className="text-text-secondary mb-4">
                  {model.description}
                </p>
                
                <div className="space-y-2">
                  {model.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm text-text-secondary">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-text-primary text-center mb-12">
            Как это работает
          </h3>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="text-xl font-semibold text-text-primary mb-2">
                  Регистрация
                </h4>
                <p className="text-text-secondary">
                  Создайте аккаунт за несколько секунд. Никаких сложных настроек не требуется.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-6">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="text-xl font-semibold text-text-primary mb-2">
                  Выбор модели
                </h4>
                <p className="text-text-secondary">
                  Выберите подходящую ИИ модель из нашего каталога. Каждая модель имеет свои особенности.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-6">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="text-xl font-semibold text-text-primary mb-2">
                  Начать общение
                </h4>
                <p className="text-text-secondary">
                  Отправляйте сообщения и получайте мгновенные ответы от ИИ. Все работает без VPN.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-text-primary mb-4">
            Готовы начать?
          </h3>
          <p className="text-xl text-text-secondary mb-8">
            Присоединяйтесь к тысячам пользователей, которые уже общаются с ИИ без VPN
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
            >
              Создать аккаунт
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-background border border-border text-text-primary rounded-xl font-semibold hover:bg-muted transition-colors"
            >
              Войти в аккаунт
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
