import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { FloatingShape } from '../components/FloatingShape';
import { Sparkles, TrendingUp, Zap, ArrowRight } from 'lucide-react';

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
            <Link to="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 md:px-10 pt-12 md:pt-20 pb-16 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-kairos-light/50 backdrop-blur-sm border border-kairos-border/50 px-4 py-2 shadow-sm mb-8">
            <Sparkles className="w-4 h-4 text-kairos-gold" />
            <span className="text-sm font-medium text-kairos-dark">
              Your spiritual mirror awaits
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight font-serif mb-6">
            <span className="text-kairos-dark">You're living in patterns</span>
            <br />
            <span className="bg-gradient-to-r from-kairos-gold via-kairos-pink to-kairos-purple bg-clip-text text-transparent">
              you can't see.
            </span>
            <br />
            <span className="text-kairos-dark">Kairos reveals them.</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-kairos-dark/70 max-w-3xl mx-auto leading-relaxed mb-12">
            A guided journal that helps you recognize cycles, make aligned decisions, and move with deeper intention
          </p>

          {/* CTA Button */}
          <div className="flex justify-center items-center mb-12">
            <Link to="/signup">
              <button className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-kairos-gold to-kairos-purple text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl hover:shadow-kairos-gold/40 transform hover:scale-105 transition-all duration-300 whitespace-nowrap">
                <Sparkles className="w-5 h-5" />
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* How Patterns Emerge Section */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 md:px-10 py-16">
        {/* Context Paragraph */}
        <p className="text-base md:text-lg text-kairos-dark/80 leading-relaxed text-center max-w-3xl mx-auto mb-8">
          Research shows that recognizing personal patterns improves decision-making, supports habit change, and enhances self-awareness. Whether you're optimizing performance, managing energy, or seeking clarity, understanding your patterns creates actionable insights.
        </p>

        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-kairos-dark mb-16 font-serif">
          How Patterns Emerge
        </h2>

        {/* Three-Column Card Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {/* Journal Card */}
          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#9b59b6] to-[#6a4c93] flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              ✍️
            </div>
            <h3 className="text-xl font-semibold text-kairos-dark mb-3">
              Journal
            </h3>
            <p className="text-kairos-dark/70 leading-relaxed">
              Write freely about what feels significant. No pressure, just your authentic reflection.
            </p>
          </div>

          {/* Reflect Card */}
          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#f4a261] to-[#e76f51] flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              🌙
            </div>
            <h3 className="text-xl font-semibold text-kairos-dark mb-3">
              Reflect
            </h3>
            <p className="text-kairos-dark/70 leading-relaxed">
              Over time, your entries create a map. Kairos naturally analyzes recurring themes and timings.
            </p>
          </div>

          {/* Discover Card */}
          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#6a4c93] to-[#9b59b6] flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              ✨
            </div>
            <h3 className="text-xl font-semibold text-kairos-dark mb-3">
              Discover
            </h3>
            <p className="text-kairos-dark/70 leading-relaxed">
              Kairos finds the threads, the patterns you're living but haven't seen yet.
            </p>
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
              Deep narrative insights reveal recurring themes and moments in your life after just 7 days.
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
            <Link to="/signup">
              <Button variant="secondary" className="w-full">
                Start Free
              </Button>
            </Link>
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
                Deep narrative pattern analysis
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
            <Link to="/signup">
              <Button variant="primary" className="w-full">
                Get Premium
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="container-narrow py-12 border-t border-kairos-border/30">
        <div className="flex flex-col items-center justify-center gap-4 text-sm">
          <Link to="/privacy" className="text-kairos-gold/60 hover:text-kairos-gold transition-colors">
            Privacy & Terms
          </Link>
          <p className="text-kairos-gold/60">© 2025 Kairos. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
