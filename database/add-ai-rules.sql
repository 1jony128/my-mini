-- Добавляем поле ai_rules в таблицу users для персональных инструкций ИИ

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS ai_rules TEXT;

-- Создаем индекс для поиска по ai_rules (опционально)
CREATE INDEX IF NOT EXISTS idx_users_ai_rules ON public.users(user_id) WHERE ai_rules IS NOT NULL;

-- Комментарий для документации
COMMENT ON COLUMN public.users.ai_rules IS 'Персональные инструкции пользователя для ИИ';
