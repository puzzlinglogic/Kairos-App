import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createEntry } from '../lib/entries';
import { Sparkles, ImagePlus, CheckCircle, Loader } from 'lucide-react';
import { FloatingShape } from '../components/FloatingShape';
import { AppNav } from '../components/AppNav';

export const NewEntryPage: React.FC = () => {
  const [entryText, setEntryText] = useState('');
  const [guidedResponse, setGuidedResponse] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to create an entry');
      return;
    }

    if (!entryText.trim()) {
      setError('Please write something before saving');
      return;
    }

    setError('');
    setSaving(true);

    try {
      await createEntry(
        user.id,
        entryText.trim(),
        guidedResponse.trim() || undefined
      );

      // Show success state
      setSaved(true);

      // Redirect to timeline after 1.5 seconds
      setTimeout(() => {
        navigate('/app/timeline');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to save entry');
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <div className="min-h-screen bg-gradient-primary relative overflow-hidden flex items-center justify-center">
        <FloatingShape className="top-10 -left-20" animation="slow" size={400} />
        <FloatingShape className="top-1/3 right-10" animation="medium" size={350} />

        <div className="relative z-10 text-center px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-kairos-gold/20 mb-6 animate-pulse">
            <CheckCircle className="w-10 h-10 text-kairos-gold" />
          </div>
          <h2 className="text-3xl font-bold font-serif text-kairos-dark mb-2">
            Entry Saved
          </h2>
          <p className="text-kairos-dark/70">
            Your thoughts have been captured ✨
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      <FloatingShape className="top-10 -left-20" animation="slow" size={400} />
      <FloatingShape className="top-1/3 right-10" animation="medium" size={350} />

      <AppNav showBackToTimeline />

      <div className="relative z-10 container-content py-4 md:py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kairos-light/50 backdrop-blur-sm border border-kairos-border/50 mb-4">
            <Sparkles className="w-4 h-4 text-kairos-gold" />
            <span className="text-sm font-medium text-kairos-dark">
              Today's Entry
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-kairos-dark mb-2">
            What's on your mind?
          </h1>
          <p className="text-kairos-dark/70">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Entry Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card-glass">
            {/* Main Entry */}
            <div className="mb-6">
              <label htmlFor="entry" className="block text-sm font-semibold text-kairos-dark mb-3">
                Your thoughts
              </label>
              <textarea
                id="entry"
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}
                className="textarea"
                placeholder="Write freely... What happened today? How are you feeling?"
                rows={8}
                autoFocus
              />
              <p className="text-xs text-kairos-dark/50 mt-2">
                {entryText.length} characters
              </p>
            </div>

            {/* Guided Prompt */}
            <div>
              <label htmlFor="guided" className="block text-sm font-semibold text-kairos-dark mb-2">
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-kairos-gold" />
                  Does this remind you of anything?
                </span>
              </label>
              <p className="text-xs text-kairos-dark/60 mb-3">
                Patterns, memories, past experiences... what connections do you notice?
              </p>
              <textarea
                id="guided"
                value={guidedResponse}
                onChange={(e) => setGuidedResponse(e.target.value)}
                className="textarea"
                placeholder="Optional: Reflect on any patterns or connections..."
                rows={4}
              />
            </div>
          </div>

          {/* Photo Upload Placeholder */}
          <div className="card-glass">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-4 text-kairos-dark/60 hover:text-kairos-dark transition-colors"
              disabled
            >
              <ImagePlus className="w-5 h-5" />
              <span className="text-sm font-medium">Add photo (coming soon)</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/app')}
              className="btn-secondary flex-1"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 justify-center"
              disabled={saving || !entryText.trim()}
            >
              {saving ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Save Entry
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
