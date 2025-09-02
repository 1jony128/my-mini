# 🚀 Миграция AI логики в Supabase Functions

## 📋 Что было сделано:

### 1. **Создана Supabase Edge Function**
- `supabase/functions/ai-chat/index.ts` - централизованная обработка AI запросов
- Поддержка всех моделей с fallback логикой
- Автоматическое сохранение сообщений в БД
- Контроль лимитов и токенов

### 2. **SQL функции для токенов**
- `increment_daily_tokens()` - обновление использованных токенов
- `reset_daily_tokens()` - сброс ежедневных лимитов
- `get_user_token_stats()` - получение статистики пользователя

### 3. **Новая клиентская API**
- `src/api/ai-chat.ts` - обертки для вызова Supabase Functions
- Поддержка streaming и обычных ответов
- Автоматическая авторизация через Supabase tokens

## 🔧 Шаги для развертывания:

### **Шаг 1: Настройка переменных окружения**

В Supabase Dashboard → Settings → Edge Functions → Environment Variables:

```bash
OPENROUTER_API_KEY=sk-or-v1-ваш-ключ
GROK_API_KEY=xai-ваш-ключ
SUPABASE_URL=https://ваш-проект.supabase.co
SUPABASE_SERVICE_ROLE_KEY=ваш-service-role-ключ
```

### **Шаг 2: Развертывание SQL функций**

```bash
# Подключение к Supabase
supabase link --project-ref ваш-project-id

# Применение миграций
supabase db push
```

### **Шаг 3: Развертывание Edge Function**

```bash
# Развертывание AI функции
supabase functions deploy ai-chat

# Проверка развертывания
supabase functions list
```

### **Шаг 4: Обновление клиентского кода**

Заменить вызовы в `ChatPage.tsx`:

```typescript
// СТАРЫЙ КОД:
// import { sendChatMessage } from '@/api/chat'

// НОВЫЙ КОД:
import { sendAIMessageStream, checkModelAvailability } from '@/api/ai-chat'
```

### **Шаг 5: Тестирование**

1. **Локальное тестирование:**
```bash
supabase functions serve ai-chat
```

2. **Тест API через curl:**
```bash
curl -X POST https://ваш-проект.supabase.co/functions/v1/ai-chat \
  -H "Authorization: Bearer ваш-access-token" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "model": "deepseek",
    "chatId": "test-chat",
    "stream": false
  }'
```

## 🎯 Преимущества новой архитектуры:

### **🔒 Безопасность:**
- API ключи скрыты в Supabase Environment
- Нет прямых запросов с клиента к AI сервисам
- Централизованная авторизация

### **⚡ Производительность:**
- Умные fallbacks между провайдерами
- Автоматическое управление токенами
- Кэширование в Supabase

### **🛠 Удобство разработки:**
- Единая точка входа для всех AI запросов
- Логирование и мониторинг в Supabase
- Легкое добавление новых моделей

### **💰 Экономия:**
- Оптимальное использование API квот
- Автоматический выбор дешевых fallback моделей
- Контроль расходов через лимиты

## 🔄 План миграции:

### **Фаза 1: Подготовка (✅ Готово)**
- [x] Создание Supabase Function
- [x] SQL функции для токенов  
- [x] Новая клиентская API

### **Фаза 2: Развертывание**
- [ ] Настройка environment variables
- [ ] Развертывание SQL миграций
- [ ] Развертывание Edge Function

### **Фаза 3: Интеграция**
- [ ] Обновление ChatPage
- [ ] Тестирование всех моделей
- [ ] Проверка fallback логики

### **Фаза 4: Очистка**
- [ ] Удаление старых API файлов
- [ ] Обновление документации
- [ ] Финальное тестирование

## 🆘 Troubleshooting:

### **Проблема: Function не развертывается**
```bash
# Проверить синтаксис
deno check supabase/functions/ai-chat/index.ts

# Просмотреть логи
supabase functions logs ai-chat
```

### **Проблема: Нет доступа к Environment Variables**
```bash
# Проверить переменные
supabase secrets list

# Установить переменную
supabase secrets set OPENROUTER_API_KEY=your-key
```

### **Проблема: Streaming не работает**
- Убедиться что `Content-Type: text/event-stream`
- Проверить CORS настройки
- Проверить формат SSE данных

## 📊 Мониторинг:

### **Логи Edge Function:**
```bash
supabase functions logs ai-chat --follow
```

### **Статистика использования:**
```sql
SELECT 
  model,
  COUNT(*) as requests,
  AVG(tokens_used) as avg_tokens
FROM messages 
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY model;
```

### **Мониторинг ошибок:**
```sql
SELECT * FROM edge_logs 
WHERE level = 'error' 
AND timestamp > NOW() - INTERVAL '1 hour';
```
