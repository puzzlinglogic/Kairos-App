/**
 * Angel Numbers and their meanings in Kairos
 */
export const ANGEL_NUMBERS = {
  111: { meaning: 'New Beginnings', description: 'You\'re manifesting a fresh start' },
  222: { meaning: 'Balance & Harmony', description: 'Your patterns are aligning' },
  333: { meaning: 'Creative Growth', description: 'The universe is supporting your journey' },
  444: { meaning: 'Foundation & Stability', description: 'You\'re building something lasting' },
  555: { meaning: 'Transformation', description: 'Change is unfolding beautifully' },
  666: { meaning: 'Reflection & Realignment', description: 'Time to check in with yourself' },
  777: { meaning: 'Spiritual Awakening', description: 'You\'re seeing the patterns now' },
  888: { meaning: 'Abundance & Flow', description: 'You\'re in alignment with your path' },
  999: { meaning: 'Completion & Wisdom', description: 'A cycle is coming full circle' },
};

/**
 * Check if a number is an angel number
 */
export const isAngelNumber = (num: number): boolean => {
  return num in ANGEL_NUMBERS;
};

/**
 * Get angel number message for a specific count
 */
export const getAngelNumberMessage = (num: number) => {
  return ANGEL_NUMBERS[num as keyof typeof ANGEL_NUMBERS] || null;
};

/**
 * Calculate days since first entry
 */
export const calculateDaysSinceFirstEntry = (firstEntryDate: string): number => {
  const first = new Date(firstEntryDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - first.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Check if user has unlocked pattern detection (777 requirement)
 * Requires: 7 entries AND 7 days since first entry
 */
export const hasUnlockedPatterns = (
  totalEntries: number,
  firstEntryDate: string | null
): boolean => {
  if (!firstEntryDate) return false;
  const daysSinceFirst = calculateDaysSinceFirstEntry(firstEntryDate);
  return totalEntries >= 7 && daysSinceFirst >= 7;
};

/**
 * Get progress toward pattern unlock (777)
 */
export const getPatternUnlockProgress = (
  totalEntries: number,
  firstEntryDate: string | null
): { entries: number; days: number; entriesNeeded: number; daysNeeded: number } => {
  const days = firstEntryDate ? calculateDaysSinceFirstEntry(firstEntryDate) : 0;
  return {
    entries: totalEntries,
    days: Math.min(days, 7),
    entriesNeeded: Math.max(7 - totalEntries, 0),
    daysNeeded: Math.max(7 - days, 0),
  };
};

/**
 * Format date for display
 */
export const formatDate = (date: string, format: 'full' | 'short' = 'full'): string => {
  const d = new Date(date);

  if (format === 'short') {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format time for display
 */
export const formatTime = (date: string): string => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Get streak milestone message
 */
export const getStreakMilestone = (streak: number): string | null => {
  if (streak === 7) return '✨ One week strong! The patterns are forming...';
  if (streak === 21) return '🌟 Three weeks! You\'re building a lasting practice';
  if (streak === 33) return '💫 33 days - master number energy!';
  if (streak === 77) return '⭐ 77 days - divine alignment achieved!';
  if (streak === 111) return '🎯 111 days - new beginnings mastered!';
  return null;
};
