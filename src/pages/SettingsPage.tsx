import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Crown, CreditCard, LogOut, Loader, Trash2, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Profile, Entry } from '../lib/supabase';
import { AppNav } from '../components/AppNav';
import { FloatingShape } from '../components/FloatingShape';

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [managingSubscription, setManagingSubscription] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        navigate('/signin');
        return;
      }

      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, navigate]);

  const handleManageSubscription = async () => {
    if (!user) return;

    setManagingSubscription(true);

    try {
      const response = await fetch('/api/create-customer-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open customer portal');
      }

      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
    } catch (error: any) {
      console.error('Error opening customer portal:', error);
      alert(error.message || 'Failed to open subscription management');
    } finally {
      setManagingSubscription(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    // Double confirmation
    const firstConfirm = window.confirm('Are you sure? This cannot be undone.');
    if (!firstConfirm) return;

    const secondConfirm = window.confirm(
      'Really sure? All journal entries will be lost forever.'
    );
    if (!secondConfirm) return;

    setDeletingAccount(true);

    try {
      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      // Sign out and redirect to home
      await supabase.auth.signOut();
      navigate('/');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      alert(error.message || 'Failed to delete account');
    } finally {
      setDeletingAccount(false);
    }
  };

  const handleExport = async () => {
    if (!user) return;

    setExporting(true);

    try {
      // Fetch all entries
      const { data: entries, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Format date for display
      const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        });
      };

      // Construct HTML string
      const entriesHtml = (entries || [])
        .map(
          (entry: Entry) => `
          <article style="margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid #e5e5e5;">
            <h3 style="color: #1f2937; margin-bottom: 0.5rem;">${formatDate(entry.created_at)}</h3>
            <p style="color: #374151; line-height: 1.7; white-space: pre-wrap;">${entry.entry_text}</p>
            ${
              entry.photo_url
                ? `<img src="${entry.photo_url}" alt="Journal photo" style="max-width: 300px; border-radius: 8px; margin-top: 1rem;" />`
                : ''
            }
            ${
              entry.guided_response
                ? `<div style="margin-top: 1rem; padding: 1rem; background-color: #f9fafb; border-radius: 8px;">
                     <strong style="color: #6b21a8;">Reflection:</strong>
                     <p style="color: #4b5563; margin-top: 0.5rem; white-space: pre-wrap;">${entry.guided_response}</p>
                   </div>`
                : ''
            }
          </article>
        `
        )
        .join('');

      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Kairos Journal</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
      background-color: #fafafa;
      color: #1f2937;
    }
    h1 {
      text-align: center;
      color: #6b21a8;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      text-align: center;
      color: #6b7280;
      margin-bottom: 3rem;
    }
    article:last-child {
      border-bottom: none;
    }
  </style>
</head>
<body>
  <h1>My Kairos Journal</h1>
  <p class="subtitle">Exported on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  ${entriesHtml || '<p style="text-align: center; color: #6b7280;">No entries yet.</p>'}
</body>
</html>`;

      // Create Blob and trigger download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-kairos-journal.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error exporting journal:', error);
      alert(error.message || 'Failed to export journal');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <Loader className="w-8 h-8 text-kairos-purple animate-spin" />
      </div>
    );
  }

  const hasActiveSubscription =
    profile?.subscription_status === 'active' ||
    profile?.subscription_status === 'trialing';

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      <FloatingShape className="top-10 -left-20" animation="slow" size={400} />
      <FloatingShape className="bottom-20 right-10" animation="medium" size={350} />

      <AppNav />

      <div className="relative z-10 container-content py-8 pb-32 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Settings className="w-8 h-8 text-kairos-dark" />
            <h1 className="text-3xl font-bold font-serif text-kairos-dark">Settings</h1>
          </div>

          {/* Account Info */}
          <div className="card-glass mb-6">
            <h2 className="text-lg font-semibold text-kairos-dark mb-4">Account</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-kairos-dark/60">Email</label>
                <p className="text-kairos-dark">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm text-kairos-dark/60">Member since</label>
                <p className="text-kairos-dark">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="card-glass mb-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold text-kairos-dark">Subscription</h2>
              {hasActiveSubscription && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-kairos-gold to-kairos-purple text-white text-sm">
                  <Crown className="w-4 h-4" />
                  Premium
                </div>
              )}
            </div>

            {hasActiveSubscription ? (
              <div className="space-y-4">
                <div>
                  <p className="text-kairos-dark/70">
                    You have access to deep narrative pattern detection and insights.
                  </p>
                </div>
                <button
                  onClick={handleManageSubscription}
                  disabled={managingSubscription}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  {managingSubscription ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Opening...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Manage Subscription
                    </>
                  )}
                </button>
                <p className="text-xs text-kairos-dark/50 text-center">
                  Update payment method or cancel subscription
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-kairos-dark/70">
                  You're on the free plan. Subscribe to unlock AI pattern detection.
                </p>
                <button
                  onClick={() => navigate('/app/subscribe')}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Crown className="w-5 h-5" />
                  Upgrade to Premium
                </button>
                <p className="text-xs text-kairos-dark/50 text-center">
                  $3.33/month • 333 angel number
                </p>
              </div>
            )}
          </div>

          {/* Export Data */}
          <div className="card-glass mb-6">
            <h2 className="text-lg font-semibold text-kairos-dark mb-4">Export Data</h2>
            <p className="text-sm text-kairos-dark/70 mb-4">
              Download all your journal entries in a readable HTML format that you can view in any browser.
            </p>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              {exporting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download Journal (HTML)
                </>
              )}
            </button>
          </div>

          {/* Sign Out */}
          <div className="card-glass">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 transition-colors py-3"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>

          {/* Danger Zone */}
          <div className="card-glass border-2 border-red-200 mt-6">
            <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
            <p className="text-sm text-kairos-dark/70 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deletingAccount ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  Delete Account
                </>
              )}
            </button>
          </div>

          {/* Privacy Link */}
          <div className="text-center mt-6">
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-kairos-dark/40 hover:text-kairos-dark/60 transition-colors"
            >
              Privacy & Terms
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
