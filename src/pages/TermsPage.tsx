import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Scale, AlertTriangle, Users } from 'lucide-react'
import { useMeta } from '@/hooks/useMeta'

export default function TermsPage() {
  // SEO мета-теги для страницы условий использования
  useMeta({
    title: "Условия использования - ChatAI PRO | Правила сервиса",
    description: "Условия использования сервиса ChatAI PRO. Правила и ограничения при работе с ИИ-моделями GPT-4, Claude, DeepSeek.",
    keywords: "условия использования, правила chatai pro, ограничения ии чат, terms of service gpt-4",
    ogTitle: "Условия использования - ChatAI PRO",
    ogDescription: "Правила и ограничения при работе с ИИ-моделями GPT-4, Claude, DeepSeek.",
    ogUrl: "https://aichat-pro.ru/terms"
  })
  const navigate = useNavigate()

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
            <Link to="/" className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors">
              <FileText className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-xl font-bold text-text-primary">Условия использования</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Introduction */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Условия использования
          </h2>
          <p className="text-text-secondary mb-4">
            Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
          </p>
          <p className="text-text-secondary">
            Используя наш сервис, вы соглашаетесь с этими условиями использования. 
            Пожалуйста, внимательно прочитайте их перед использованием.
          </p>
        </div>

        {/* Service Description */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-text-primary">Описание сервиса</h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-text-secondary">
              Мы предоставляем платформу для общения с искусственным интеллектом, 
              включая доступ к различным ИИ моделям через веб-интерфейс.
            </p>
            
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Основные функции</h4>
              <ul className="list-disc list-inside space-y-1 text-text-secondary">
                <li>Чат с различными ИИ моделями</li>
                <li>Сохранение истории разговоров</li>
                <li>Экспорт чатов</li>
                <li>Настройка параметров моделей</li>
              </ul>
            </div>
          </div>
        </div>

        {/* User Responsibilities */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-text-primary">Обязанности пользователя</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Запрещено</h4>
              <ul className="list-disc list-inside space-y-1 text-text-secondary">
                <li>Использование сервиса для незаконной деятельности</li>
                <li>Нарушение прав интеллектуальной собственности</li>
                <li>Попытки взлома или нарушения безопасности</li>
                <li>Спам или массовая рассылка</li>
                <li>Создание контента, нарушающего права других</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Ответственность</h4>
              <p className="text-text-secondary">
                Пользователь несет полную ответственность за контент, который он создает 
                и отправляет через наш сервис.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <Scale className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-text-primary">Условия оплаты</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Подписки</h4>
              <ul className="list-disc list-inside space-y-1 text-text-secondary">
                <li>Подписки автоматически продлеваются</li>
                <li>Отмена возможна в любое время</li>
                <li>Возврат средств в течение 7 дней</li>
                <li>Цены могут изменяться с уведомлением</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Бесплатный план</h4>
              <p className="text-text-secondary">
                Бесплатный план имеет ограничения на количество чатов и сообщений. 
                Для снятия ограничений требуется подписка PRO.
              </p>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Интеллектуальная собственность</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Наши права</h4>
              <p className="text-text-secondary">
                Мы сохраняем все права на наш сервис, включая дизайн, код и контент. 
                Пользователи не могут копировать или воспроизводить наши материалы.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Ваши права</h4>
              <p className="text-text-secondary">
                Контент, созданный вами с помощью ИИ, принадлежит вам. 
                Однако мы не гарантируем уникальность или авторские права на такой контент.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy and Data */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Конфиденциальность и данные</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Обработка данных</h4>
              <p className="text-text-secondary">
                Мы обрабатываем ваши данные в соответствии с нашей политикой конфиденциальности. 
                Используя сервис, вы соглашаетесь с такой обработкой.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Безопасность</h4>
              <p className="text-text-secondary">
                Мы принимаем разумные меры для защиты ваших данных, но не можем гарантировать 
                абсолютную безопасность в интернете.
              </p>
            </div>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Ограничение ответственности</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Отказ от гарантий</h4>
              <p className="text-text-secondary">
                Сервис предоставляется "как есть" без каких-либо гарантий. 
                Мы не гарантируем бесперебойную работу или точность ответов ИИ.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Ограничение ущерба</h4>
              <p className="text-text-secondary">
                Наша ответственность ограничена суммой, уплаченной за подписку в течение 
                последних 12 месяцев.
              </p>
            </div>
          </div>
        </div>

        {/* Termination */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Прекращение использования</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Ваше право</h4>
              <p className="text-text-secondary">
                Вы можете прекратить использование сервиса в любое время, 
                удалив свой аккаунт или отменив подписку.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Наше право</h4>
              <p className="text-text-secondary">
                Мы можем приостановить или прекратить доступ к сервису в случае 
                нарушения условий использования.
              </p>
            </div>
          </div>
        </div>

        {/* Changes to Terms */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Изменения условий</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Уведомления</h4>
              <p className="text-text-secondary">
                Мы можем изменять эти условия с уведомлением пользователей. 
                Продолжение использования означает согласие с новыми условиями.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Значительные изменения</h4>
              <p className="text-text-secondary">
                При значительных изменениях мы уведомим вас по email 
                и предоставим возможность отменить подписку.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Контакты</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Вопросы о условиях</h4>
              <p className="text-text-secondary">
                Если у вас есть вопросы об этих условиях использования, 
                свяжитесь с нами:
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-text-secondary">
                <strong>Email:</strong> legal@example.com
              </p>
              <p className="text-text-secondary">
                <strong>Адрес:</strong> Россия, Москва
              </p>
              <p className="text-text-secondary">
                <strong>ИП:</strong> Шевцов Евгений Сергеевич
              </p>
              <p className="text-text-secondary">
                <strong>ИНН:</strong> 281304128917
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
