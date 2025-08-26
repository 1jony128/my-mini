-- Создание таблицы цен для разных типов подписок
CREATE TABLE IF NOT EXISTS public.prices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы заказов
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'month', 'year', 'sale20'
    status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'cancelled'
    payment_id TEXT,
    amount DECIMAL(10,2),
    paid BOOLEAN DEFAULT FALSE, -- Добавляем колонку для отслеживания оплаты
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Вставка базовых цен
INSERT INTO public.prices (type, price, description) VALUES
    ('month', 299.00, 'Подписка на месяц'),
    ('year', 2990.00, 'Подписка на год'),
    ('sale20', 200.00, 'Подписка на неделю')
ON CONFLICT (type) DO UPDATE SET
    price = EXCLUDED.price,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);

-- RLS политики для таблицы prices (публичный доступ для чтения)
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Prices are viewable by everyone" ON public.prices
    FOR SELECT USING (true);

-- RLS политики для таблицы orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_prices_updated_at BEFORE UPDATE ON public.prices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Добавляем недостающие колонки в таблицу users (если их нет)
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
