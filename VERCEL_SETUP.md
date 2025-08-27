# 🚀 VERCEL SETUP - ChatAI Project

## 📋 Настройка проекта через Vercel CLI

Документация по настройке и управлению проектом ChatAI через Vercel CLI.

---

## 🔧 Установка и подключение

### 1. Установка Vercel CLI
```bash
# Глобальная установка (требует sudo на macOS)
npm install -g vercel

# Или через npx (рекомендуется)
npx vercel --version
```

### 2. Авторизация
```bash
npx vercel login
# Выберите GitHub для авторизации
```

### 3. Подключение к существующему проекту
```bash
npx vercel ls
# Выберите "Link to existing project" и укажите "my-mini"
```

---

## 🔐 Управление переменными окружения

### Просмотр переменных
```bash
npx vercel env ls
```

### Добавление переменных
```bash
# Публичные переменные (клиентская сторона)
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Секретные переменные (серверная сторона)
npx vercel env add SUPABASE_SERVICE_ROLE_KEY
npx vercel env add OPENROUTER_API_KEY
```

### Удаление переменных
```bash
npx vercel env rm VARIABLE_NAME
```

### Обновление переменных
```bash
npx vercel env add VARIABLE_NAME
# Введите новое значение
```

---

## 📦 Деплой

### Превью деплой
```bash
npx vercel
```

### Продакшн деплой
```bash
npx vercel --prod
```

### Принудительный деплой
```bash
npx vercel --force
```

---

## 🔍 Мониторинг и логи

### Просмотр деплоев
```bash
npx vercel ls
```

### Просмотр логов
```bash
npx vercel logs [deployment-url]
```

### Инспекция деплоя
```bash
npx vercel inspect [deployment-url]
```

---

## 📊 Текущие переменные окружения

### ✅ Настроенные переменные

| Переменная | Тип | Назначение | Статус |
|------------|-----|------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Публичная | URL Supabase проекта | ✅ Настроена |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Публичная | Публичный ключ Supabase | ✅ Настроена |
| `SUPABASE_SERVICE_ROLE_KEY` | Секретная | Сервисный ключ Supabase | ✅ Настроена |
| `OPENROUTER_API_KEY` | Секретная | API ключ OpenRouter | ✅ Настроена |

### 🔄 Переменные для добавления (при необходимости)

| Переменная | Тип | Назначение | Статус |
|------------|-----|------------|--------|
| `YOOKASSA_SHOP_ID` | Секретная | ID магазина YooKassa | ⏳ По необходимости |
| `YOOKASSA_SECRET_KEY` | Секретная | Секретный ключ YooKassa | ⏳ По необходимости |
| `OPENAI_API_KEY` | Секретная | API ключ OpenAI | ⏳ По необходимости |

---

## 🎯 Важные моменты

### 🔐 Безопасность переменных

#### Публичные переменные (`NEXT_PUBLIC_*`)
- Доступны в браузере
- Безопасно хранить в `.env.local`
- Можно добавлять в Vercel через CLI

#### Секретные переменные
- Доступны только на сервере
- **НИКОГДА** не добавлять в `.env.local`
- Добавлять только через Vercel CLI или веб-интерфейс

### 📁 Файлы .env

```bash
# .env.local - для локальной разработки
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
OPENROUTER_API_KEY=your_openrouter_key

# .env.example - пример для других разработчиков
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENROUTER_API_KEY=your_openrouter_key
```

---

## 🚀 Полезные команды

### Управление проектом
```bash
# Информация о проекте
npx vercel project ls

# Настройки проекта
npx vercel project inspect

# Домены проекта
npx vercel domains ls
```

### Развертывание
```bash
# Быстрый деплой
npx vercel

# Продакшн деплой
npx vercel --prod

# Деплой с пересборкой
npx vercel --force
```

### Отладка
```bash
# Логи в реальном времени
npx vercel logs --follow

# Инспекция конкретного деплоя
npx vercel inspect [url]
```

---

## 📞 Поддержка

### Полезные ссылки
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Deployment](https://vercel.com/docs/deployments)

### Контакты
- **Email**: esevcov097@gmail.com
- **GitHub**: [1jony128/my-mini](https://github.com/1jony128/my-mini)

---

## 🔄 Обновления

### Последнее обновление: 19 декабря 2024
- ✅ Подключен проект к Vercel CLI
- ✅ Настроены все необходимые переменные окружения
- ✅ Выполнен успешный продакшн деплой
- ✅ Создана документация по настройке

### Следующие шаги
- [ ] Настройка автоматических деплоев
- [ ] Конфигурация доменов
- [ ] Настройка мониторинга
- [ ] Оптимизация производительности

---

*Документация Vercel Setup обновлена: 19 декабря 2024*
