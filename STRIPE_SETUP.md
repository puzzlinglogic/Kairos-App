# Stripe Integration Setup Guide (Beginner-Friendly)

Welcome! This guide will walk you through setting up Stripe payments step-by-step. No prior experience needed.

---

## ✅ Step 1: Database Migration (DONE!)

You've already completed this step! The new columns are in your `profiles` table. Great job! 🎉

---

## 🔑 Step 2: Create Your Stripe Account

### 2.1 Sign Up for Stripe

1. Go to **https://stripe.com** in your browser
2. Click **"Sign up"** or **"Start now"** (big button, usually top right)
3. Fill out the form:
   - Email address
   - Full name
   - Country (United States)
   - Password
4. Click **"Create account"**
5. Check your email and verify your account (click the link Stripe sends you)

**What you'll see:** After logging in, you'll be in the Stripe Dashboard. It looks like a control panel with a sidebar on the left.

### 2.2 Skip Onboarding (For Now)

- Stripe might show you a welcome wizard asking about your business
- You can click **"Skip for now"** or **"I'll do this later"**
- We're going to use **Test Mode** first anyway (no real money)

### 2.3 Make Sure You're in Test Mode

**IMPORTANT:** Look at the top-right corner of the Stripe Dashboard.

- You should see a toggle switch that says **"Test mode"** or **"View test data"**
- Make sure it's **ON** (usually shows as purple/blue when active)
- Test mode lets you test everything without real credit cards or real money

---

## 💳 Step 3: Create Your Product in Stripe

This is where you define what users are buying ($3.33/month subscription).

### 3.1 Navigate to Products

1. Look at the **left sidebar** in Stripe Dashboard
2. Find and click **"Products"** (it might be under "Product catalog" or just in the main menu)
3. You'll see a page that says "Products" at the top
4. Click the blue **"+ Add product"** or **"Create product"** button

### 3.2 Fill Out Product Details

You'll see a form with several fields:

**Name:**
- Type: `Kairos Premium`

**Description:** (optional but recommended)
- Type: `AI-powered pattern detection and insights for your journal`

**Pricing:**
- Click **"Add pricing"** if not already expanded
- **Pricing model:** Select "Standard pricing" (should be default)
- **Price:** Type `3.33`
- **Currency:** Select `USD` (United States Dollar)
- **Billing period:** Select `Monthly` or `Recurring` → then choose `month`

**What it should look like:**
```
Price: $3.33 USD / month
```

**Other settings:**
- Leave everything else as default
- You can ignore "Tax code", "Metadata", etc. for now

### 3.3 Save the Product

1. Click the blue **"Add product"** or **"Save product"** button at the bottom
2. You'll be taken to the product details page

### 3.4 Copy the Price ID (VERY IMPORTANT!)

After saving, you'll see your product page. Look for:

**A section called "Pricing"** or you'll see your price listed:
- It will show: `$3.33 per month`
- Below or next to it, there's an **ID** that starts with `price_`
- Example: `price_1ABcDeFgHiJkLmNo`

**How to copy it:**
1. Find the Price ID (starts with `price_`)
2. Hover over it - you should see a **copy icon** (two overlapping squares)
3. Click the copy icon OR manually select the text and copy it
4. **SAVE THIS SOMEWHERE!** Paste it in a note temporarily - you'll need it soon

**Can't find it?**
- Look for "API ID" or "Price ID" on the product page
- It should be visible right on the pricing section
- If you still can't find it, click on the actual price amount and it might show details

---

## 🔐 Step 4: Get Your Stripe API Keys

API keys are like passwords that let your website talk to Stripe.

### 4.1 Navigate to API Keys

1. In the left sidebar, find **"Developers"** (might be near the bottom)
2. Click on **"Developers"**
3. You'll see a submenu - click **"API keys"**

### 4.2 Find Your Keys

You'll see a page with two keys:

**1. Publishable key** (safe to expose publicly)
- Starts with `pk_test_` (in test mode) or `pk_live_` (in live mode)
- You'll see text like: `pk_test_51ABcDe...` (long string)

**2. Secret key** (NEVER share this!)
- Starts with `sk_test_` (in test mode) or `sk_live_` (in live mode)
- Might be hidden with `••••••••` - click **"Reveal test key"** to see it
- Looks like: `sk_test_51ABcDe...` (long string)

### 4.3 Copy Both Keys

**Copy Publishable Key:**
1. Find the Publishable key
2. Click the copy icon next to it
3. Paste it somewhere safe (like a text file)

**Copy Secret Key:**
1. Click **"Reveal test key"** if it's hidden
2. Click the copy icon next to the Secret key
3. Paste it somewhere safe
4. ⚠️ **IMPORTANT:** Never share this key or commit it to GitHub!

**What you should have now:**
- Price ID (starts with `price_`)
- Publishable Key (starts with `pk_test_`)
- Secret Key (starts with `sk_test_`)

---

## 🔐 Step 5: Get Your Supabase Service Role Key

We need one more key from Supabase.

### 5.1 Go to Supabase Dashboard

1. Go to **https://supabase.com**
2. Log in to your account
3. Click on your **Kairos project** to open it

### 5.2 Navigate to API Settings

1. On the left sidebar, click **"Settings"** (gear icon, near bottom)
2. In the Settings menu, click **"API"**

### 5.3 Copy Service Role Key

Scroll down to the section called **"Project API keys"**

You'll see several keys:
- `anon` `public` - you already have this one
- `service_role` - this is the one we need!

**Find service_role:**
1. Look for the row labeled `service_role`
2. The key is hidden with `••••••••`
3. Click **"Reveal"** or the eye icon to show it
4. Click the **copy icon** to copy it
5. Save it somewhere safe

⚠️ **IMPORTANT:** This key is VERY powerful - never share it or put it in client-side code!

---

## 📝 Step 6: Add Environment Variables Locally

Now we'll add all those keys to your local development environment.

### 6.1 Open Your Project in Code Editor

1. Open your `Kairos-App` folder in VS Code (or your code editor)
2. You should see all your project files

### 6.2 Find or Create .env.local File

**Look for a file called `.env.local` in the root folder** (same level as `package.json`)

**If it exists:**
- Open it - you should already see `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**If it doesn't exist:**
- Create a new file in the root folder
- Name it exactly: `.env.local` (note the dot at the beginning!)

### 6.3 Add the New Variables

Add these lines to your `.env.local` file (replace the `...` with your actual keys):

```bash
# Existing Supabase vars (keep these)
VITE_SUPABASE_URL=your_existing_url
VITE_SUPABASE_ANON_KEY=your_existing_key

# NEW: Stripe Keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PRICE_ID=price_...
STRIPE_SECRET_KEY=sk_test_...

# NEW: Supabase Service Role Key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NEW: App URL (for local development)
VITE_APP_URL=http://localhost:5173
```

**Replace:**
- `pk_test_...` with your actual Publishable Key
- `price_...` with your actual Price ID
- `sk_test_...` with your actual Secret Key
- `your_service_role_key` with your Supabase service role key

**Example of what it might look like:**
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51N123ABcxyz789
VITE_STRIPE_PRICE_ID=price_1N456DEFabc012
STRIPE_SECRET_KEY=sk_test_51N789GHIdef345
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_URL=http://localhost:5173
```

### 6.4 Save the File

- Save `.env.local` (Cmd+S or Ctrl+S)
- ⚠️ Make sure this file is **NOT committed to git** (it should already be in `.gitignore`)

---

## ☁️ Step 7: Add Environment Variables to Vercel

Now we need to add the same keys to Vercel so they work in production.

### 7.1 Go to Vercel Dashboard

1. Go to **https://vercel.com**
2. Log in
3. Find your **Kairos-App** project
4. Click on it to open the project dashboard

### 7.2 Open Environment Variables Settings

1. Click **"Settings"** tab at the top
2. In the left sidebar, click **"Environment Variables"**

### 7.3 Add Each Variable

You'll add each variable one by one. For each one:

**For `VITE_STRIPE_PUBLISHABLE_KEY`:**
1. Click **"Add New"** button
2. **Key:** Type exactly: `VITE_STRIPE_PUBLISHABLE_KEY`
3. **Value:** Paste your Stripe Publishable Key (starts with `pk_test_`)
4. **Environments:** Check all three boxes: Production, Preview, Development
5. Click **"Save"**

**Repeat for each of these:**

**2. VITE_STRIPE_PRICE_ID**
- Key: `VITE_STRIPE_PRICE_ID`
- Value: Your Price ID (starts with `price_`)
- Environments: All three ✓

**3. STRIPE_SECRET_KEY**
- Key: `STRIPE_SECRET_KEY`
- Value: Your Secret Key (starts with `sk_test_`)
- Environments: All three ✓

**4. SUPABASE_SERVICE_ROLE_KEY**
- Key: `SUPABASE_SERVICE_ROLE_KEY`
- Value: Your Supabase service role key
- Environments: All three ✓

**5. VITE_APP_URL**
- Key: `VITE_APP_URL`
- Value: Your production URL (e.g., `https://kairosjournal.io` or your Vercel URL like `https://kairos-app.vercel.app`)
- Environments: All three ✓

**Note:** You might already have `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_ANTHROPIC_API_KEY` - keep those!

### 7.4 Redeploy

After adding all variables:
1. Go back to the **"Deployments"** tab
2. Find your latest deployment
3. Click the **three dots** (`...`) menu on the right
4. Click **"Redeploy"**
5. Confirm the redeploy

**Why?** Vercel needs to rebuild with the new environment variables.

---

## 🔔 Step 8: Set Up Stripe Webhooks

Webhooks let Stripe tell your app when subscriptions are created, canceled, etc.

### 8.1 Navigate to Webhooks in Stripe

1. Go back to **Stripe Dashboard**
2. In left sidebar, click **"Developers"**
3. Click **"Webhooks"**
4. You'll see a page that says "Webhooks" at the top

### 8.2 Add Endpoint

1. Click **"Add endpoint"** or **"+ Add an endpoint"** button
2. You'll see a form

### 8.3 Enter Your Webhook URL

**Endpoint URL:** This is where Stripe will send updates.

**For production:**
- Type: `https://your-domain.com/api/stripe-webhook`
- Replace `your-domain.com` with your actual domain
- Examples:
  - `https://kairosjournal.io/api/stripe-webhook`
  - `https://kairos-app.vercel.app/api/stripe-webhook`

**Don't use localhost** - Stripe can't reach your local machine!

### 8.4 Select Events to Listen To

Scroll down to **"Select events to listen to"** or **"Events to send"**

1. Click **"Select events"** button
2. You'll see a HUGE list of events
3. Search or scroll to find these 4 events (check the box next to each):

**Find and CHECK these:**
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_failed`

**How to find them:**
- Use the search box: type "customer.subscription" to filter
- Then search "invoice.payment" for the last one

### 8.5 Save the Endpoint

1. After selecting all 4 events, click **"Add endpoint"** at the bottom
2. You'll be taken to the webhook details page

### 8.6 Copy the Signing Secret

On the webhook details page:

1. Look for a section called **"Signing secret"**
2. It shows as `whsec_••••••••••`
3. Click **"Reveal"** or the eye icon to show it
4. Click **copy** icon to copy it
5. It starts with `whsec_` - save this somewhere!

---

## 🔐 Step 9: Add Webhook Secret to Environment

### 9.1 Add to .env.local

Open your `.env.local` file again and add:

```bash
STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret_here
```

Save the file.

### 9.2 Add to Vercel

1. Go back to Vercel → Your Project → Settings → Environment Variables
2. Click **"Add New"**
3. **Key:** `STRIPE_WEBHOOK_SECRET`
4. **Value:** Your webhook signing secret (starts with `whsec_`)
5. **Environments:** Check all three ✓
6. Click **"Save"**

### 9.3 Redeploy Again

1. Go to Deployments tab
2. Redeploy your latest deployment (three dots menu → Redeploy)

---

## 🎯 Step 10: Test Everything!

Now let's make sure it all works.

### 10.1 Test Locally First

1. Open Terminal in your project folder
2. Run: `npm run dev`
3. Open `http://localhost:5173` in your browser
4. Sign in to your account

### 10.2 Get to 777 Unlock (The Shortcut Way)

**Since you don't want to wait 7 days, we'll cheat:**

**Create 7 journal entries:**
1. Click "New Entry" and write anything (can be test text)
2. Save it
3. Repeat 7 times total

**Modify the database to fake 7 days passing:**
1. Go to **Supabase Dashboard**
2. Click **"Table Editor"** (left sidebar)
3. Click on the **"entries"** table
4. Find your **first entry** (the oldest one)
5. Click the **pencil icon** to edit that row
6. Find the **`created_at`** column
7. Change the date to **8 days ago**
   - If today is 2025-11-18, change it to: `2025-11-10 12:00:00+00`
   - Format: `YYYY-MM-DD HH:MM:SS+00`
8. Click **"Save"**

**Refresh your Timeline:**
1. Go back to your app
2. Refresh the page
3. You should now see **"777 - Patterns Unlocked"** badge
4. Click **"Discover Your Patterns"** button

### 10.3 Test the Subscription Flow

**You should see the paywall:**
- It says "Subscribe to Access Your Patterns"
- Shows $3.33/month
- Has a "Subscribe Now" button

**Click "Subscribe Now":**
1. You'll be redirected to Stripe Checkout
2. You'll see a payment form

**Use Stripe Test Card:**
- Card number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/25`)
- CVC: Any 3 digits (e.g., `123`)
- Name: Any name
- Email: Your test email

**Complete Payment:**
1. Click "Subscribe" or "Pay"
2. You should be redirected back to your app
3. URL should end with `?success=true`
4. You'll see "Welcome to Premium!"

**Wait 5-10 seconds, then click "Refresh Page"**

### 10.4 Test Pattern Generation

After refreshing:
1. You should now see the main Patterns page
2. Click **"Generate Patterns"** button
3. Wait while AI analyzes (might take 20-30 seconds)
4. You should see pattern cards appear!

### 10.5 Test Settings Page

1. Click **"Settings"** in the nav bar
2. You should see:
   - Your email
   - "Premium" badge
   - "Manage Subscription" button
3. Click **"Manage Subscription"**
4. Stripe Customer Portal should open (where users can cancel)

---

## ✅ You're Done!

If all of that worked, you're completely set up! 🎉

### What Happens Next:

**For the next week:**
- Use your app naturally
- Journal daily
- When you hit 777 legitimately, you'll be prompted to subscribe
- Everything should work smoothly

**When ready to go live (accept real money):**
1. Complete Stripe account verification (provide business info, tax info)
2. Switch Stripe to "Live Mode" (toggle in top right)
3. Create the SAME product in Live Mode ($3.33/month)
4. Get new LIVE API keys (will start with `pk_live_` and `sk_live_`)
5. Update Vercel environment variables with live keys
6. Create new webhook for live mode
7. You're live!

---

## 🆘 Troubleshooting

**"Stripe failed to load" error:**
- Check that `VITE_STRIPE_PUBLISHABLE_KEY` is set correctly in Vercel
- Make sure you redeployed after adding it

**Payment succeeds but still shows paywall:**
- Wait 30 seconds and refresh
- Check webhook is receiving events (Stripe Dashboard → Webhooks → click your endpoint → see Recent deliveries)
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct in Vercel

**"Generate Patterns" doesn't work:**
- Check `VITE_ANTHROPIC_API_KEY` is set in Vercel
- Check browser console for errors

**Can't find Stripe webhook events:**
- Make sure you selected all 4 events when creating webhook
- Try editing the webhook and re-selecting the events

---

## 📞 Need Help?

If you get stuck:
1. Check Stripe Dashboard → Developers → Logs (shows API errors)
2. Check Vercel → Functions tab (shows serverless function logs)
3. Check browser console (F12 → Console tab)
4. The error messages usually tell you exactly what's wrong!

You've got this! 💪
