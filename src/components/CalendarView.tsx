import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import type { Entry } from '../lib/supabase';

interface CalendarViewProps {
  entries: Entry[];
  onSelectDate: (date: Date | null) => void;
  selectedDate: Date | null;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  entries,
  onSelectDate,
  selectedDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Calculate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Check if a day has entries
  const hasEntry = (day: Date) => {
    return entries.some((entry) => {
      const entryDate = new Date(entry.created_at);
      return isSameDay(entryDate, day);
    });
  };

  // Check if a day is selected
  const isSelected = (day: Date) => {
    return selectedDate ? isSameDay(day, selectedDate) : false;
  };

  // Handle day click
  const handleDayClick = (day: Date) => {
    if (!isSameMonth(day, currentMonth)) return;

    // If clicking the same day, deselect it
    if (selectedDate && isSameDay(day, selectedDate)) {
      onSelectDate(null);
    } else {
      onSelectDate(day);
    }
  };

  // Navigation
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="card-glass p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-lg hover:bg-kairos-purple/10 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-kairos-purple" />
        </button>
        <h3 className="text-lg font-semibold text-kairos-dark">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-lg hover:bg-kairos-purple/10 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-kairos-purple" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-kairos-dark/60 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const inCurrentMonth = isSameMonth(day, currentMonth);
          const dayHasEntry = hasEntry(day);
          const dayIsSelected = isSelected(day);

          return (
            <button
              key={index}
              onClick={() => handleDayClick(day)}
              disabled={!inCurrentMonth}
              className={`
                aspect-square rounded-lg text-sm font-medium transition-all relative
                ${!inCurrentMonth ? 'text-kairos-dark/20 cursor-not-allowed' : ''}
                ${inCurrentMonth && !dayHasEntry && !dayIsSelected ? 'text-kairos-dark/60 hover:bg-kairos-border/20' : ''}
                ${dayHasEntry && !dayIsSelected ? 'text-kairos-dark bg-kairos-gold/10 ring-1 ring-kairos-gold/30 hover:ring-kairos-gold/50' : ''}
                ${dayIsSelected ? 'bg-kairos-purple text-white ring-2 ring-kairos-purple' : ''}
              `}
            >
              {format(day, 'd')}
              {dayHasEntry && !dayIsSelected && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-kairos-gold" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
