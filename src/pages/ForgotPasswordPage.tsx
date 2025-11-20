import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Sparkles, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { FloatingShape } from '../components/FloatingShape';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://www.kairosjournal.io/update-password',
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-landing relative overflow-hidden flex items-center justify-center">
      {/* Floating Background Shapes */}
      <FloatingShape className="top-10 -left-20" animation="slow" size={400} />
      <FloatingShape className="top-1/3 right-10" animation="medium" size={350} />
      <FloatingShape className="bottom-20 left-1/4" animation="slow" size={300} />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold font-serif text-kairos-dark mb-2">
              Kairos
            </h1>
          </Link>
          <p className="text-kairos-dark/70">Reset your password</p>
        </div>

        {/* Forgot Password Card */}
        <div className="card-glass">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kairos-purple/20 mb-4">
              <Sparkles className="w-4 h-4 text-kairos-purple" />
              <span className="text-sm font-medium text-kairos-dark">Password Reset</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-kairos-dark">
              Forgot Password?
            </h2>
          </div>

          {success ? (
            <div className="text-center">
              <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">
                  Check your email for the password reset link.
                </p>
              </div>
              <Link
                to="/signin"
                className="text-sm font-semibold text-kairos-purple hover:text-kairos-gold transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-kairos-dark mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-kairos-dark/40" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input pl-10"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <p className="text-xs text-kairos-dark/60 mt-2">
                    We'll send you a link to reset your password.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>

              {/* Back to Sign In Link */}
              <div className="mt-6 text-center">
                <Link
                  to="/signin"
                  className="text-sm font-semibold text-kairos-purple hover:text-kairos-gold transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-kairos-dark/60 hover:text-kairos-dark transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};
