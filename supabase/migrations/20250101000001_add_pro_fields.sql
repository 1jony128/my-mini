-- Add PRO fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS pro_expires_at TIMESTAMP WITH TIME ZONE;

-- Add index for pro_expires_at
CREATE INDEX IF NOT EXISTS idx_users_pro_expires_at ON public.users(pro_expires_at);

-- Update existing users to have pro_expires_at as NULL if not set
UPDATE public.users 
SET pro_expires_at = NULL 
WHERE pro_expires_at IS NULL AND is_pro = false;
