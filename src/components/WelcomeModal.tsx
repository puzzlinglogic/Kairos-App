import React from 'react';
import { Sparkles, X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-kairos-gold/30 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-kairos-dark/40 hover:text-kairos-dark hover:bg-kairos-dark/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 pt-8 text-center">
          {/* Header */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-kairos-gold to-kairos-purple mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-kairos-dark mb-6">
            Welcome to Kairos
          </h2>

          {/* Body */}
          <div className="text-left space-y-4 mb-6">
            <p className="text-kairos-dark/80">
              Kairos is not a normal journal. You don't need to write perfectly.
            </p>
            <p className="text-kairos-dark/80">
              <span className="font-semibold text-kairos-dark">Ramble freely.</span> Vent about your day. List your anxieties. Share your dreams.
            </p>
            <p className="text-kairos-dark/80">
              The deeper and messier you are, the easier it is to reveal your hidden patterns.
            </p>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-kairos-border/30">
            <p className="text-sm font-medium text-kairos-purple mb-4">
              Your goal: 7 Entries in 7 Days
            </p>
            <button
              onClick={onClose}
              className="btn-primary w-full"
            >
              <Sparkles className="w-5 h-5" />
              Start My Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
