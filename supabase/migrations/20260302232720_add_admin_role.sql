-- Add is_admin column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create securely defined function to get all customer details for admins
CREATE OR REPLACE FUNCTION public.get_all_customers()
RETURNS TABLE (
    id UUID,
    email TEXT,
    username TEXT,
    level INTEGER,
    balance NUMERIC,
    total_transactions BIGINT,
    joined_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Only allow access if the calling user is an admin
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND is_admin = true
    ) THEN
        RAISE EXCEPTION 'Access denied. Administrator privileges required.';
    END IF;

    RETURN QUERY
    SELECT 
        u.id,
        u.email::TEXT,
        p.username,
        COALESCE(s.level, 1),
        COALESCE(s.balance, 0),
        (SELECT COUNT(*) FROM public.transactions t WHERE t.user_id = u.id)::BIGINT as total_transactions,
        p.created_at
    FROM auth.users u
    JOIN public.profiles p ON p.id = u.id
    LEFT JOIN public.user_stats s ON s.user_id = u.id
    ORDER BY p.created_at DESC;
END;
$$;
