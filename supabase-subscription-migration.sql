-- Add subscription fields to profiles table
-- Run this in Supabase SQL Editor

ALTER TABLE public.profiles
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN stripe_subscription_id TEXT,
ADD COLUMN subscription_status TEXT DEFAULT 'free', -- 'free', 'active', 'canceled', 'past_due', 'trialing'
ADD COLUMN subscription_tier TEXT DEFAULT 'free', -- 'free' or 'premium'
ADD COLUMN subscription_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN subscription_ends_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster lookups
CREATE INDEX profiles_stripe_customer_id_idx ON public.profiles(stripe_customer_id);
CREATE INDEX profiles_subscription_status_idx ON public.profiles(subscription_status);

-- Add helpful comments
COMMENT ON COLUMN public.profiles.stripe_customer_id IS 'Stripe customer ID for payment tracking';
COMMENT ON COLUMN public.profiles.subscription_status IS 'Current subscription status from Stripe';
COMMENT ON COLUMN public.profiles.subscription_tier IS 'Subscription tier: free or premium';
