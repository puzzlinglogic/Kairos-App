import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserStats, getFirstEntryDate } from '../lib/entries';
import { generatePatterns, getUserPatterns, hasPatternsGenerated } from '../lib/patterns';
import { hasUnlockedPatterns } from '../lib/helpers';
import { supabase } from '../lib/supabase';
import type { Pattern } from '../lib/supabase';
import type { PatternInsight } from '../lib/supabase';
import { Sparkles, Loader, Zap, TrendingUp, Heart, Calendar, Brain, Lock, Crown } from 'lucide-react';
import { FloatingShape } from '../components/FloatingShape';
import { AppNav } from '../components/AppNav';

export const PatternsPage: React.FC = () => {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [hasPatterns, setHasPatterns] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        navigate('/signin');
        return;
      }

      try {
        // Fetch profile for subscription status
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setHasActiveSubscription(
            profileData.subscription_status === 'active' ||
            profileData.subscription_status === 'trialing'
          );
        }

        const [stats, firstDate, patternsExist, userPatterns] = await Promise.all([
          getUserStats(user.id),
          getFirstEntryDate(user.id),
          hasPatternsGenerated(user.id),
          getUserPatterns(user.id),
        ]);

        const isPatternsUnlocked = hasUnlockedPatterns(stats.total_entries, firstDate);
        setUnlocked(isPatternsUnlocked);
        setHasPatterns(patternsExist);
        setPatterns(userPatterns);
      } catch (error) {
        console.error('Error loading patterns:', error);
        setError('Failed to load patterns');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate]);

  const handleGeneratePatterns = async () => {
    if (!user) return;

    setGenerating(true);
    setError('');

    try {
      await generatePatterns(user.id);
      const updatedPatterns = await getUserPatterns(user.id);
      setPatterns(updatedPatterns);
      setHasPatterns(true);
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate patterns');
    } finally {
      setGenerating(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'temporal':
        return <Calendar className="w-5 h-5" />;
      case 'emotional':
        return <Heart className="w-5 h-5" />;
      case 'behavioral':
        return <TrendingUp className="w-5 h-5" />;
      case 'cognitive':
        return <Brain className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'from-kairos-gold to-kairos-purple';
      case 'medium':
        return 'from-kairos-purple to-kairos-pink';
      case 'low':
        return 'from-kairos-pink to-kairos-border';
      default:
        return 'from-kairos-gold to-kairos-purple';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-kairos-purple animate-spin mx-auto mb-3" />
          <p className="text-kairos-dark/70">Loading patterns...</p>
        </div>
      </div>
    );
  }

  // Not unlocked yet
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
        <FloatingShape className="top-10 -left-20" animation="slow" size={400} />
        <FloatingShape className="bottom-20 right-10" animation="medium" size={350} />
        <AppNav />
        <div className="relative z-10 container-content py-8 md:py-12">
          <div className="card-glass text-center py-16 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-kairos-border/30 mb-6">
              <Lock className="w-10 h-10 text-kairos-dark/40" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-kairos-dark mb-3">
              Pattern Detection Locked
            </h2>
            <p className="text-kairos-dark/70 mb-6">
              Complete 777 to unlock AI-powered pattern insights: 7 entries AND 7 days of journaling.
            </p>
            <button onClick={() => navigate('/app/timeline')} className="btn-primary">
              <Sparkles className="w-5 h-5" />
              Back to Timeline
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Unlocked but no subscription - show paywall
  if (unlocked && !hasActiveSubscription) {
    const success = searchParams.get('success') === 'true';

    return (
      <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
        <FloatingShape className="top-10 -left-20" animation="slow" size={400} />
        <FloatingShape className="bottom-20 right-10" animation="medium" size={350} />
        <AppNav />
        <div className="relative z-10 container-content py-8 md:py-12">
          <div className="card-glass text-center py-16 max-w-2xl mx-auto border-2 border-kairos-gold/30">
            {success ? (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-kairos-gold to-kairos-purple mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-serif text-kairos-dark mb-3">
                  Welcome to Premium!
                </h2>
                <p className="text-kairos-dark/70 mb-6">
                  Your subscription is being activated. Refresh the page in a moment to access your patterns.
                </p>
                <button onClick={() => window.location.reload()} className="btn-primary">
                  <Zap className="w-5 h-5" />
                  Refresh Page
                </button>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-kairos-gold to-kairos-purple mb-6">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-kairos-gold to-kairos-purple border-2 border-kairos-gold mb-4">
                  <Zap className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white">777 - Patterns Unlocked</span>
                </div>
                <h2 className="text-2xl font-bold font-serif text-kairos-dark mb-3">
                  Subscribe to Access Your Patterns
                </h2>
                <p className="text-kairos-dark/70 mb-6 max-w-md mx-auto">
                  You've unlocked pattern detection! Subscribe for $3.33/month to access AI-powered insights from your journal.
                </p>
                <button onClick={() => navigate('/app/subscribe')} className="btn-primary mb-4">
                  <Crown className="w-5 h-5" />
                  Subscribe Now
                </button>
                <p className="text-xs text-kairos-dark/50">
                  333 angel number • Cancel anytime
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      <FloatingShape className="top-10 -left-20" animation="slow" size={400} />
      <FloatingShape className="bottom-20 right-10" animation="medium" size={350} />

      <AppNav />

      <div className="relative z-10 container-content py-4 md:py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-kairos-gold to-kairos-purple border-2 border-kairos-gold mb-4">
            <Zap className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">777 - Patterns Unlocked</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-kairos-dark mb-2">
            Your Patterns
          </h1>
          <p className="text-kairos-dark/70">AI-discovered insights from your journal</p>
        </div>

        {/* Generate Button */}
        {!hasPatterns && (
          <div className="card-glass text-center py-12 mb-8">
            <Sparkles className="w-16 h-16 text-kairos-gold mx-auto mb-4" />
            <h3 className="text-xl font-semibold font-serif text-kairos-dark mb-3">
              Ready to discover your patterns?
            </h3>
            <p className="text-kairos-dark/70 mb-6 max-w-md mx-auto">
              Our AI will analyze your journal entries to find meaningful patterns, themes, and insights.
            </p>
            <button
              onClick={handleGeneratePatterns}
              disabled={generating}
              className="btn-primary"
            >
              {generating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Analyzing patterns...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Generate Patterns
                </>
              )}
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="card-glass mb-8 p-4 border-2 border-red-200">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Pattern Cards */}
        {patterns.length > 0 && (
          <div className="space-y-4">
            {patterns
              .filter((p) => p.pattern_type === 'ai_insight')
              .map((pattern) => {
                const insight = pattern.pattern_data as PatternInsight;
                return (
                  <div key={pattern.id} className="card-glass">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${getConfidenceColor(
                          insight.confidence
                        )} flex items-center justify-center text-white`}
                      >
                        {getCategoryIcon(insight.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-kairos-dark">
                            {insight.title}
                          </h3>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              insight.confidence === 'high'
                                ? 'bg-kairos-gold/20 text-kairos-gold'
                                : insight.confidence === 'medium'
                                ? 'bg-kairos-purple/20 text-kairos-purple'
                                : 'bg-kairos-pink/20 text-kairos-pink'
                            }`}
                          >
                            {insight.confidence} confidence
                          </span>
                        </div>
                        <p className="text-kairos-dark/70 leading-relaxed">{insight.description}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs text-kairos-dark/50 capitalize">
                            {insight.category} pattern
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Regenerate Button */}
        {hasPatterns && (
          <div className="text-center mt-8">
            <button
              onClick={handleGeneratePatterns}
              disabled={generating}
              className="btn-secondary"
            >
              {generating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Refresh Patterns
                </>
              )}
            </button>
            <p className="text-xs text-kairos-dark/50 mt-2">
              Updates patterns based on all your entries
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
