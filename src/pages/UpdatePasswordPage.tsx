import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Sparkles, Lock, AlertCircle } from 'lucide-react';
import { FloatingShape } from '../components/FloatingShape';

export const UpdatePasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      alert('Password updated successfully!');
      navigate('/app/timeline');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
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
          <p className="text-kairos-dark/70">Set your new password</p>
        </div>

        {/* Update Password Card */}
        <div className="card-glass">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kairos-purple/20 mb-4">
              <Sparkles className="w-4 h-4 text-kairos-purple" />
              <span className="text-sm font-medium text-kairos-dark">New Password</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-kairos-dark">
              Update Password
            </h2>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-kairos-dark mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-kairos-dark/40" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-kairos-dark mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-kairos-dark/40" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Updating...'
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Update Password
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
