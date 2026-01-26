-- Add onboarding_completed flag to user_stats
ALTER TABLE public.user_stats 
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Add expected_expenses column to track user's target
ALTER TABLE public.user_stats 
ADD COLUMN IF NOT EXISTS expected_expenses numeric DEFAULT 0;