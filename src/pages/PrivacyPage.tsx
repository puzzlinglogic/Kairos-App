import React from 'react';
import { Link } from 'react-router-dom';
import { FloatingShape } from '../components/FloatingShape';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-landing relative overflow-hidden">
      <FloatingShape className="top-10 -left-20" animation="slow" size={400} />
      <FloatingShape className="top-1/3 right-10" animation="medium" size={350} />
      <FloatingShape className="bottom-20 left-1/4" animation="slow" size={300} />

      <div className="relative z-10 container-content py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4">
              <h1 className="text-3xl font-bold font-serif text-kairos-dark">
                Kairos
              </h1>
            </Link>
            <h2 className="text-2xl font-bold font-serif text-kairos-dark">
              Privacy Policy & Terms
            </h2>
          </div>

          {/* Content */}
          <div className="card-glass">
            <p className="text-sm text-kairos-dark/60 mb-6">
              Last updated: November 2025
            </p>

            <div className="space-y-6 text-kairos-dark/80">
              <section>
                <h3 className="font-semibold text-kairos-dark mb-2">1. Data Collection</h3>
                <p className="text-sm leading-relaxed">
                  We collect your email address and journal entries to provide the service.
                  Your journal entries are private and only accessible to you.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-kairos-dark mb-2">2. Data Security</h3>
                <p className="text-sm leading-relaxed">
                  Your data is stored securely via Supabase with encryption at rest and in transit.
                  We implement industry-standard security practices to protect your information.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-kairos-dark mb-2">3. Payments</h3>
                <p className="text-sm leading-relaxed">
                  Payments are processed securely via Stripe. We do not store credit card details
                  on our servers. All payment information is handled directly by Stripe.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-kairos-dark mb-2">4. Data Deletion</h3>
                <p className="text-sm leading-relaxed">
                  You may delete your account at any time via Settings. This will permanently
                  remove all your data including journal entries, patterns, and payment information.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-kairos-dark mb-2">5. Contact</h3>
                <p className="text-sm leading-relaxed">
                  For questions about this privacy policy or your data, please email us at{' '}
                  <a
                    href="mailto:support@kairosjournal.io"
                    className="text-kairos-purple hover:text-kairos-gold transition-colors"
                  >
                    support@kairosjournal.io
                  </a>
                </p>
              </section>
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-sm text-kairos-dark/60 hover:text-kairos-dark transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
