'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Scale, Users, Shield } from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background-secondary border-b border-border"
      >
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-background hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-text-primary" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="bg-primary rounded-lg flex items-center justify-center w-8 h-8">
                <FileText className="text-white w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary">Пользовательское соглашение</h1>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {/* Introduction */}
          <div className="bg-background-secondary rounded-xl p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">Общие положения</h2>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Настоящее Пользовательское соглашение регулирует использование сервиса AI Chat Pro. 
              Используя наш сервис, вы соглашаетесь с условиями данного соглашения. Если вы не согласны 
              с какими-либо условиями, пожалуйста, не используйте наш сервис.
            </p>
          </div>

          {/* Service Description */}
          <div className="bg-background-secondary rounded-xl p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">Описание сервиса</h2>
            </div>
            <div className="space-y-4 text-text-secondary">
              <p>AI Chat Pro предоставляет:</p>
              <ul className="space-y-2 ml-4">
                <li>• Доступ к различным AI моделям для генерации текста</li>
                <li>• Возможность ведения диалогов с AI</li>
                <li>• Сохранение истории чатов</li>
                <li>• Различные планы подписки с разными лимитами</li>
                <li>• API для интеграции с другими сервисами</li>
              </ul>
            </div>
          </div>

          {/* User Responsibilities */}
          <div className="bg-background-secondary rounded-xl p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">Обязанности пользователя</h2>
            </div>
            <div className="space-y-4 text-text-secondary">
              <p>При использовании сервиса вы обязуетесь:</p>
              <ul className="space-y-2 ml-4">
                <li>• Предоставлять достоверную информацию при регистрации</li>
                <li>• Не использовать сервис для незаконной деятельности</li>
                <li>• Не нарушать права интеллектуальной собственности</li>
                <li>• Не пытаться взломать или нарушить работу сервиса</li>
                <li>• Не передавать доступ к аккаунту третьим лицам</li>
                <li>• Соблюдать дневные лимиты использования</li>
              </ul>
            </div>
          </div>

          {/* Prohibited Uses */}
          <div className="bg-background-secondary rounded-xl p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-error" />
              <h2 className="text-xl font-semibold text-text-primary">Запрещенное использование</h2>
            </div>
            <div className="space-y-4 text-text-secondary">
              <p>Запрещается использовать сервис для:</p>
              <ul className="space-y-2 ml-4">
                <li>• Создания вредоносного контента</li>
                <li>• Спама или массовой рассылки</li>
                <li>• Нарушения авторских прав</li>
                <li>• Создания контента, нарушающего законы</li>
                <li>• Попыток обойти лимиты или ограничения</li>
                <li>• Любой деятельности, которая может нанести вред другим пользователям</li>
              </ul>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="bg-background-secondary rounded-xl p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <Scale className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">Условия оплаты</h2>
            </div>
            <div className="space-y-4 text-text-secondary">
              <div>
                <h3 className="font-medium text-text-primary mb-2">Подписки:</h3>
                <ul className="space-y-2 ml-4">
                  <li>• Еженедельная подписка: 200 рублей</li>
                  <li>• Ежемесячная подписка: 500 рублей</li>
                  <li>• Годовая подписка: 5000 рублей</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-text-primary mb-2">Правила:</h3>
                <ul className="space-y-2 ml-4">
                  <li>• Подписки автоматически продлеваются</li>
                  <li>• Отмена возможна в любое время</li>
                  <li>• Возврат средств в течение 14 дней</li>
                  <li>• Цены могут изменяться с предварительным уведомлением</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="bg-background-secondary rounded-xl p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">Интеллектуальная собственность</h2>
            </div>
            <div className="space-y-4 text-text-secondary">
              <p>В отношении интеллектуальной собственности:</p>
              <ul className="space-y-2 ml-4">
                <li>• Сервис и его компоненты принадлежат AI Chat Pro</li>
                <li>• Контент, созданный AI, принадлежит пользователю</li>
                <li>• Пользователь сохраняет права на свой контент</li>
                <li>• Запрещается копирование или воспроизведение сервиса</li>
              </ul>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="bg-background-secondary rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Ограничение ответственности</h2>
            <div className="space-y-4 text-text-secondary">
              <p>AI Chat Pro не несет ответственности за:</p>
              <ul className="space-y-2 ml-4">
                <li>• Контент, созданный AI моделями</li>
                <li>• Потерю данных или прерывание сервиса</li>
                <li>• Косвенные убытки или упущенную выгоду</li>
                <li>• Действия третьих лиц или провайдеров AI</li>
                <li>• Использование сервиса не по назначению</li>
              </ul>
            </div>
          </div>

          {/* Termination */}
          <div className="bg-background-secondary rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Прекращение использования</h2>
            <div className="space-y-4 text-text-secondary">
              <p>Мы можем приостановить или прекратить доступ к сервису:</p>
              <ul className="space-y-2 ml-4">
                <li>• При нарушении условий соглашения</li>
                <li>• При неоплате подписки</li>
                <li>• По техническим причинам</li>
                <li>• По требованию закона</li>
              </ul>
              <p className="mt-4">
                Пользователь может удалить аккаунт в любое время через настройки профиля.
              </p>
            </div>
          </div>

          {/* Changes to Terms */}
          <div className="bg-background-secondary rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Изменение условий</h2>
            <p className="text-text-secondary">
              Мы оставляем за собой право изменять данное соглашение. Пользователи будут уведомлены 
              об изменениях по email или через уведомления в сервисе. Продолжение использования 
              сервиса после изменений означает согласие с новыми условиями.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-background-secondary rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Контакты</h2>
            <p className="text-text-secondary">
              По вопросам, связанным с данным соглашением, обращайтесь:
            </p>
            <div className="mt-4 space-y-2 text-text-secondary">
                              <p>Email: esevcov097@gmail.com</p>
              <p>Дата последнего обновления: 26 августа 2025</p>
            </div>
          </div>

          {/* Back Button */}
          <div className="flex justify-center pt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
            >
              Вернуться назад
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
