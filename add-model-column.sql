-- Добавление колонки model к таблице chats
ALTER TABLE public.chats 
ADD COLUMN IF NOT EXISTS model TEXT NOT NULL DEFAULT 'deepseek/deepseek-r1:free';

-- Обновляем существующие записи, если они есть
UPDATE public.chats 
SET model = 'deepseek/deepseek-r1:free' 
WHERE model IS NULL;
