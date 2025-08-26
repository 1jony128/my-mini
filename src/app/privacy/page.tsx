'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Lock, Eye, Database, Users, FileText } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPage() {
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
                <Shield className="text-white w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary">Политика конфиденциальности</h1>
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
              <Lock className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">Общие положения</h2>
            </div>
            <p className="text-text-secondary leading-relaxed">
              Настоящая Политика конфиденциальности описывает, как AI Chat Pro собирает, использует и защищает 
              вашу личную информацию при использовании нашего сервиса. Мы стремимся обеспечить максимальную 
              защиту ваших данных и прозрачность в их обработке.
            </p>
          </div>

          {/* Data Collection */}
          <div className="bg-background-secondary rounded-xl p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">Сбор данных</h2>
            </div>
            <div className="space-y-4 text-text-secondary">
              <div>
                <h3 className="font-medium text-text-primary mb-2">Данные, которые мы собираем:</h3>
                <ul className="space-y-2 ml-4">
                  <li>• Информация для регистрации (email, имя пользователя)</li>
                  <li>• Сообщения в чате с AI</li>
                  <li>• Данные об использовании сервиса (количество запросов, токены)</li>
                  <li>• Техническая информация (IP-адрес, тип браузера)</li>
                  <li>• Информация о платежах (через YooKassa)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Usage */}
          <div className="bg-background-secondary rounded-xl p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">Использование данных</h2>
            </div>
            <div className="space-y-4 text-text-secondary">
              <p>Мы используем собранные данные для:</p>
              <ul className="space-y-2 ml-4">
                <li>• Предоставления и улучшения сервиса AI Chat</li>
                <li>• Обработки платежей и управления подписками</li>
                <li>• Обеспечения безопасности аккаунта</li>
                <li>• Анализа использования для улучшения функциональности</li>
                <li>• Соблюдения юридических обязательств</li>
              </ul>
            </div>
          </div>

          {/* Data Protection */}
          <div className="bg-background-secondary rounded-xl p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">Защита данных</h2>
            </div>
            <div className="space-y-4 text-text-secondary">
              <p>Мы принимаем следующие меры для защиты ваших данных:</p>
              <ul className="space-y-2 ml-4">
                <li>• Шифрование данных при передаче (HTTPS/TLS)</li>
                <li>• Безопасное хранение в Supabase с RLS</li>
                <li>• Регулярные обновления безопасности</li>
                <li>• Ограниченный доступ к данным только для авторизованного персонала</li>
                <li>• Мониторинг безопасности 24/7</li>
              </ul>
            </div>
          </div>

          {/* Data Sharing */}
          <div className="bg-background-secondary rounded-xl p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">Передача данных</h2>
            </div>
            <div className="space-y-4 text-text-secondary">
              <p>Мы не продаем, не обмениваем и не передаем ваши личные данные третьим лицам, за исключением:</p>
              <ul className="space-y-2 ml-4">
                <li>• Провайдеров AI моделей (OpenRouter, OpenAI) для обработки запросов</li>
                <li>• Платежных систем (YooKassa) для обработки платежей</li>
                <li>• По требованию закона или для защиты наших прав</li>
                <li>• С вашего явного согласия</li>
              </ul>
            </div>
          </div>

          {/* User Rights */}
          <div className="bg-background-secondary rounded-xl p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">Ваши права</h2>
            </div>
            <div className="space-y-4 text-text-secondary">
              <p>Вы имеете право:</p>
              <ul className="space-y-2 ml-4">
                <li>• Получить доступ к своим данным</li>
                <li>• Исправить неточные данные</li>
                <li>• Удалить свой аккаунт и данные</li>
                <li>• Ограничить обработку данных</li>
                <li>• Перенести данные в другой сервис</li>
                <li>• Отозвать согласие на обработку</li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-background-secondary rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Контакты</h2>
            <p className="text-text-secondary">
              Если у вас есть вопросы о нашей Политике конфиденциальности, свяжитесь с нами:
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
