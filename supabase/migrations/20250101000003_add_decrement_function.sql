-- Функция для уменьшения значения поля
CREATE OR REPLACE FUNCTION decrement(column_name text, amount integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN GREATEST(0, COALESCE(column_name::integer, 0) - amount);
END;
$$;
