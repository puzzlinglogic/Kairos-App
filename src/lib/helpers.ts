import { differenceInDays, parseISO, startOfDay } from 'date-fns';

export const calculateDaysSinceFirstEntry = (firstEntryDate: string): number => {
  const start = startOfDay(parseISO(firstEntryDate));
  const now = startOfDay(new Date());
  return differenceInDays(now, start) + 1;
};

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
