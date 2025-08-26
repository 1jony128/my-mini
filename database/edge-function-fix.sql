-- Исправление для Edge Function - работаем с таблицей users вместо profiles

-- Добавляем недостающие колонки в таблицу users для работы с платежами
DO $$ 
BEGIN
    -- Добавляем колонку isPro если её нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'isPro') THEN
        ALTER TABLE public.users ADD COLUMN isPro BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Добавляем колонку pro_active_date если её нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'pro_active_date') THEN
        ALTER TABLE public.users ADD COLUMN pro_active_date TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Добавляем колонку payment_method_id если её нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'payment_method_id') THEN
        ALTER TABLE public.users ADD COLUMN payment_method_id TEXT;
    END IF;
    
    -- Добавляем колонку payment_method_type если её нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'payment_method_type') THEN
        ALTER TABLE public.users ADD COLUMN payment_method_type TEXT;
    END IF;
    
    -- Добавляем колонку last4 если её нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last4') THEN
        ALTER TABLE public.users ADD COLUMN last4 TEXT;
    END IF;
    
    -- Добавляем колонку first6 если её нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'first6') THEN
        ALTER TABLE public.users ADD COLUMN first6 TEXT;
    END IF;
END $$;

-- Добавляем колонку paid в таблицу orders если её нет
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paid BOOLEAN DEFAULT FALSE;
