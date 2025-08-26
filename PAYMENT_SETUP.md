# Настройка платежной системы с YooKassa

## 1. Создание таблиц в базе данных

Выполните SQL скрипт `database/payment-tables.sql` в Supabase Dashboard:

```sql
-- Создание таблицы цен для разных типов подписок
CREATE TABLE IF NOT EXISTS public.prices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы заказов
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'month', 'year', 'sale20'
    status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'cancelled'
    payment_id TEXT,
    amount DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Вставка базовых цен
INSERT INTO public.prices (type, price, description) VALUES
    ('month', 299.00, 'Подписка на месяц'),
    ('year', 2990.00, 'Подписка на год'),
    ('sale20', 200.00, 'Подписка на неделю')
ON CONFLICT (type) DO UPDATE SET
    price = EXCLUDED.price,
    description = EXCLUDED.description,
    updated_at = NOW();
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
