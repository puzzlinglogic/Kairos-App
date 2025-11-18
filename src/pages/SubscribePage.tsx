import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Check, Zap, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { stripePromise, PRICING } from '../lib/stripe';

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const canceled = searchParams.get('canceled') === 'true';

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call your serverless function to create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) {
        throw stripeError;
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kairos-dark via-kairos-purple/20 to-kairos-dark flex items-center justify-center p-4">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-kairos-purple/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-kairos-gold/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="relative max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-kairos-gold" />
            <h1 className="h1">Unlock Your Patterns</h1>
          </div>
          <p className="body-large text-kairos-light/80">
            You've unlocked the 777 portal. Subscribe to access your AI-powered insights.
          </p>
        </div>

        {/* Canceled message */}
        {canceled && (
          <div className="card-glass border border-kairos-pink/30 p-4 mb-6 text-center">
            <p className="text-kairos-pink">
              Payment canceled. You can try again whenever you're ready.
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="card-glass border border-red-500/30 p-4 mb-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Pricing card */}
        <div className="card-glass border-2 border-kairos-gold/30 p-8 relative overflow-hidden">
          {/* Gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-kairos-purple via-kairos-gold to-kairos-pink" />

          {/* Angel number badge */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-kairos-purple to-kairos-gold text-transparent bg-clip-text font-bold text-sm tracking-widest">
              ✨ {PRICING.angelNumber} ANGEL NUMBER ✨
            </div>
          </div>

          {/* Price */}
          <div className="text-center mb-8">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-bold text-kairos-gold">
                ${PRICING.monthly.toFixed(2)}
              </span>
              <span className="text-kairos-light/60">/month</span>
            </div>
            <p className="text-kairos-light/60 mt-2 text-sm">
              Cancel anytime, keep your patterns forever
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {PRICING.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Check className="w-5 h-5 text-kairos-gold" />
                </div>
                <span className="text-kairos-light">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
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

          {/* Trust indicators */}
          <div className="mt-6 pt-6 border-t border-kairos-border flex items-center justify-center gap-4 text-xs text-kairos-light/60">
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Secure payment
            </div>
            <div>•</div>
            <div>Powered by Stripe</div>
          </div>
        </div>

        {/* Back link */}
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
