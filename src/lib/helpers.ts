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
export const getStreakMilestone = (streak: number) => {
  if (streak >= 777) return { number: 777, message: 'Divine Completion' };
  if (streak >= 333) return { number: 333, message: 'Mastery' };
  if (streak >= 111) return { number: 111, message: 'Intuition' };
  if (streak >= 77) return { number: 77, message: 'Deep Insight' };
  if (streak >= 21) return { number: 21, message: 'Habit Formed' };
  if (streak >= 7) return { number: 7, message: 'Foundation' };
  return { number: 3, message: 'Beginning' };
};

export const getAngelNumberMessage = (streak: number) => {
  const next = getStreakMilestone(streak + 1);
  return `Keep going to unlock ${next.number}`;
};
