# Multi-Model AI Chat

Веб-приложение для общения с различными моделями искусственного интеллекта в одном интерфейсе. Поддерживает GPT-4, Claude, Grok и другие модели с системой токенов и подписок.

## 🚀 Возможности

- **Множественные модели ИИ**: GPT-3.5, GPT-4, Claude 3 Haiku, Claude 3 Sonnet
- **Система токенов**: Бесплатные и платные пакеты токенов
- **Pro подписка**: Неограниченный доступ ко всем моделям
- **Потоковая генерация**: Ответы появляются в реальном времени
- **Интеграция с YooKassa**: Безопасные платежи
- **Аутентификация**: Supabase Auth с поддержкой Google OAuth
- **Адаптивный дизайн**: Работает на всех устройствах

## 🛠 Технологический стек

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Платежи**: YooKassa
- **AI Models**: OpenAI, Anthropic
- **UI**: Lucide React, React Markdown

## 📋 Требования

- Node.js 18+
- npm или yarn
- Supabase аккаунт
- YooKassa аккаунт
- API ключи для моделей ИИ

## 🔧 Установка и настройка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd multi-model-ai-chat
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка переменных окружения

Скопируйте файл `env.example` в `.env.local`:

```bash
cp env.example .env.local
```

Заполните переменные окружения:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# AI Models API Keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GROK_API_KEY=your_grok_api_key_here

# YooKassa
YOOKASSA_SHOP_ID=your_yookassa_shop_id_here
YOOKASSA_SECRET_KEY=your_yookassa_secret_key_here
YOOKASSA_WEBHOOK_SECRET=your_yookassa_webhook_secret_here

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Настройка Supabase

1. Создайте новый проект в [Supabase](https://supabase.com)
2. Перейдите в SQL Editor
3. Выполните SQL скрипт из файла `supabase-schema.sql`
4. Скопируйте URL и ключи из Settings > API

### 5. Настройка YooKassa

1. Зарегистрируйтесь в [YooKassa](https://yookassa.ru)
2. Получите Shop ID и Secret Key
3. Настройте webhook URL: `https://your-domain.com/api/payments/webhook`
4. Установите секретный ключ для webhook

### 6. Настройка API ключей

- **OpenAI**: Получите ключ на [platform.openai.com](https://platform.openai.com)
- **Anthropic**: Получите ключ на [console.anthropic.com](https://console.anthropic.com)

## 🚀 Запуск

### Разработка

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)

### Продакшн

```bash
npm run build
npm start
```

### Деплой на Vercel

1. Подключите репозиторий к Vercel
2. Добавьте переменные окружения в настройках проекта
3. Деплой произойдет автоматически

## 📊 Структура проекта

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API роуты
│   ├── auth/              # Страницы аутентификации
│   ├── chat/              # Страницы чата
│   ├── dashboard/         # Dashboard
│   └── profile/           # Профиль пользователя
├── components/            # React компоненты
│   ├── providers/         # Провайдеры контекста
│   └── ui/               # UI компоненты
├── lib/                  # Утилиты и конфигурации
└── types/                # TypeScript типы
```

## 🔐 Безопасность

- Row Level Security (RLS) в Supabase
- Валидация webhook подписей
- Защищенные API роуты
- Хранение секретов в переменных окружения

## 💳 Система платежей

### Токены
- 1,000 токенов - 99 ₽
- 5,000 токенов - 399 ₽
- 10,000 токенов - 699 ₽

### Pro подписка
- Месячная - 999 ₽/месяц
- Годовая - 9,999 ₽/год

## 🤝 Поддержка

При возникновении проблем:

1. Проверьте логи в консоли браузера
2. Убедитесь, что все переменные окружения настроены
3. Проверьте подключение к Supabase
4. Убедитесь, что API ключи действительны

## 📝 Лицензия

MIT License

## 🔄 Обновления

Для обновления приложения:

```bash
git pull origin main
npm install
npm run build
```

## 🧪 Тестирование

```bash
# Запуск линтера
npm run lint

# Проверка типов TypeScript
npx tsc --noEmit
```

## 📈 Мониторинг

- Логи приложения в Vercel Dashboard
- Мониторинг Supabase в панели управления
- Логи YooKassa в личном кабинете

## 🚀 Готовность к продакшену

Приложение готово к запуску в продакшене после:

1. ✅ Настройки всех переменных окружения
2. ✅ Выполнения SQL скрипта в Supabase
3. ✅ Настройки YooKassa webhook
4. ✅ Деплоя на Vercel или другом хостинге

После этого пользователи смогут:
- Регистрироваться и входить в систему
- Создавать чаты с ИИ
- Выбирать модели для общения
- Покупать токены и подписки
- Экспортировать историю чатов
