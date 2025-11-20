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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    // Get user's Stripe customer ID before deleting
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    // Delete from Stripe if customer exists
    if (profile?.stripe_customer_id) {
      try {
        await stripe.customers.del(profile.stripe_customer_id);
      } catch (stripeError: any) {
        // Log but don't fail if Stripe deletion fails
        console.error('Error deleting Stripe customer:', stripeError);
      }
    }

    // Delete user's entries first (in case no cascade)
    await supabase.from('entries').delete().eq('user_id', userId);

    // Delete user's patterns
    await supabase.from('patterns').delete().eq('user_id', userId);

    // Delete user's profile
    await supabase.from('profiles').delete().eq('id', userId);

    // Delete user from auth.users
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      throw authError;
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error deleting account:', error);
    return res.status(500).json({ error: error.message });
  }
}
