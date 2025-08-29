# Деплой на Timeweb Cloud

## Варианты деплоя

### 1. Статическая генерация (Apps) - Ограниченный функционал

**Ограничения:**
- API роуты не работают
- Только статические страницы
- Нет серверного рендеринга

**Настройка:**
1. Раскомментируйте в `next.config.js`:
   ```js
   output: 'export',
   trailingSlash: true,
   ```
2. Закомментируйте:
   ```js
   output: 'standalone',
   ```

**Команды для Timeweb Apps:**
- Команда сборки: `npm run build`
- Директория сборки: `out/`
- Зависимости: `npm install`

### 2. Docker деплой - Полный функционал

**Преимущества:**
- Работают все API роуты
- Полный функционал Next.js
- Серверный рендеринг

**Настройка:**
1. Используйте текущую конфигурацию `next.config.js` с `output: 'standalone'`
2. В Timeweb Cloud выберите "Деплой из Dockerfile"

**Команды для Timeweb Docker:**
- Используйте существующий `Dockerfile`
- Порт: 3000
- Переменные окружения настройте в панели Timeweb

## Переменные окружения

Создайте в панели Timeweb Cloud следующие переменные:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
YOOKASSA_SHOP_ID=your-yookassa-shop-id
YOOKASSA_SECRET_KEY=your-yookassa-secret-key
```

## Локальное тестирование

### Docker
```bash
# Сборка и запуск
docker-compose up --build

# Только сборка
docker build -t chatai-app .
docker run -p 3000:3000 chatai-app
```

### Статическая сборка
```bash
# Настройка для статики
npm run build
npx serve out/
```

## Рекомендации

1. **Для продакшена используйте Docker деплой** - он обеспечивает полный функционал
2. **Для демо/лендинга используйте статическую генерацию** - быстрее и дешевле
3. **Настройте SSL сертификаты** в панели Timeweb Cloud
4. **Настройте домен** после деплоя

## Мониторинг

После деплоя проверьте:
- Логи приложения в панели Timeweb Cloud
- Доступность API эндпоинтов
- Работу аутентификации
- Интеграцию с платежами
