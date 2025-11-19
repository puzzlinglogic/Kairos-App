import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Check, Zap, Lock, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PRICING } from '../lib/stripe';

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const canceled = searchParams.get('canceled') === 'true';
  const sessionId = searchParams.get('session_id');

  // Auto-verify if coming back from Stripe
  useEffect(() => {
    if (sessionId && user) {
      setVerifying(true);
      fetch('/api/verify-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
        .then((res) => {
          if (res.ok) {
            // Force reload to fetch new profile status
            window.location.href = '/app/patterns?success=true';
          } else {
            throw new Error('Verification failed');
          }
        })
        .catch((err) => {
          console.error(err);
          setError('Payment verified but profile update failed. Please refresh.');
          setVerifying(false);
        });
    }
  }, [sessionId, user]);

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create session');
      if (data.url) window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-kairos-purple animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-kairos-dark">Finalizing your journey...</h2>
          <p className="text-kairos-dark/60">Connecting the patterns.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kairos-dark via-kairos-purple/20 to-kairos-dark flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-kairos-purple/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-kairos-gold/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="relative max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-kairos-gold" />
            <h1 className="h1">Unlock Your Patterns</h1>
          </div>
          <p className="body-large text-kairos-light/80">
            You've unlocked the 777 portal. Subscribe to access your AI-powered insights.
          </p>
        </div>

        {canceled && (
          <div className="card-glass border border-kairos-pink/30 p-4 mb-6 text-center">
            <p className="text-kairos-pink">Payment canceled. You can try again whenever you're ready.</p>
          </div>
        )}

        {error && (
          <div className="card-glass border border-red-500/30 p-4 mb-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="card-glass border-2 border-kairos-gold/30 p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-kairos-purple via-kairos-gold to-kairos-pink" />
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-kairos-purple to-kairos-gold text-transparent bg-clip-text font-bold text-sm tracking-widest">
              ✨ {PRICING.angelNumber} ANGEL NUMBER ✨
            </div>
          </div>
          <div className="text-center mb-8">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-bold text-kairos-gold">${PRICING.monthly.toFixed(2)}</span>
              <span className="text-kairos-dark/70">/month</span>
            </div>
            <p className="text-kairos-dark/60 mt-2 text-sm">
              Cancel anytime, keep your patterns forever
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {PRICING.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Check className="w-5 h-5 text-kairos-gold" />
                </div>
                <span className="text-kairos-dark">{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                Unlock Patterns Now
              </span>
            )}
          </button>

          <div className="mt-6 pt-6 border-t border-kairos-border flex items-center justify-center gap-4 text-xs text-kairos-dark/50">
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Secure payment
            </div>
            <div>•</div>
            <div>Powered by Stripe</div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/app/patterns')}
            className="text-kairos-light/60 hover:text-kairos-light transition-colors text-sm"
          >
            ← Back to Patterns
          </button>
        </div>
      </div>
    </div>
  );
}