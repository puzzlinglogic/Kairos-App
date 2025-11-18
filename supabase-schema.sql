-- Kairos Database Schema
-- Run this in Supabase SQL Editor after creating your project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Entries table
CREATE TABLE public.entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  entry_text TEXT NOT NULL,
  guided_response TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User stats table
CREATE TABLE public.user_stats (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_entries INTEGER DEFAULT 0,
  last_entry_date DATE,
  last_entry_timestamp TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patterns table (for AI-detected patterns)
CREATE TABLE public.patterns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  pattern_type TEXT NOT NULL, -- 'word_frequency', 'theme', 'cycle'
  pattern_data JSONB NOT NULL,
  insight_text TEXT,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_acknowledged BOOLEAN DEFAULT FALSE
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patterns ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Entries policies
CREATE POLICY "Users can view own entries"
  ON public.entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own entries"
  ON public.entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries"
  ON public.entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries"
  ON public.entries FOR DELETE
  USING (auth.uid() = user_id);

-- User stats policies
CREATE POLICY "Users can view own stats"
  ON public.user_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON public.user_stats FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON public.user_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Patterns policies
CREATE POLICY "Users can view own patterns"
  ON public.patterns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own patterns"
  ON public.patterns FOR UPDATE
  USING (auth.uid() = user_id);

-- Functions

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);

  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update streak (26-hour rolling window)
CREATE OR REPLACE FUNCTION public.update_user_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_last_entry_timestamp TIMESTAMP WITH TIME ZONE;
  v_last_entry_date DATE;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
  v_hours_since_last_entry NUMERIC;
BEGIN
  SELECT last_entry_timestamp, last_entry_date, current_streak, longest_streak
  INTO v_last_entry_timestamp, v_last_entry_date, v_current_streak, v_longest_streak
  FROM public.user_stats
  WHERE user_id = p_user_id;

  -- If first entry, initialize streak
  IF v_last_entry_timestamp IS NULL THEN
    UPDATE public.user_stats
    SET current_streak = 1,
        longest_streak = 1,
        total_entries = total_entries + 1,
        last_entry_date = CURRENT_DATE,
        last_entry_timestamp = NOW()
    WHERE user_id = p_user_id;
  ELSE
    -- Calculate hours since last entry
    v_hours_since_last_entry := EXTRACT(EPOCH FROM (NOW() - v_last_entry_timestamp)) / 3600;

    -- If last entry was today (same calendar day), just increment total
    IF v_last_entry_date = CURRENT_DATE THEN
      UPDATE public.user_stats
      SET total_entries = total_entries + 1,
          last_entry_timestamp = NOW()
      WHERE user_id = p_user_id;

    -- If within 26-hour window and different day, increment streak
    ELSIF v_hours_since_last_entry <= 26 THEN
      UPDATE public.user_stats
      SET current_streak = current_streak + 1,
          longest_streak = GREATEST(longest_streak, current_streak + 1),
          total_entries = total_entries + 1,
          last_entry_date = CURRENT_DATE,
          last_entry_timestamp = NOW()
      WHERE user_id = p_user_id;

    -- If more than 26 hours, reset streak to 1
    ELSE
      UPDATE public.user_stats
      SET current_streak = 1,
          total_entries = total_entries + 1,
          last_entry_date = CURRENT_DATE,
          last_entry_timestamp = NOW()
      WHERE user_id = p_user_id;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update streak on new entry
CREATE OR REPLACE FUNCTION public.handle_new_entry()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.update_user_streak(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_entry_created
  AFTER INSERT ON public.entries
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_entry();

-- Indexes for performance
CREATE INDEX entries_user_id_idx ON public.entries(user_id);
CREATE INDEX entries_created_at_idx ON public.entries(created_at DESC);
CREATE INDEX patterns_user_id_idx ON public.patterns(user_id);
CREATE INDEX patterns_detected_at_idx ON public.patterns(detected_at DESC);

-- Comments for documentation
COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth';
COMMENT ON TABLE public.entries IS 'Daily journal entries with optional photos';
COMMENT ON TABLE public.user_stats IS 'User streak and activity statistics';
COMMENT ON TABLE public.patterns IS 'AI-detected patterns and insights';
