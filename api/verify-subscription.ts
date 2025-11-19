import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });

  try {
    // 1. Verify the session with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not complete' });
    }

    const userId = session.metadata?.supabase_user_id;
    if (!userId) return res.status(400).json({ error: 'No user ID in session' });

    // 2. Update Supabase immediately (don't wait for webhook)
    const { error } = await supabase
      .from('profiles')
      .update({
        stripe_subscription_id: session.subscription as string,
        subscription_status: 'active',
        subscription_tier: 'premium',
        subscription_started_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Verification Error:', error);
    return res.status(500).json({ error: error.message });
  }
}