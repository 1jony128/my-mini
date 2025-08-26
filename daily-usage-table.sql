-- Создание таблицы для отслеживания дневного использования
CREATE TABLE IF NOT EXISTS public.daily_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    requests_count INTEGER DEFAULT 0,
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Создание индексов для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON public.daily_usage(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_usage_date ON public.daily_usage(date);

-- Включение RLS
ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;

-- Политики RLS
CREATE POLICY "Users can view their own daily usage" ON public.daily_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily usage" ON public.daily_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily usage" ON public.daily_usage
    FOR UPDATE USING (auth.uid() = user_id);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_daily_usage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_daily_usage_updated_at
    BEFORE UPDATE ON public.daily_usage
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_usage_updated_at();
