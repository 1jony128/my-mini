-- Создание таблицы настроек пользователей
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    ai_rules TEXT,
    user_preferences TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включение RLS для user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Политики для таблицы user_settings
DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
CREATE POLICY "Users can view own settings" ON public.user_settings
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;
CREATE POLICY "Users can insert own settings" ON public.user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;
CREATE POLICY "Users can update own settings" ON public.user_settings
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can upsert own settings" ON public.user_settings;
CREATE POLICY "Users can upsert own settings" ON public.user_settings
    FOR ALL USING (auth.uid() = user_id);

-- Создание индекса для оптимизации
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);
