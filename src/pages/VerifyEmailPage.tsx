import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Sparkles } from 'lucide-react';
import { FloatingShape } from '../components/FloatingShape';

export const VerifyEmailPage: React.FC = () => {
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
        </div>

        {/* Verify Email Card */}
        <div className="card-glass text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-kairos-purple/20 mb-4">
            <Mail className="w-8 h-8 text-kairos-purple" />
          </div>

          <h2 className="text-2xl font-bold font-serif text-kairos-dark mb-3">
            Check Your Email
          </h2>

          <p className="text-kairos-dark/70 mb-6">
            Please check your email and click the verification link to activate your account.
          </p>

          <Link to="/signin">
            <button className="btn-primary w-full justify-center">
              <Sparkles className="w-5 h-5" />
              Back to Sign In
            </button>
          </Link>

          <p className="text-xs text-kairos-dark/50 mt-4">
            Didn't receive the email? Check your spam folder.
          </p>
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
