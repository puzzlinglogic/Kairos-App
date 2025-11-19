import { supabase } from './supabase';
import type { Pattern } from './supabase';

/**
 * Generate patterns by calling the backend API
 * This replaces the client-side AI logic
 */
export const generatePatterns = async (userId: string): Promise<void> => {
  try {
    const response = await fetch('/api/generate-patterns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate patterns');
    }

    // The API handles saving to the DB, so we just return success
    return;
  } catch (error) {
    console.error('Pattern generation error:', error);
    throw error;
  }
};

/**
 * Get user patterns (Read-only)
 */
export const getUserPatterns = async (userId: string): Promise<Pattern[]> => {
  const { data, error } = await supabase
    .from('patterns')
    .select('*')
    .eq('user_id', userId)
    .order('detected_at', { ascending: false });

  if (error) throw error;
  return data as Pattern[];
};

/**
 * Check if patterns have been generated for a user
 */
export const hasPatternsGenerated = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('patterns')
    .select('id')
    .eq('user_id', userId)
    .eq('pattern_type', 'ai_insight')
    .limit(1);

  if (error) throw error;
  return (data?.length || 0) > 0;
};