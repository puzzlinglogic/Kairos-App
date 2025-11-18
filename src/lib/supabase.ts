import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Entry {
  id: string;
  user_id: string;
  entry_text: string;
  guided_response?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  total_entries: number;
  last_entry_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Pattern {
  id: string;
  user_id: string;
  pattern_type: 'word_frequency' | 'theme' | 'cycle' | 'ai_insight';
  pattern_data: any;
  insight_text?: string;
  detected_at: string;
  is_acknowledged: boolean;
}
