import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserEntries, getUserStats } from '../lib/entries';
import type { Entry, UserStats } from '../lib/supabase';
import { Sparkles, Plus, Calendar, Flame, Loader } from 'lucide-react';
import { FloatingShape } from '../components/FloatingShape';

export const TimelinePage: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const [entriesData, statsData] = await Promise.all([
          getUserEntries(user.id),
          getUserStats(user.id),
        ]);
        setEntries(entriesData);
        setStats(statsData);
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

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      <FloatingShape className="top-10 -left-20" animation="slow" size={400} />
      <FloatingShape className="bottom-20 right-10" animation="medium" size={350} />

      <div className="relative z-10 container-content py-8 md:py-12">
        {/* Header with Stats */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-kairos-dark mb-4">
            Your Journey
          </h1>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mb-6">
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
          </div>

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
                  <div className="flex items-center gap-2 text-sm text-kairos-dark/60">
                    <Calendar className="w-4 h-4" />
                    {new Date(entry.created_at).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="text-xs text-kairos-dark/40">
                    {new Date(entry.created_at).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                <p className="text-kairos-dark leading-relaxed mb-4">
                  {entry.entry_text}
                </p>

                {entry.guided_response && (
                  <div className="pt-4 border-t border-kairos-border/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-kairos-gold" />
                      <span className="text-sm font-semibold text-kairos-dark">
                        Reflection
                      </span>
                    </div>
                    <p className="text-sm text-kairos-dark/70 leading-relaxed">
                      {entry.guided_response}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pattern Detection Teaser */}
        {entries.length >= 3 && entries.length < 7 && (
          <div className="card-glass mt-8 text-center border-2 border-kairos-gold/30">
            <Sparkles className="w-10 h-10 text-kairos-gold mx-auto mb-3" />
            <h3 className="text-lg font-semibold font-serif text-kairos-dark mb-2">
              Pattern detection unlocks at 7 entries
            </h3>
            <p className="text-sm text-kairos-dark/70">
              {7 - entries.length} more {7 - entries.length === 1 ? 'entry' : 'entries'} to go
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
