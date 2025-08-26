# Инструкции по деплою Multi-Model AI Chat

## 🚀 Быстрый старт

### 1. Подготовка к деплою

1. **Создайте аккаунт Supabase**
   - Перейдите на [supabase.com](https://supabase.com)
   - Создайте новый проект
   - Скопируйте URL и ключи из Settings > API

2. **Настройте YooKassa**
   - Зарегистрируйтесь на [yookassa.ru](https://yookassa.ru)
   - Получите Shop ID и Secret Key
   - Настройте webhook URL

3. **Получите API ключи**
   - OpenAI: [platform.openai.com](https://platform.openai.com)
   - Anthropic: [console.anthropic.com](https://console.anthropic.com)

### 2. Деплой на Vercel

1. **Подключите репозиторий**
   ```bash
   # Клонируйте репозиторий
   git clone <your-repo-url>
   cd multi-model-ai-chat
   
   # Подключите к Vercel
   npx vercel
   ```

2. **Настройте переменные окружения в Vercel**
   - Перейдите в Dashboard проекта
   - Settings > Environment Variables
   - Добавьте все переменные из `env.example`

3. **Выполните SQL скрипт в Supabase**
   - Откройте SQL Editor в Supabase
   - Выполните содержимое `supabase-schema.sql`

4. **Настройте webhook YooKassa**
   - URL: `https://your-domain.vercel.app/api/payments/webhook`
   - Секретный ключ: сгенерируйте и сохраните

### 3. Проверка работоспособности

1. **Тест аутентификации**
   - Зарегистрируйтесь на сайте
   - Проверьте вход/выход

2. **Тест чата**
   - Создайте новый чат
   - Отправьте сообщение
   - Проверьте ответ ИИ

3. **Тест платежей**
   - Попробуйте купить токены
   - Проверьте webhook

## 🔧 Настройка в продакшене

### Supabase настройки

```sql
-- Включите RLS для всех таблиц
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Настройте политики доступа
-- (уже включены в supabase-schema.sql)
```

### YooKassa настройки

1. **Webhook URL**: `https://your-domain.com/api/payments/webhook`
2. **Секретный ключ**: сгенерируйте и сохраните в переменных окружения
3. **Тестовый режим**: включите для тестирования

### Мониторинг

1. **Vercel Analytics**: включите в настройках проекта
2. **Supabase Logs**: мониторьте в панели управления
3. **YooKassa Logs**: проверяйте в личном кабинете

## 🛠 Локальная разработка

```bash
# Установка зависимостей
npm install

# Создание .env.local
cp env.example .env.local
# Заполните переменные

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build
npm start
```

## 🔒 Безопасность

### Проверьте настройки безопасности

1. **Supabase RLS**: убедитесь, что включен
2. **Webhook подписи**: проверьте валидацию
3. **API ключи**: храните в переменных окружения
4. **HTTPS**: обязателен для продакшена

### Мониторинг безопасности

- Регулярно проверяйте логи
- Мониторьте подозрительную активность
- Обновляйте зависимости

## 📊 Аналитика

### Google Analytics

Добавьте в `src/app/layout.tsx`:

```tsx
import Script from 'next/script'

// В компоненте
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `}
</Script>
```

## 🚨 Устранение неполадок

### Частые проблемы

1. **Ошибка аутентификации**
   - Проверьте Supabase ключи
   - Убедитесь, что RLS настроен

2. **Ошибка платежей**
   - Проверьте YooKassa настройки
   - Убедитесь, что webhook работает

3. **Ошибка ИИ**
   - Проверьте API ключи
   - Убедитесь в достаточности баланса

### Логи и отладка

```bash
# Локальные логи
npm run dev

# Vercel логи
vercel logs

# Supabase логи
# В панели управления Supabase
```

## 📈 Масштабирование

### Оптимизация производительности

1. **Кэширование**: используйте Redis для кэша
2. **CDN**: настройте для статических файлов
3. **База данных**: мониторьте производительность запросов

### Мониторинг ресурсов

- Vercel: следите за лимитами
- Supabase: мониторьте использование
- YooKassa: проверяйте лимиты API

## 🎯 Готовность к запуску

Проверьте список:

- [ ] Все переменные окружения настроены
- [ ] SQL скрипт выполнен в Supabase
- [ ] YooKassa webhook настроен
- [ ] API ключи действительны
- [ ] Тесты пройдены
- [ ] Мониторинг настроен
- [ ] Документация готова

После выполнения всех пунктов приложение готово к использованию!
