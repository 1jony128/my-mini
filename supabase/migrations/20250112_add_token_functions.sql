-- Функция для инкремента ежедневных токенов
CREATE OR REPLACE FUNCTION increment_daily_tokens(user_id UUID, tokens_to_add INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET daily_tokens_used = COALESCE(daily_tokens_used, 0) + tokens_to_add,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для сброса ежедневных токенов (для cron job)
CREATE OR REPLACE FUNCTION reset_daily_tokens()
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET daily_tokens_used = 0,
      updated_at = NOW()
  WHERE daily_tokens_used > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для получения статистики использования
CREATE OR REPLACE FUNCTION get_user_token_stats(user_id UUID)
RETURNS TABLE(
  total_tokens_used BIGINT,
  daily_tokens_used INTEGER,
  daily_limit INTEGER,
  remaining_tokens INTEGER,
  is_pro BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(m.tokens_used), 0)::BIGINT as total_tokens_used,
    u.daily_tokens_used,
    COALESCE(u.daily_limit, 1250) as daily_limit,
    GREATEST(0, COALESCE(u.daily_limit, 1250) - COALESCE(u.daily_tokens_used, 0)) as remaining_tokens,
    u.is_pro
  FROM users u
  LEFT JOIN messages m ON m.user_id = u.id
  WHERE u.id = get_user_token_stats.user_id
  GROUP BY u.id, u.daily_tokens_used, u.daily_limit, u.is_pro;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
