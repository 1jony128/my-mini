# Инструкция по деплою в Vercel

## Текущая настройка проекта

### ✅ Проект уже настроен в Vercel
- **Project ID**: `prj_OWR13oftaTNtabf1jf92ahUnYQZB`
- **Organization ID**: `team_SNetMzlh9jM3opFCdrJIokhi`
- **Project Name**: `my-mini`
- **Git Repository**: `https://github.com/1jony128/my-mini.git`

### 📁 Конфигурационные файлы
- `.vercel/project.json` - содержит настройки проекта
- `next.config.js` - конфигурация Next.js
- `package.json` - зависимости и скрипты

## Способы деплоя

### 1. Автоматический деплой через Git (Рекомендуется)

При каждом push в ветку `main` происходит автоматический деплой:

```bash
# 1. Добавить изменения
git add .

# 2. Создать коммит
git commit -m "описание изменений"

# 3. Отправить в GitHub
git push origin main

# 4. Vercel автоматически деплоит изменения
```

### 2. Ручной деплой через Vercel CLI

```bash
# Установка Vercel CLI (если не установлен)
npm install -g vercel

# Или использование через npx (рекомендуется)
npx vercel --version

# Деплой в production
npx vercel --prod

# Деплой в preview (для тестирования)
npx vercel

# Деплой с указанием окружения
npx vercel --env production
```

### 3. Деплой через Vercel Dashboard

1. Зайти на https://vercel.com/dashboard
2. Выбрать проект `my-mini`
3. Нажать "Deploy" в разделе "Deployments"

## Переменные окружения

### Обязательные переменные для production

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# YooKassa (платежи)
YOOKASSA_SHOP_ID=your_shop_id
YOOKASSA_SECRET_KEY=your_secret_key

# Другие переменные из env.example
```

### Настройка переменных в Vercel

1. Зайти в Vercel Dashboard
2. Выбрать проект `my-mini`
3. Перейти в "Settings" → "Environment Variables"
4. Добавить все переменные из `.env.local`

## Структура деплоя

### Production URL
```
https://my-mini-5t2pj2b9u-1jony128s-projects.vercel.app
```

### Preview URLs
```
https://my-mini-[hash]-1jony128s-projects.vercel.app
```

### Inspect URL (для отладки)
```
https://vercel.com/1jony128s-projects/my-mini/[deployment-id]
```

## Команды для быстрого деплоя

### Полный цикл деплоя
```bash
# 1. Проверить статус
git status

# 2. Добавить все изменения
git add .

# 3. Создать коммит
git commit -m "feat: описание изменений"

# 4. Отправить в GitHub (автоматический деплой)
git push origin main

# 5. Или принудительный деплой через CLI
npx vercel --prod
```

### Только деплой (без коммита)
```bash
# Если изменения уже закоммичены
npx vercel --prod

# Если нужно деплоить текущие изменения
npx vercel --prod --force
```

## Мониторинг деплоя

### Проверка статуса
```bash
# Посмотреть последние деплои
npx vercel ls

# Информация о проекте
npx vercel project ls
```

### Логи деплоя
1. Vercel Dashboard → Project → Deployments
2. Выбрать конкретный деплой
3. Просмотреть логи в реальном времени

## Troubleshooting

### Частые проблемы

1. **Ошибки сборки**
   ```bash
   # Проверить локально
   npm run build
   
   # Проверить логи в Vercel Dashboard
   ```

2. **Проблемы с переменными окружения**
   - Проверить все переменные в Vercel Dashboard
   - Убедиться, что переменные добавлены для production

3. **Проблемы с Supabase**
   - Проверить RLS политики
   - Убедиться, что edge functions работают

### Полезные команды
```bash
# Очистить кэш Vercel
npx vercel --clear-cache

# Пересобрать проект
npx vercel --force

# Проверить конфигурацию
npx vercel --debug
```

## Автоматизация

### GitHub Actions (опционально)
Можно настроить GitHub Actions для дополнительной проверки перед деплоем:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Контакты и поддержка

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Project URL**: https://vercel.com/1jony128s-projects/my-mini
- **Documentation**: https://vercel.com/docs

## Примечания

- Проект использует Next.js 13+ с App Router
- Все изменения в `main` ветке автоматически деплоятся
- Sitemap и robots.txt генерируются автоматически
- Edge Functions для Supabase настроены
- Система платежей YooKassa интегрирована
