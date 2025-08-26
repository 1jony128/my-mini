-- =====================================================
-- ТЕСТИРОВАНИЕ СИСТЕМЫ PRO КРЕДИТОВ
-- =====================================================
-- Выполните этот код после применения основной миграции

-- 1. Проверяем структуру таблицы users
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
AND column_name LIKE 'pro_%'
ORDER BY ordinal_position;

-- 2. Проверяем созданные таблицы
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('pro_usage_monitoring', 'pro_usage_log');

-- 3. Проверяем индексы
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'pro_usage_monitoring', 'pro_usage_log');

-- 4. Проверяем RLS политики
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('pro_usage_monitoring', 'pro_usage_log');

-- 5. Проверяем триггеры
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND event_object_table = 'pro_usage_monitoring';

-- 6. Тестируем функцию обновления updated_at
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'update_pro_usage_monitoring_updated_at';

-- 7. Проверяем существующих пользователей (без показа личных данных)
SELECT 
    id,
    is_pro,
    pro_plan_type,
    pro_credits_remaining,
    pro_credits_total,
    pro_usage_warnings,
    pro_last_reset_date
FROM public.users 
LIMIT 5;

-- 8. Проверяем, что новые таблицы пустые
SELECT 
    'pro_usage_monitoring' as table_name,
    COUNT(*) as row_count
FROM public.pro_usage_monitoring
UNION ALL
SELECT 
    'pro_usage_log' as table_name,
    COUNT(*) as row_count
FROM public.pro_usage_log;
