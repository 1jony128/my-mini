-- Исправление для Edge Function - работаем с таблицей users вместо profiles

-- Добавляем недостающие колонки в таблицу users для работы с платежами
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS isPro BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS pro_active_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS payment_method_id TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS payment_method_type TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last4 TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS first6 TEXT;

-- Добавляем колонку paid в таблицу orders если её нет
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paid BOOLEAN DEFAULT FALSE;

-- Проверяем что все колонки добавлены
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
    AND column_name IN ('isPro', 'pro_active_date', 'payment_method_id', 'payment_method_type', 'last4', 'first6')
ORDER BY column_name;

SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
    AND column_name = 'paid';
