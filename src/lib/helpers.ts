// --- Date & Time Helpers (Native JS) ---
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const calculateDaysSinceFirstEntry = (firstEntryDate: string): number => {
  const start = new Date(firstEntryDate);
  start.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

// --- 777 Unlock Logic ---
export const hasUnlockedPatterns = (totalEntries: number, firstEntryDate: string | null): boolean => {
  if (!firstEntryDate) return false;
  const days = calculateDaysSinceFirstEntry(firstEntryDate);
  return totalEntries >= 7 && days >= 7;
};

export const getPatternUnlockProgress = (
  totalEntries: number,
  firstEntryDate: string | null
) => {
  const days = firstEntryDate ? calculateDaysSinceFirstEntry(firstEntryDate) : 0;

  const entriesCapped = Math.min(totalEntries, 7);
  const daysCapped = Math.min(days, 7);

  return {
    entries: entriesCapped,
    entriesTotal: 7,
    days: daysCapped,
    daysTotal: 7,
    entriesPercentage: (entriesCapped / 7) * 100,
    daysPercentage: (daysCapped / 7) * 100,
    entriesNeeded: Math.max(7 - totalEntries, 0),
    daysNeeded: Math.max(7 - days, 0)
  };
};

// --- Streak & Angel Number Logic ---
export const getStreakMilestone = (streak: number): string | null => {
  if (streak >= 777) return '✨ 777 - Divine Completion achieved!';
  if (streak >= 333) return '💫 333 - Mastery unlocked!';
  if (streak >= 111) return '🔮 111 - Intuition flowing!';
  if (streak >= 77) return '⭐ 77 - Deep insight activated!';
  if (streak >= 21) return '🌟 21 days - Habit formed!';
  if (streak >= 7) return '✨ 7 days - Foundation set!';
  return null;
};

export const getAngelNumberMessage = (totalEntries: number): { meaning: string; description: string } | null => {
  if (totalEntries === 777) return { meaning: '777 - Divine Completion', description: 'You are in perfect alignment' };
  if (totalEntries === 333) return { meaning: '333 - Mastery', description: 'You are supported by the universe' };
  if (totalEntries === 111) return { meaning: '111 - Intuition', description: 'Your inner wisdom is awakening' };
  if (totalEntries === 77) return { meaning: '77 - Deep Insight', description: 'Patterns are revealing themselves' };
  if (totalEntries === 33) return { meaning: '33 - Master Number', description: 'Creative energy is flowing' };
  if (totalEntries === 21) return { meaning: '21 - Habit Formed', description: 'Your practice is taking root' };
  if (totalEntries === 7) return { meaning: '7 - Foundation', description: 'The beginning of wisdom' };
  return null;
};
