import React from 'react';
import { Sparkles } from 'lucide-react';

export const AppPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container-narrow py-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kairos-gold/20 mb-4">
            <Sparkles className="w-4 h-4 text-kairos-gold" />
            <span className="text-sm font-medium text-kairos-dark">You're In!</span>
          </div>
          <h1 className="text-5xl font-bold font-serif text-kairos-dark mb-4">
            Welcome to Kairos
          </h1>
          <p className="text-xl text-kairos-dark/70 mb-8">
            Your journal is ready. Let's start building your practice.
          </p>
          <div className="card-glass max-w-2xl mx-auto p-8">
            <p className="text-kairos-dark/80">
              This is where your journal entries will appear. We'll build this next! 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
