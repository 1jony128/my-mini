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
