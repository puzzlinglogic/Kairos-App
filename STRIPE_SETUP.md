# Stripe Integration Setup Guide

Your Stripe subscription system is built! Here's what you need to do to activate it:

## 🎯 Overview

The subscription flow:
1. **Free journaling** - All users can journal and upload photos
2. **777 unlock** - After 7 entries AND 7 days, pattern detection unlocks
3. **Paywall** - User must subscribe ($3.33/month) to access AI pattern analysis
4. **Subscription management** - Users can manage their subscription in Settings

---

## 📋 Step 1: Run Database Migration

Run the SQL migration in your Supabase dashboard to add subscription fields:

1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `supabase-subscription-migration.sql`
3. Run the query
4. Verify the new columns exist in the `profiles` table

---

## 🔑 Step 2: Create Stripe Account & Product

### 2.1 Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete business verification (or use test mode for development)

### 2.2 Create Product & Price
1. In Stripe Dashboard → Products → Create product
2. Product name: **Kairos Premium**
3. Description: **AI-powered pattern detection and insights**
4. Pricing:
   - **Price:** $3.33 USD
   - **Billing period:** Monthly
   - **Recurring**
5. Click "Save product"
6. **Copy the Price ID** (starts with `price_...`) - you'll need this!

### 2.3 Get API Keys
1. Go to Developers → API keys
2. Copy your **Publishable key** (starts with `pk_test_...` or `pk_live_...`)
3. Copy your **Secret key** (starts with `sk_test_...` or `sk_live_...`)
4. **Keep the Secret key safe!** Never commit it to git.

---

## 🌐 Step 3: Set Up Environment Variables

### 3.1 Local Development (.env.local)
Add these to your `.env.local` file:

```bash
# Stripe Keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PRICE_ID=price_...
STRIPE_SECRET_KEY=sk_test_...

# App URL
VITE_APP_URL=http://localhost:5173

# Supabase Service Role Key (for webhooks)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**To get SUPABASE_SERVICE_ROLE_KEY:**
- Supabase Dashboard → Settings → API → `service_role` key (keep secret!)

### 3.2 Vercel Production
Add the same environment variables to Vercel:

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable (use production keys for live deployment):
   - `VITE_STRIPE_PUBLISHABLE_KEY`
   - `VITE_STRIPE_PRICE_ID`
   - `STRIPE_SECRET_KEY`
   - `VITE_APP_URL` (e.g., https://kairosjournal.io)
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `VITE_SUPABASE_URL` (already exists)
   - `VITE_ANTHROPIC_API_KEY` (already exists)
3. Redeploy your site

---

## 🔔 Step 4: Set Up Stripe Webhooks

Webhooks keep your database in sync with Stripe subscription events.

### 4.1 Get Webhook Endpoint URL
Your webhook endpoint is:
- **Local:** `http://localhost:5173/api/stripe-webhook`
- **Production:** `https://your-domain.vercel.app/api/stripe-webhook`

### 4.2 Create Webhook in Stripe
1. Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. **Endpoint URL:** Your production URL from above
4. **Events to listen to:**
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. **Copy the Signing Secret** (starts with `whsec_...`)

### 4.3 Add Webhook Secret to Environment
Add to `.env.local` and Vercel:
```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🧪 Step 5: Test the Integration

### Test Flow:
1. Create a test user account
2. Create 7+ journal entries
3. Manually update the first entry's `created_at` to 8 days ago (in Supabase)
4. Refresh timeline - should see "777 Unlocked"
5. Click "Discover Your Patterns"
6. Should see paywall with "Subscribe Now" button
7. Click "Subscribe Now"
8. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
9. Complete checkout
10. Should redirect back with success message
11. Refresh - should now be able to generate patterns!

### Test Subscription Management:
1. Go to Settings page
2. Should see "Premium" badge
3. Click "Manage Subscription"
4. Should open Stripe Customer Portal
5. Test canceling/reactivating subscription

---

## 🚀 Step 6: Go Live

When ready for production:

1. **Activate your Stripe account** (complete verification)
2. **Switch to live mode** in Stripe Dashboard (toggle in top right)
3. **Create production product & price** (same $3.33 pricing)
4. **Get live API keys** (Developers → API keys)
5. **Update Vercel environment variables** with live keys
6. **Create production webhook** pointing to your live domain
7. **Redeploy on Vercel**

---

## 🎨 Customization Options

### Change Price
Edit `src/lib/stripe.ts`:
```typescript
export const PRICING = {
  monthly: 3.33, // Change this
  currency: 'USD',
  angelNumber: '333',
  features: [...] // Add/remove features
};
```

### Add Annual Plan
Create a new price in Stripe with annual billing, then update the subscribe page to show both options.

---

## ⚠️ Important Notes

1. **Never commit secret keys** - They're in `.env.local` which is gitignored
2. **Service role key is powerful** - Only use it server-side (API routes)
3. **Test mode vs Live mode** - Stripe has separate test/live environments
4. **Webhook security** - The webhook verifies signatures to prevent fraud
5. **Customer portal** - Stripe handles all subscription management UI

---

## 🐛 Troubleshooting

**Checkout fails:**
- Check API keys are correct in Vercel
- Verify Price ID matches Stripe product
- Check browser console for errors

**Webhook not working:**
- Verify webhook URL is correct and accessible
- Check webhook signing secret matches
- View webhook logs in Stripe Dashboard

**Subscription status not updating:**
- Check webhook is receiving events
- Verify service role key has correct permissions
- Check Supabase logs for errors

**"Generate Patterns" still requires subscription after payment:**
- Wait 30 seconds for webhook to process
- Refresh the page
- Check subscription_status in profiles table

---

## 📚 Resources

- [Stripe Checkout Docs](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## ✅ Checklist

- [ ] Database migration completed
- [ ] Stripe account created
- [ ] Product and price created ($3.33/month)
- [ ] API keys copied
- [ ] Environment variables added (local and Vercel)
- [ ] Webhook endpoint created
- [ ] Webhook secret added to environment
- [ ] Test subscription flow works
- [ ] Production keys ready for launch

**You're all set! The Stripe integration is complete.** 🎉
