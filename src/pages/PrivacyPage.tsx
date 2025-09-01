import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, Lock, Eye, Database } from 'lucide-react'

export default function PrivacyPage() {
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
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">Политика конфиденциальности</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Introduction */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Политика конфиденциальности
          </h2>
          <p className="text-text-secondary mb-4">
            Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
          </p>
          <p className="text-text-secondary">
            Мы серьезно относимся к защите вашей конфиденциальности. Эта политика описывает, 
            как мы собираем, используем и защищаем вашу личную информацию.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-text-primary">Информация, которую мы собираем</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Личная информация</h4>
              <ul className="list-disc list-inside space-y-1 text-text-secondary">
                <li>Email адрес (для регистрации и входа)</li>
                <li>Имя пользователя (опционально)</li>
                <li>IP адрес (для безопасности)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Данные использования</h4>
              <ul className="list-disc list-inside space-y-1 text-text-secondary">
                <li>История чатов и сообщений</li>
                <li>Настройки пользователя</li>
                <li>Статистика использования</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Information */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <Eye className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-text-primary">Как мы используем информацию</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Основные цели</h4>
              <ul className="list-disc list-inside space-y-1 text-text-secondary">
                <li>Предоставление услуг чата с ИИ</li>
                <li>Улучшение качества сервиса</li>
                <li>Обеспечение безопасности аккаунта</li>
                <li>Техническая поддержка</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Аналитика</h4>
              <p className="text-text-secondary">
                Мы используем агрегированные данные для анализа производительности и улучшения сервиса. 
                Эти данные не содержат личной информации.
              </p>
            </div>
          </div>
        </div>

        {/* Data Protection */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-text-primary">Защита данных</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Меры безопасности</h4>
              <ul className="list-disc list-inside space-y-1 text-text-secondary">
                <li>Шифрование данных в состоянии покоя и при передаче</li>
                <li>Регулярные проверки безопасности</li>
                <li>Ограниченный доступ к персональным данным</li>
                <li>Резервное копирование данных</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Хранение данных</h4>
              <p className="text-text-secondary">
                Ваши данные хранятся на защищенных серверах в соответствии с международными стандартами безопасности.
              </p>
            </div>
          </div>
        </div>

        {/* Data Sharing */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Передача данных</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Мы не продаем ваши данные</h4>
              <p className="text-text-secondary">
                Мы не продаем, не сдаем в аренду и не передаем вашу личную информацию третьим лицам 
                для коммерческих целей.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Исключения</h4>
              <ul className="list-disc list-inside space-y-1 text-text-secondary">
                <li>По требованию закона</li>
                <li>Для защиты наших прав и безопасности</li>
                <li>С вашего явного согласия</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Your Rights */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Ваши права</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Права пользователя</h4>
              <ul className="list-disc list-inside space-y-1 text-text-secondary">
                <li>Право на доступ к вашим данным</li>
                <li>Право на исправление неточных данных</li>
                <li>Право на удаление данных</li>
                <li>Право на ограничение обработки</li>
                <li>Право на переносимость данных</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Как реализовать права</h4>
              <p className="text-text-secondary">
                Для реализации ваших прав обратитесь к нам через настройки профиля или 
                напишите на support@example.com
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-background-secondary rounded-xl p-6 border border-border">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Контакты</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">Вопросы о конфиденциальности</h4>
              <p className="text-text-secondary">
                Если у вас есть вопросы о нашей политике конфиденциальности, 
                свяжитесь с нами:
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-text-secondary">
                <strong>Email:</strong> privacy@example.com
              </p>
              <p className="text-text-secondary">
                <strong>Адрес:</strong> Россия, Москва
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
