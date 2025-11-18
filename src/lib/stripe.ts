import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (client-side only)
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn('Stripe publishable key not found. Payment features will not work.');
}

export const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

// Price ID for $3.33/month subscription (you'll create this in Stripe Dashboard)
export const PREMIUM_PRICE_ID = import.meta.env.VITE_STRIPE_PRICE_ID || '';

export const PRICING = {
  monthly: 3.33,
  currency: 'USD',
  angelNumber: '333',
  features: [
    'Unlimited daily journaling',
    'Photo uploads',
    'Streak tracking',
    'AI pattern detection (777 unlock)',
    'Deep narrative insights',
    'Export your patterns',
  ],
};
