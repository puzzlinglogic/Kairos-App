import { supabase } from './supabase';
import { getUserEntries } from './entries';
import { analyzePatternsQuick, analyzePatternsDeep, type PatternInsight } from './ai';
import type { Pattern } from './supabase';

/**
 * Generate patterns for a user (runs both Tier 1 and Tier 2 analysis)
 */
export const generatePatterns = async (userId: string): Promise<PatternInsight[]> => {
  try {
    // Get all user entries
    const entries = await getUserEntries(userId);

    if (entries.length < 7) {
      throw new Error('Need at least 7 entries to generate patterns');
    }

    // Tier 1: Quick analysis (Haiku)
    const quickAnalysis = await analyzePatternsQuick(entries);

    // Tier 2: Deep insights (Sonnet)
    const insights = await analyzePatternsDeep(entries, quickAnalysis);

    // Save patterns to database
    for (const insight of insights) {
      await savePattern(userId, {
        pattern_type: 'ai_insight',
        pattern_data: {
          ...insight,
          wordFrequency: quickAnalysis.wordFrequency,
          themes: quickAnalysis.themes,
          generatedAt: new Date().toISOString(),
        },
        insight_text: insight.description,
      });
    }

    return insights;
  } catch (error) {
    console.error('Pattern generation error:', error);
    throw error;
  }
};

/**
 * Save a pattern to the database
 */
export const savePattern = async (
  userId: string,
  pattern: {
    pattern_type: string;
    pattern_data: any;
    insight_text?: string;
  }
): Promise<void> => {
  const { error } = await supabase.from('patterns').insert({
    user_id: userId,
    pattern_type: pattern.pattern_type,
    pattern_data: pattern.pattern_data,
    insight_text: pattern.insight_text,
  });

  if (error) throw error;
};

/**
 * Get user patterns
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
 * Mark pattern as acknowledged
 */
export const acknowledgePattern = async (patternId: string): Promise<void> => {
  const { error } = await supabase
    .from('patterns')
    .update({ is_acknowledged: true })
    .eq('id', patternId);

  if (error) throw error;
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
