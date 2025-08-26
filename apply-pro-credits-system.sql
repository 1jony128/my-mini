-- =====================================================
-- СИСТЕМА PRO КРЕДИТОВ - ПРИМЕНЕНИЕ В SUPABASE DASHBOARD
-- =====================================================
-- Скопируйте этот код и выполните в SQL Editor в Supabase Dashboard

-- 1. Добавляем поля для системы PRO кредитов в таблицу users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS pro_plan_type TEXT CHECK (pro_plan_type IN ('weekly', 'monthly', 'yearly')),
ADD COLUMN IF NOT EXISTS pro_credits_remaining INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pro_credits_total INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pro_usage_warnings INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pro_last_reset_date TIMESTAMP WITH TIME ZONE;

-- 2. Создаем индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_users_pro_plan_type ON public.users(pro_plan_type);
CREATE INDEX IF NOT EXISTS idx_users_pro_credits_remaining ON public.users(pro_credits_remaining);
CREATE INDEX IF NOT EXISTS idx_users_pro_last_reset_date ON public.users(pro_last_reset_date);

-- 3. Таблица для мониторинга использования PRO
CREATE TABLE IF NOT EXISTS public.pro_usage_monitoring (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    messages_count INTEGER DEFAULT 0,
    tokens_used INTEGER DEFAULT 0,
    credits_spent INTEGER DEFAULT 0,
    warnings_issued INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- 4. Индексы для мониторинга
CREATE INDEX IF NOT EXISTS idx_pro_usage_monitoring_user_date ON public.pro_usage_monitoring(user_id, date);
CREATE INDEX IF NOT EXISTS idx_pro_usage_monitoring_date ON public.pro_usage_monitoring(date);

-- 5. Таблица для логов использования PRO
CREATE TABLE IF NOT EXISTS public.pro_usage_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
    model_id TEXT NOT NULL,
    tokens_used INTEGER NOT NULL,
    credits_spent INTEGER NOT NULL,
    message_length INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Индексы для логов
CREATE INDEX IF NOT EXISTS idx_pro_usage_log_user_id ON public.pro_usage_log(user_id);
CREATE INDEX IF NOT EXISTS idx_pro_usage_log_created_at ON public.pro_usage_log(created_at);
CREATE INDEX IF NOT EXISTS idx_pro_usage_log_model_id ON public.pro_usage_log(model_id);

-- 7. Включаем RLS для новых таблиц
ALTER TABLE public.pro_usage_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_usage_log ENABLE ROW LEVEL SECURITY;

-- 8. Политики RLS для pro_usage_monitoring
CREATE POLICY "Users can view their own usage monitoring" ON public.pro_usage_monitoring
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage monitoring" ON public.pro_usage_monitoring
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage monitoring" ON public.pro_usage_monitoring
    FOR UPDATE USING (auth.uid() = user_id);

-- 9. Политики RLS для pro_usage_log
CREATE POLICY "Users can view their own usage logs" ON public.pro_usage_log
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage logs" ON public.pro_usage_log
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 10. Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_pro_usage_monitoring_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 11. Триггер для обновления updated_at
CREATE TRIGGER update_pro_usage_monitoring_updated_at 
    BEFORE UPDATE ON public.pro_usage_monitoring 
    FOR EACH ROW 
    EXECUTE FUNCTION update_pro_usage_monitoring_updated_at();

-- 12. Проверяем, что все создалось правильно
SELECT 'Migration completed successfully!' as status;

-- 13. Проверяем структуру таблиц
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'pro_usage_monitoring', 'pro_usage_log')
ORDER BY table_name, ordinal_position;
