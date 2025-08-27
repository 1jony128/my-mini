# ChatAIPRO

Современное веб-приложение для общения с искусственным интеллектом, поддерживающее множество AI моделей.

## 🚀 Возможности

- **Множественные AI модели**: GPT-4, Claude, GPT-4o и другие
- **Стриминг ответов**: Мгновенное отображение ответов AI
- **Система подписок**: PRO планы с расширенными возможностями
- **Дневные лимиты**: Контроль использования для бесплатных и платных пользователей
- **Адаптивный дизайн**: Работает на всех устройствах
- **Безопасность**: Аутентификация через Supabase
- **Платежи**: Интеграция с YooKassa

## 🛠 Технологии

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **AI**: OpenAI API, Anthropic API, OpenRouter API
- **Платежи**: YooKassa API
- **Анимации**: Framer Motion

## 📦 Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/1jony128/my-mini.git
cd my-mini
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env.local` и добавьте переменные окружения:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENROUTER_API_KEY=your_openrouter_key
YOOKASSA_SHOP_ID=your_yookassa_shop_id
YOOKASSA_SECRET_KEY=your_yookassa_secret_key
```

4. Запустите проект:
```bash
npm run dev
```

## 🗄 База данных

Проект использует Supabase. Выполните SQL скрипты из папки `supabase/migrations/` для настройки схемы базы данных.

## 📱 Функции

### Для пользователей:
- Регистрация и авторизация
- Общение с AI моделями
- История чатов
- Настройки профиля
- Покупка PRO подписки

### Для администраторов:
- Мониторинг использования
- Управление лимитами
- Аналитика платежей

## 🔧 Разработка

```bash
# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшн версии
npm start

# Линтинг
npm run lint
```

## 📚 Документация

### 📋 Основная документация
- [CHANGELOG.md](./CHANGELOG.md) - Журнал изменений и обновлений
- [TECHNICAL_CHANGES.md](./TECHNICAL_CHANGES.md) - Техническая документация изменений
- [CHANGES_TRACKING.md](./CHANGES_TRACKING.md) - Система отслеживания изменений

### 🔧 Техническая документация
- [PRO_CREDITS_SYSTEM.md](./PRO_CREDITS_SYSTEM.md) - Система PRO кредитов
- [PAYMENT_SETUP.md](./PAYMENT_SETUP.md) - Настройка платежей
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Руководство по развертыванию
- [TECHNICAL_REQUIREMENTS.md](./TECHNICAL_REQUIREMENTS.md) - Технические требования

### 📊 Последние изменения (19 декабря 2024)
- ✅ Исправлены все критические ошибки UI/UX
- ✅ Улучшена архитектура управления состоянием
- ✅ Переименование DeepSeek → GPT-4o
- ✅ Оптимизирована производительность
- ✅ Исправлены проблемы с SSR

## 📄 Лицензия

MIT License

## 👨‍💻 Автор

[1jony128](https://github.com/1jony128)

## 🔗 Ссылки

- [Демо](https://your-demo-url.com)
- [Документация](https://your-docs-url.com)
- [Поддержка](mailto:esevcov097@gmail.com)
- [GitHub Issues](https://github.com/1jony128/my-mini/issues)
