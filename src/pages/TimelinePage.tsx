import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserEntries, getUserStats, getFirstEntryDate } from '../lib/entries';
import { supabase } from '../lib/supabase';
import type { Entry, UserStats } from '../lib/supabase';
import {
  hasUnlockedPatterns,
  getPatternUnlockProgress,
  formatDate,
  formatTime,
  getStreakMilestone,
  getAngelNumberMessage,
} from '../lib/helpers';
import { Sparkles, Plus, Calendar, Flame, Loader, Zap, Pencil, Trash2, X } from 'lucide-react';
import { FloatingShape } from '../components/FloatingShape';
import { AppNav } from '../components/AppNav';
import { EditEntryModal } from '../components/EditEntryModal';

export const TimelinePage: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [firstEntryDate, setFirstEntryDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAngelMessage, setShowAngelMessage] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [showStreakBanner, setShowStreakBanner] = useState(
    () => !localStorage.getItem('hideStreakBanner')
  );
  const { user } = useAuth();
  const navigate = useNavigate();

  const dismissStreakBanner = () => {
    setShowStreakBanner(false);
    localStorage.setItem('hideStreakBanner', 'true');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      const { error } = await supabase.from('entries').delete().eq('id', id);

      if (error) throw error;

      // Update local state immediately for fast UI
      setEntries((prev) => prev.filter((entry) => entry.id !== id));

      // Update stats
      if (stats) {
        setStats({
          ...stats,
          total_entries: stats.total_entries - 1,
        });
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry');
    }
  };

  const handleEdit = async (newText: string) => {
    if (!editingEntry) return;

    const { error } = await supabase
      .from('entries')
      .update({ entry_text: newText })
      .eq('id', editingEntry.id);

    if (error) throw error;

    // Update local state
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === editingEntry.id ? { ...entry, entry_text: newText } : entry
      )
    );
  };

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const [entriesData, statsData, firstDate] = await Promise.all([
          getUserEntries(user.id),
          getUserStats(user.id),
          getFirstEntryDate(user.id),
        ]);
        setEntries(entriesData);
        setStats(statsData);
        setFirstEntryDate(firstDate);

        // Check for angel number milestones
        const angelMessage = getAngelNumberMessage(statsData.total_entries);
        if (angelMessage && statsData.total_entries > 0) {
          setShowAngelMessage(true);
          setTimeout(() => setShowAngelMessage(false), 5000);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-kairos-purple animate-spin mx-auto mb-3" />
          <p className="text-kairos-dark/70">Loading your journal...</p>
        </div>
      </div>
    );
  }

  const patternsUnlocked = hasUnlockedPatterns(stats?.total_entries || 0, firstEntryDate);
  const progress = getPatternUnlockProgress(stats?.total_entries || 0, firstEntryDate);
  const streakMessage = stats ? getStreakMilestone(stats.current_streak) : null;
  const angelMessage = stats ? getAngelNumberMessage(stats.total_entries) : null;

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      <FloatingShape className="top-10 -left-20" animation="slow" size={400} />
      <FloatingShape className="bottom-20 right-10" animation="medium" size={350} />

      <AppNav />

      <div className="relative z-10 container-content py-4 md:py-8">
        {/* Angel Number Celebration */}
        {showAngelMessage && angelMessage && (
          <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-pulse">
            <div className="card-glass border-2 border-kairos-gold/50 px-6 py-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-kairos-gold" />
                <div>
                  <p className="font-bold text-kairos-dark">{angelMessage.meaning}</p>
                  <p className="text-sm text-kairos-dark/70">{angelMessage.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header with Stats */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-kairos-dark mb-4">
            Your Journey
          </h1>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {stats && stats.current_streak > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kairos-gold/20 border border-kairos-gold/30">
                <Flame className="w-5 h-5 text-kairos-gold" />
                <span className="font-semibold text-kairos-dark">
                  {stats.current_streak} day streak
                </span>
              </div>
            )}

            {stats && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kairos-purple/20 border border-kairos-purple/30">
                <Calendar className="w-5 h-5 text-kairos-purple" />
                <span className="font-semibold text-kairos-dark">
                  {stats.total_entries} {stats.total_entries === 1 ? 'entry' : 'entries'}
                </span>
              </div>
            )}

            {patternsUnlocked && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-kairos-gold to-kairos-purple border-2 border-kairos-gold">
                <Zap className="w-5 h-5 text-white" />
                <span className="font-semibold text-white">
                  777 - Patterns Unlocked
                </span>
              </div>
            )}
          </div>

          {/* Streak Milestone Message */}
          {streakMessage && showStreakBanner && (
            <div className="mb-4 relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kairos-purple/10 border border-kairos-purple/20">
              <p className="text-sm font-medium text-kairos-purple">{streakMessage}</p>
              <button
                onClick={dismissStreakBanner}
                className="p-0.5 rounded-full hover:bg-kairos-purple/20 transition-colors"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5 text-kairos-purple/60" />
              </button>
            </div>
          )}

          {/* New Entry Button */}
          <Link to="/app/new">
            <button className="btn-primary">
              <Plus className="w-5 h-5" />
              New Entry
            </button>
          </Link>
        </div>

        {/* Entries Timeline */}
        {entries.length === 0 ? (
          <div className="card-glass text-center py-12">
            <Sparkles className="w-12 h-12 text-kairos-gold/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold font-serif text-kairos-dark mb-2">
              Your journal awaits
            </h3>
            <p className="text-kairos-dark/70 mb-6">
              Create your first entry to begin discovering patterns
            </p>
            <Link to="/app/new">
              <button className="btn-primary">
                <Sparkles className="w-5 h-5" />
                Write First Entry
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="card-glass">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-kairos-dark/60">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(entry.created_at)}
                    </div>
                    <div className="text-xs text-kairos-dark/40">
                      {formatTime(entry.created_at)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setEditingEntry(entry)}
                      className="p-1.5 rounded-lg opacity-50 hover:opacity-100 hover:bg-kairos-purple/10 transition-all"
                      title="Edit entry"
                    >
                      <Pencil className="w-4 h-4 text-kairos-purple" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-1.5 rounded-lg opacity-50 hover:opacity-100 hover:bg-red-50 transition-all"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                <p className="text-kairos-dark leading-relaxed mb-4 whitespace-pre-wrap">
                  {entry.entry_text}
                </p>

                {entry.photo_url && (
                  <div className="mb-4 rounded-xl overflow-hidden">
                    <img
                      src={entry.photo_url}
                      alt="Entry photo"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                {entry.guided_response && (
                  <div className="pt-4 border-t border-kairos-border/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-kairos-gold" />
                      <span className="text-sm font-semibold text-kairos-dark">
                        Reflection
                      </span>
                    </div>
                    <p className="text-sm text-kairos-dark/70 leading-relaxed whitespace-pre-wrap">
                      {entry.guided_response}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 777 Pattern Detection Progress */}
        {!patternsUnlocked && entries.length > 0 && (
          <div
            onClick={() => navigate('/app/patterns')}
            className="card-glass mt-8 text-center border-2 border-kairos-gold/30 cursor-pointer hover:scale-[1.02] transition-transform active:scale-95"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-kairos-gold to-kairos-purple mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold font-serif text-kairos-dark mb-2">
              777 - Pattern Detection
            </h3>
            <p className="text-sm text-kairos-dark/70 mb-4">
              Unlock divine insights when you reach both milestones
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="p-3 rounded-xl bg-kairos-purple/10 border border-kairos-purple/20">
                <div className="text-2xl font-bold text-kairos-purple mb-1">
                  {progress.entries}/7
                </div>
                <div className="text-xs text-kairos-dark/60">Entries</div>
                {progress.entriesNeeded > 0 && (
                  <div className="text-xs text-kairos-dark/50 mt-1">
                    {progress.entriesNeeded} more to go
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-kairos-gold/10 border border-kairos-gold/20">
                <div className="text-2xl font-bold text-kairos-gold mb-1">
                  {progress.days}/7
                </div>
                <div className="text-xs text-kairos-dark/60">Days</div>
                {progress.daysNeeded > 0 && (
                  <div className="text-xs text-kairos-dark/50 mt-1">
                    {progress.daysNeeded} more to go
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-kairos-dark/50 mt-4">
              Keep journaling daily to unlock pattern insights
            </p>
          </div>
        )}

        {/* Patterns Unlocked Message */}
        {patternsUnlocked && (
          <div className="card-glass mt-8 text-center border-2 border-kairos-gold/50 bg-gradient-to-br from-kairos-gold/5 to-kairos-purple/5">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-kairos-gold to-kairos-purple mb-4 animate-pulse">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold font-serif text-kairos-dark mb-2">
              777 - Awakening Complete
            </h3>
            <p className="text-kairos-dark/70 mb-6">
              You've unlocked deep narrative pattern detection. Discover insights hidden in your journal.
            </p>
            <Link to="/app/patterns">
              <button className="btn-primary">
                <Zap className="w-5 h-5" />
                Discover Your Patterns
              </button>
            </Link>
            <p className="text-xs text-kairos-purple font-medium mt-4">
              Divine timing. Inner wisdom. Patterns revealed.
            </p>
          </div>
        )}
      </div>

      {/* Edit Entry Modal */}
      <EditEntryModal
        isOpen={!!editingEntry}
        onClose={() => setEditingEntry(null)}
        onSave={handleEdit}
        initialText={editingEntry?.entry_text || ''}
      />
    </div>
  );
};
