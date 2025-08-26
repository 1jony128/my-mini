-- Добавление полей настроек в таблицу users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS ai_rules TEXT,
ADD COLUMN IF NOT EXISTS user_preferences TEXT;

-- Обновление существующих записей (если нужно)
UPDATE public.users 
SET display_name = email 
WHERE display_name IS NULL;
