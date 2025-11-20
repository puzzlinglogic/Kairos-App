import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createEntry } from '../lib/entries';
import { uploadPhoto, compressImage } from '../lib/storage';
import { getRandomPrompt } from '../lib/prompts';
import { Sparkles, ImagePlus, CheckCircle, Loader, X, Shuffle } from 'lucide-react';
import { FloatingShape } from '../components/FloatingShape';
import { AppNav } from '../components/AppNav';

export const NewEntryPage: React.FC = () => {
  const [entryText, setEntryText] = useState('');
  const [guidedResponse, setGuidedResponse] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetPrompt = () => {
    setCurrentPrompt(getRandomPrompt());
  };

  const handleUsePrompt = () => {
    if (currentPrompt) {
      setEntryText((prev) => (prev ? `${prev}\n\n${currentPrompt}` : currentPrompt));
      setCurrentPrompt(null);
    }
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      // Compress image
      const compressedFile = await compressImage(file);
      setPhoto(compressedFile);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      setError('Failed to process image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
      let photoUrl: string | undefined;

      // Upload photo if present
      if (photo) {
        photoUrl = await uploadPhoto(user.id, photo);
      }

      await createEntry(
        user.id,
        entryText.trim(),
        guidedResponse.trim() || undefined,
        photoUrl
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
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="entry" className="block text-sm font-semibold text-kairos-dark">
                  Your thoughts
                </label>
                <button
                  type="button"
                  onClick={handleGetPrompt}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-kairos-purple hover:text-kairos-gold transition-colors"
                >
                  {currentPrompt ? (
                    <>
                      <Shuffle className="w-3.5 h-3.5" />
                      Shuffle Prompt
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Need Inspiration?
                    </>
                  )}
                </button>
              </div>

              {/* Prompt Display */}
              {currentPrompt && (
                <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-kairos-gold/10 to-kairos-purple/10 border border-kairos-gold/20">
                  <p className="text-sm text-kairos-dark italic mb-3">"{currentPrompt}"</p>
                  <button
                    type="button"
                    onClick={handleUsePrompt}
                    className="text-xs font-medium text-kairos-purple hover:text-kairos-gold transition-colors"
                  >
                    Use this prompt →
                  </button>
                </div>
              )}

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

          {/* Photo Upload */}
          <div className="card-glass">
            {photoPreview ? (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={photoPreview}
                    alt="Entry photo"
                    className="w-full h-auto max-h-96 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute top-2 right-2 p-2 rounded-full bg-kairos-dark/80 text-white hover:bg-kairos-dark transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-kairos-dark/60 text-center">
                  Photo will be uploaded with your entry
                </p>
              </div>
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-3 py-4 text-kairos-dark/60 hover:text-kairos-dark transition-colors"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span className="text-sm font-medium">Processing...</span>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="w-5 h-5" />
                      <span className="text-sm font-medium">Add photo</span>
                    </>
                  )}
                </button>
              </>
            )}
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
