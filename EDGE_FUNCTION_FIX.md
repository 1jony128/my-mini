# Исправление Edge Function

## Проблема:
```
"Could not find the table 'public.profiles' in the schema cache"
```

## Решение:

### 1. Выполните SQL в Supabase Dashboard:
```sql
-- Добавляем недостающие колонки в таблицу users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS isPro BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS pro_active_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS payment_method_id TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS payment_method_type TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last4 TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS first6 TEXT;

-- Добавляем колонку paid в таблицу orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paid BOOLEAN DEFAULT FALSE;
```

### 2. Исправьте Edge Function:

В вашей Edge Function замените все обращения к таблице `profiles` на `users`:

#### ❌ Было (с profiles):
```javascript
const { data: profile, error: profileError } = await supabase.from('profiles').select('email').eq('id', order.profile_id).single();

const { error: userUpdateError } = await supabase.from('profiles').update({
  isPro: true,
  pro_active_date: newProActiveTo,
  payment_method_id,
  payment_method_type,
  last4,
  first6
}).eq('id', order.profile_id);
```

#### ✅ Стало (с users):
```javascript
const { data: profile, error: profileError } = await supabase.from('users').select('email').eq('id', order.user_id).single();

const { error: userUpdateError } = await supabase.from('users').update({
  isPro: true,
  pro_active_date: newProActiveTo,
  payment_method_id,
  payment_method_type,
  last4,
  first6
}).eq('id', order.user_id);
```

### 3. Полный исправленный код функции:

```javascript
const confirmPayment = async (supabase, payment_id, payment_method_id, payment_method_type, last4, first6) => {
  const { data: order, error } = await supabase.from('orders').select('*').eq('payment_id', payment_id).single();
  if (error || !order) {
    console.error("Заказ не найден:", error);
    return;
  }
  
  const currentDate = new Date();
  let newProActiveTo;
  
  if (order.type === 'sale20') {
    newProActiveTo = new Date(currentDate.setDate(currentDate.getDate() + 7));
  } else if (order.type === 'year') {
    newProActiveTo = new Date(currentDate.setMonth(currentDate.getMonth() + 12));
  } else {
    newProActiveTo = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
  }
  
  const { error: updateError } = await supabase.from('orders').update({
    paid: true
  }).eq('payment_id', payment_id);
  
  if (updateError) {
    console.error("Ошибка при обновлении заказа:", updateError);
    return;
  }
  
  const { error: userUpdateError } = await supabase.from('users').update({
    isPro: true,
    pro_active_date: newProActiveTo,
    payment_method_id,
    payment_method_type,
    last4,
    first6
  }).eq('id', order.user_id);
  
  if (userUpdateError) {
    console.error("Ошибка при обновлении пользователя:", userUpdateError);
  }
  
  try {
    const { data: profile, error: profileError } = await supabase.from('users').select('email').eq('id', order.user_id).single();
    if (profileError || !profile?.email) {
      console.error("Не удалось получить email пользователя:", profileError);
      return;
    }
    
    // Отправка email...
  } catch (e) {
    console.error("Ошибка при отправке письма:", e);
  }
};
```

### 4. Проверка:
После исправления проверьте, что:
- ✅ Все колонки добавлены в таблицу `users`
- ✅ Колонка `paid` добавлена в таблицу `orders`
- ✅ Edge Function использует `users` вместо `profiles`
- ✅ Все ссылки на `order.profile_id` заменены на `order.user_id`
