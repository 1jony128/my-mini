# Настройка платежной системы с YooKassa

## 1. Создание таблиц в базе данных

Выполните SQL скрипты в Supabase Dashboard в следующем порядке:

### 1.1 Основные таблицы платежей
```sql
-- Выполните database/payment-tables.sql
```

### 1.2 Исправление для Edge Function
```sql
-- Выполните database/edge-function-fix.sql
```

### 1.3 Если возникла ошибка "Could not find the 'paid' column"

Если Edge Function выдает ошибку о том, что колонка `paid` не найдена, выполните:

```sql
-- Добавляем колонку paid в таблицу orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paid BOOLEAN DEFAULT FALSE;

-- Добавляем недостающие колонки в таблицу users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS isPro BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS pro_active_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS payment_method_id TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS payment_method_type TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last4 TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS first6 TEXT;
```

## 2. Исправление Edge Function

В вашей Edge Function нужно заменить все обращения к таблице `profiles` на `users`:

```javascript
// Вместо:
const { data: profile, error: profileError } = await supabase.from('profiles').select('email').eq('id', order.profile_id).single();

// Используйте:
const { data: profile, error: profileError } = await supabase.from('users').select('email').eq('id', order.user_id).single();

// И в обновлении пользователя:
const { error: userUpdateError } = await supabase.from('users').update({
  isPro: true,
  pro_active_date: newProActiveTo,
  payment_method_id,
  payment_method_type,
  last4,
  first6
}).eq('id', order.user_id);
```

## 2. Настройка переменных окружения

Добавьте в `.env.local`:

```env
# YooKassa
YOOKASSA_SHOP_ID=your_shop_id
YOOKASSA_SECRET_KEY=your_secret_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 3. Создание Supabase Edge Function

1. Перейдите в Supabase Dashboard → Edge Functions
2. Создайте новую функцию `payment-init`
3. Скопируйте код из вашего сообщения
4. Разверните функцию

## 4. Настройка CORS (если необходимо)

В Edge Function уже настроены CORS заголовки:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
```

## 5. Тестирование

### Создание платежа:
```javascript
const response = await fetch('/api/payments/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`
  },
  body: JSON.stringify({
    userId: user.id,
    type: 'subscription',
    plan: 'monthly',
    price: 299
  })
});

const { paymentUrl } = await response.json();
window.location.href = paymentUrl;
```

### Верификация платежа:
```javascript
const response = await fetch('/api/payments/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    paymentId: 'payment_id_from_yookassa',
    orderId: 'order_id_from_database'
  })
});
```

## 6. Структура данных

### Таблица `prices`:
- `type`: тип подписки ('month', 'year', 'sale20')
- `price`: стоимость в рублях
- `description`: описание

### Таблица `orders`:
- `user_id`: ID пользователя
- `type`: тип заказа (соответствует типу в prices)
- `status`: статус заказа ('pending', 'completed', 'failed', 'cancelled')
- `payment_id`: ID платежа от YooKassa
- `amount`: сумма заказа

## 7. Обработка успешных платежей

При успешном платеже:
1. Обновляется статус заказа на 'completed'
2. Пользователю присваивается статус PRO
3. Устанавливается дата окончания подписки

## 8. Безопасность

- Все запросы к Edge Function требуют авторизации
- RLS политики защищают данные пользователей
- Платежи проверяются через API YooKassa
