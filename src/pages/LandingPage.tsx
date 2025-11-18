import React from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { FloatingShape } from '../components/FloatingShape';
import { Sparkles, TrendingUp, Zap } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-landing relative overflow-hidden">
      {/* Floating Background Shapes */}
      <FloatingShape className="top-10 -left-20" animation="slow" size={400} />
      <FloatingShape className="top-1/3 right-10" animation="medium" size={350} />
      <FloatingShape className="bottom-20 left-1/4" animation="slow" size={300} />

      {/* Navigation */}
      <nav className="container-narrow py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-serif text-kairos-dark">
            Kairos
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost">Sign In</Button>
            <Button variant="primary">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container-narrow py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-sm border border-kairos-border/30 mb-6">
            <Sparkles className="w-4 h-4 text-kairos-gold" />
            <span className="text-sm font-semibold text-kairos-dark">
              Discover Your Patterns
            </span>
          </div>

          <h1 className="h1 mb-6 text-kairos-dark">
            Journal Your Way to{' '}
            <span className="bg-gradient-to-r from-kairos-gold to-kairos-purple bg-clip-text text-transparent">
              Self-Discovery
            </span>
          </h1>

          <p className="body-large text-muted mb-8 max-w-2xl mx-auto">
            Kairos helps you recognize the subtle patterns in your daily life.
            Write, reflect, and unlock insights you never knew existed.
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <Button variant="primary">
              Start Your Journey
            </Button>
            <Button variant="secondary">
              Learn More
            </Button>
          </div>

          {/* Hero Card Preview */}
          <div className="max-w-2xl mx-auto">
            <Card variant="glass" className="text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-button flex items-center justify-center">
                  <span className="text-white font-bold text-xl">K</span>
                </div>
                <div>
                  <p className="font-semibold text-kairos-dark">Today's Entry</p>
                  <p className="text-sm text-muted">Day 7 Streak 🔥</p>
                </div>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="What's on your mind today?"
                  className="input"
                  disabled
                />
                <textarea
                  placeholder="Does this remind you of anything?"
                  className="textarea"
                  disabled
                />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-narrow py-16">
        <div className="text-center mb-12">
          <h2 className="h2 mb-4 text-kairos-dark">Why Kairos?</h2>
          <p className="body-base text-muted">
            Simple daily journaling that reveals profound insights
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card variant="glass">
            <div className="w-12 h-12 rounded-full bg-kairos-gold/20 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-kairos-gold" />
            </div>
            <h3 className="h3 mb-2 text-kairos-dark">Pattern Detection</h3>
            <p className="text-muted">
              AI-powered insights reveal recurring themes and moments in your life after just 7 days.
            </p>
          </Card>

          <Card variant="glass">
            <div className="w-12 h-12 rounded-full bg-kairos-purple/20 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-kairos-purple" />
            </div>
            <h3 className="h3 mb-2 text-kairos-dark">Streak Tracking</h3>
            <p className="text-muted">
              Build consistency with visual progress tracking and celebrate your growth.
            </p>
          </Card>

          <Card variant="glass">
            <div className="w-12 h-12 rounded-full bg-kairos-pink/40 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-kairos-purple" />
            </div>
            <h3 className="h3 mb-2 text-kairos-dark">Guided Prompts</h3>
            <p className="text-muted">
              Thoughtful questions help you dig deeper and make meaningful connections.
            </p>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container-narrow py-16">
        <div className="text-center mb-12">
          <h2 className="h2 mb-4 text-kairos-dark">Simple, Intentional Pricing</h2>
          <p className="body-base text-muted">
            Start free, upgrade when you're ready
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card variant="glass">
            <h3 className="h3 mb-2 text-kairos-dark">Free</h3>
            <p className="text-muted mb-6">Perfect for getting started</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-kairos-dark">$0</span>
              <span className="text-muted">/month</span>
            </div>
            <ul className="space-y-3 mb-6 text-muted">
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-kairos-gold/20 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-kairos-gold" />
                </div>
                30 days of entries
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-kairos-gold/20 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-kairos-gold" />
                </div>
                Basic pattern detection
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-kairos-gold/20 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-kairos-gold" />
                </div>
                Streak tracking
              </li>
            </ul>
            <Button variant="secondary" className="w-full">
              Start Free
            </Button>
          </Card>

          <Card variant="glass" className="border-2 border-kairos-gold/50 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="px-4 py-1 rounded-full bg-gradient-button text-white text-sm font-semibold">
                Popular
              </span>
            </div>
            <h3 className="h3 mb-2 text-kairos-dark">Premium</h3>
            <p className="text-muted mb-6">For committed journalers</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-kairos-dark">$3.33</span>
              <span className="text-muted">/month</span>
            </div>
            <ul className="space-y-3 mb-6 text-muted">
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-kairos-gold flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                Unlimited entries & archive
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-kairos-gold flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                Advanced AI pattern analysis
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-kairos-gold flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                Weekly insight reports
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-kairos-gold flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                Export & custom themes
              </li>
            </ul>
            <Button variant="primary" className="w-full">
              Get Premium
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="container-narrow py-8 border-t border-kairos-border/30">
        <div className="flex items-center justify-between text-sm text-muted">
          <p>© 2025 Kairos. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-kairos-dark transition-colors">Privacy</a>
            <a href="#" className="hover:text-kairos-dark transition-colors">Terms</a>
            <a href="#" className="hover:text-kairos-dark transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
