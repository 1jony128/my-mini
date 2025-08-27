-- Обновление системы PRO кредитов с коэффициентами моделей

-- 1. Добавляем новые колонки в таблицу users для системы кредитов
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS pro_credits_remaining INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS pro_credits_total INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS pro_usage_warnings INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS pro_last_reset_date TIMESTAMP WITH TIME ZONE;

-- 2. Создаем таблицу для мониторинга PRO использования
CREATE TABLE IF NOT EXISTS public.pro_usage_monitoring (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    messages_count INTEGER DEFAULT 0,
    tokens_used INTEGER DEFAULT 0,
    credits_spent INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- 3. Создаем таблицу для логов PRO использования
CREATE TABLE IF NOT EXISTS public.pro_usage_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
    model_id TEXT NOT NULL,
    tokens_used INTEGER NOT NULL,
    credits_spent INTEGER NOT NULL,
    message_length INTEGER NOT NULL,
    model_cost_multiplier INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Создаем индексы для производительности
CREATE INDEX IF NOT EXISTS idx_pro_usage_monitoring_user_date ON public.pro_usage_monitoring(user_id, date);
CREATE INDEX IF NOT EXISTS idx_pro_usage_log_user_created ON public.pro_usage_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pro_usage_log_model ON public.pro_usage_log(model_id);

-- 5. Создаем функцию для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Создаем триггер для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_pro_usage_monitoring_updated_at ON public.pro_usage_monitoring;
CREATE TRIGGER update_pro_usage_monitoring_updated_at
    BEFORE UPDATE ON public.pro_usage_monitoring
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Устанавливаем начальные кредиты для существующих PRO пользователей
UPDATE public.users 
SET 
    pro_credits_remaining = CASE 
        WHEN pro_plan_type = 'sale20' OR pro_plan_type = 'weekly' THEN 100
        WHEN pro_plan_type = 'month' OR pro_plan_type = 'monthly' THEN 400
        WHEN pro_plan_type = 'year' OR pro_plan_type = 'yearly' THEN 5000
        ELSE 0
    END,
    pro_credits_total = CASE 
        WHEN pro_plan_type = 'sale20' OR pro_plan_type = 'weekly' THEN 100
        WHEN pro_plan_type = 'month' OR pro_plan_type = 'monthly' THEN 400
        WHEN pro_plan_type = 'year' OR pro_plan_type = 'yearly' THEN 5000
        ELSE 0
    END
WHERE is_pro = true AND pro_credits_remaining = 0;

-- 8. Создаем RLS политики для новых таблиц
ALTER TABLE public.pro_usage_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_usage_log ENABLE ROW LEVEL SECURITY;

-- Политика для pro_usage_monitoring
DROP POLICY IF EXISTS "Users can view their own usage monitoring" ON public.pro_usage_monitoring;
CREATE POLICY "Users can view their own usage monitoring" ON public.pro_usage_monitoring
    FOR SELECT USING (auth.uid() = user_id);

-- Политика для pro_usage_log
DROP POLICY IF EXISTS "Users can view their own usage logs" ON public.pro_usage_log;
CREATE POLICY "Users can view their own usage logs" ON public.pro_usage_log
    FOR SELECT USING (auth.uid() = user_id);

-- 9. Создаем представление для удобного просмотра статистики
CREATE OR REPLACE VIEW public.pro_usage_stats AS
SELECT 
    u.id as user_id,
    u.email,
    u.is_pro,
    u.pro_plan_type,
    u.pro_credits_remaining,
    u.pro_credits_total,
    u.pro_expires_at,
    COALESCE(pum.messages_count, 0) as today_messages,
    COALESCE(pum.tokens_used, 0) as today_tokens,
    COALESCE(pum.credits_spent, 0) as today_credits,
    (SELECT COUNT(*) FROM public.pro_usage_log WHERE user_id = u.id AND created_at >= NOW() - INTERVAL '7 days') as weekly_messages
FROM public.users u
LEFT JOIN public.pro_usage_monitoring pum ON u.id = pum.user_id AND pum.date = CURRENT_DATE
WHERE u.is_pro = true;

-- 10. Создаем функцию для сброса кредитов при продлении подписки
CREATE OR REPLACE FUNCTION reset_pro_credits_on_renewal()
RETURNS TRIGGER AS $$
BEGIN
    -- Если изменился план или дата истечения
    IF OLD.pro_plan_type IS DISTINCT FROM NEW.pro_plan_type OR 
       OLD.pro_expires_at IS DISTINCT FROM NEW.pro_expires_at THEN
        
        -- Устанавливаем новые кредиты в зависимости от плана
        NEW.pro_credits_remaining = CASE 
            WHEN NEW.pro_plan_type = 'sale20' OR NEW.pro_plan_type = 'weekly' THEN 100
            WHEN NEW.pro_plan_type = 'month' OR NEW.pro_plan_type = 'monthly' THEN 400
            WHEN NEW.pro_plan_type = 'year' OR NEW.pro_plan_type = 'yearly' THEN 5000
            ELSE NEW.pro_credits_remaining
        END;
        
        NEW.pro_credits_total = NEW.pro_credits_remaining;
        NEW.pro_last_reset_date = NOW();
        NEW.pro_usage_warnings = 0;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 11. Создаем триггер для автоматического сброса кредитов
DROP TRIGGER IF EXISTS trigger_reset_pro_credits ON public.users;
CREATE TRIGGER trigger_reset_pro_credits
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION reset_pro_credits_on_renewal();

-- 12. Создаем функцию для очистки старых логов (опционально)
CREATE OR REPLACE FUNCTION cleanup_old_pro_logs()
RETURNS void AS $$
BEGIN
    -- Удаляем логи старше 90 дней
    DELETE FROM public.pro_usage_log 
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ language 'plpgsql';

-- Комментарии для документации
COMMENT ON TABLE public.pro_usage_monitoring IS 'Мониторинг ежедневного использования PRO функций';
COMMENT ON TABLE public.pro_usage_log IS 'Детальные логи использования PRO функций';
COMMENT ON VIEW public.pro_usage_stats IS 'Представление для просмотра статистики PRO пользователей';
COMMENT ON FUNCTION reset_pro_credits_on_renewal() IS 'Автоматически сбрасывает кредиты при продлении подписки';
COMMENT ON FUNCTION cleanup_old_pro_logs() IS 'Очищает старые логи использования (старше 90 дней)';
