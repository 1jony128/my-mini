# Деплой на Timeweb Cloud с Docker (SSR)

## Обзор

Этот проект настроен для деплоя на Timeweb Cloud с использованием Docker, что обеспечивает полную поддержку SSR (Server-Side Rendering) и API роутов.

## Преимущества Docker деплоя

✅ **Полный функционал Next.js** - SSR, API роуты, динамические страницы  
✅ **Работающие API эндпоинты** - `/api/chat`, `/api/daily-limits`, и другие  
✅ **Серверный рендеринг** - оптимизация для SEO и производительности  
✅ **Масштабируемость** - легко масштабируется при росте нагрузки  

## Настройка для Timeweb Cloud

### 1. Подготовка проекта

Проект уже настроен для Docker деплоя:
- `Dockerfile` - конфигурация Docker образа
- `next.config.js` - настроен `output: 'standalone'`
- `docker-compose.yml` - для локального тестирования

### 2. Деплой на Timeweb Cloud

1. **Создайте новый проект** в Timeweb Cloud
2. **Выберите "Деплой из Dockerfile"**
3. **Подключите репозиторий** GitHub
4. **Настройте переменные окружения** (см. ниже)

### 3. Переменные окружения

Настройте в панели Timeweb Cloud:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Models
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# YooKassa
YOOKASSA_SHOP_ID=your-yookassa-shop-id
YOOKASSA_SECRET_KEY=your-yookassa-secret-key
YOOKASSA_WEBHOOK_SECRET=your-yookassa-webhook-secret

# App Settings
NEXT_PUBLIC_APP_URL=https://your-domain.timeweb.cloud
```

### 4. Настройки деплоя

- **Порт**: 3000
- **Команда сборки**: автоматически используется Dockerfile
- **Перезапуск**: автоматический при изменениях

## Локальное тестирование

### Сборка и запуск Docker образа

```bash
# Сборка образа
docker build -t chatai-app .

# Запуск контейнера
docker run -p 3000:3000 chatai-app
```

### Использование docker-compose

```bash
# Сборка и запуск
docker-compose up --build

# Только запуск
docker-compose up

# Остановка
docker-compose down
```

## Проверка работоспособности

После деплоя проверьте:

1. **Главная страница** - должна загружаться
2. **API роуты** - `/api/chat`, `/api/daily-limits`
3. **Аутентификация** - регистрация/вход
4. **Чат с ИИ** - отправка сообщений
5. **Платежи** - создание и обработка платежей

## Мониторинг

### Логи приложения

Проверяйте логи в панели Timeweb Cloud:
- Ошибки сборки
- Ошибки runtime
- Производительность

### Переменные окружения

Убедитесь, что все переменные окружения настроены корректно:
- Supabase подключение
- API ключи ИИ моделей
- Настройки YooKassa

## Устранение неполадок

### Частые проблемы

1. **Ошибка сборки**
   - Проверьте Dockerfile
   - Убедитесь в корректности next.config.js

2. **Ошибка подключения к базе данных**
   - Проверьте Supabase переменные
   - Убедитесь в доступности базы данных

3. **Ошибка API роутов**
   - Проверьте переменные окружения
   - Убедитесь в корректности API ключей

### Команды для отладки

```bash
# Проверка логов контейнера
docker logs <container-id>

# Вход в контейнер
docker exec -it <container-id> /bin/sh

# Проверка переменных окружения
docker exec <container-id> env
```

## Рекомендации

1. **Используйте HTTPS** - настройте SSL сертификаты
2. **Настройте домен** - подключите собственный домен
3. **Мониторьте ресурсы** - следите за использованием CPU и памяти
4. **Регулярно обновляйте** - обновляйте зависимости и образы

## Готовность к продакшену

Перед запуском в продакшен убедитесь:

- [ ] Все переменные окружения настроены
- [ ] База данных Supabase настроена
- [ ] API ключи действительны
- [ ] YooKassa настроена
- [ ] SSL сертификаты установлены
- [ ] Мониторинг настроен
- [ ] Тесты пройдены
