# KAIROS APP - HANDOVER DOCUMENTATION

**Last Updated:** November 19, 2025
**Version:** MVP 1.0
**Status:** Production-Ready
**Developer Handover Package**

---

## Table of Contents
1. [Project Philosophy](#project-philosophy)
2. [Architectural Decisions](#architectural-decisions)
3. [The 'Ghosts' (Fragile Parts & Known Issues)](#the-ghosts-fragile-parts--known-issues)
4. [Current Context](#current-context)
5. [Style Guide](#style-guide)
6. [Quick Start Guide](#quick-start-guide)
7. [Key File Reference](#key-file-reference)

---

## Project Philosophy

### Core Purpose

**Kairos** is a spiritual journaling application that helps users discover meaningful patterns in their life through AI-powered analysis. The name "Kairos" refers to the ancient Greek concept of the "right moment" - the qualitative, opportune time for self-reflection and growth.

### The Vision

Users journal daily about their thoughts, feelings, and experiences. After reaching the **777 milestone** (7 entries AND 7 days of journaling), they unlock AI pattern detection that reveals temporal, emotional, behavioral, and cognitive patterns they may not have noticed themselves.

### Non-Negotiables

These are the sacred principles that define Kairos. **Do not compromise on these:**

1. **Angel Number Theming**: The entire UX is built around angel number symbolism:
   - 777 = Spiritual Awakening (pattern unlock requirement)
   - $3.33/month subscription (333 = Creative Growth)
   - Milestone celebrations at 111, 222, 333, 444, 555, 666, 777, 888, 999 entries
   - This is NOT just aesthetic - it's the core identity

2. **Quality of Pattern Insights**: The AI analysis must be:
   - Specific (not generic horoscope-level advice)
   - Actionable (users should learn something they can act on)
   - Evidence-based (reference actual entry content)
   - Two-tier approach: Quick analysis (Haiku) feeds into deep analysis (Sonnet)

3. **User Data Privacy**:
   - Row-Level Security (RLS) on ALL database tables
   - Users can ONLY see their own data
   - No analytics tracking, no selling user data
   - Spiritual journaling is deeply personal

4. **Spiritual Aesthetic**:
   - Dreamy, ethereal design (glass-morphism, soft gradients)
   - Calming color palette (purples, golds, pinks)
   - Serif fonts for journal content (Crimson Pro)
   - Sans fonts for UI elements (Inter)
   - Floating animated shapes in background

5. **Free Core Experience**:
   - Journaling is ALWAYS free
   - Unlimited entries, photos, streak tracking
   - Pattern detection is premium ($3.33/month)
   - Never paywall the journaling itself

### Design Philosophy

- **Mobile-first**: Most journaling happens on phones in quiet moments
- **Low-friction**: New entry in 2 taps from timeline
- **Encouraging**: Celebrate streaks and milestones, never shame missed days
- **Mystical but not cheesy**: Take the spiritual elements seriously, avoid kitsch

---

## Architectural Decisions

### Why This Tech Stack?

#### Frontend: React 19 + TypeScript + Vite

**Decision Rationale:**
- **React 19**: Latest features (Compiler ready, modern hooks), massive ecosystem
- **TypeScript**: Strict typing prevents bugs in complex data flow (Stripe, Supabase, AI)
- **Vite**: Lightning-fast HMR during development, optimized production builds
- **NO framework** (Next.js, etc.): Simpler deployment, Vercel serverless functions for API routes

**Trade-offs:**
- ✅ Fast iteration, simple mental model, easy onboarding
- ❌ Manual setup for SSR (not needed for this app)

#### Backend: Supabase (PostgreSQL + Auth + Storage)

**Decision Rationale:**
- **PostgreSQL**: Relational data (entries, patterns, profiles) with JSONB for flexible pattern storage
- **Row-Level Security**: Enforces data isolation without backend logic
- **Supabase Auth**: Email/password with session management, no OAuth needed yet
- **Supabase Storage**: Photo uploads with built-in compression

**Why not Firebase/AWS?**
- Firebase: NoSQL not ideal for relational journal entries + patterns
- AWS: Too much DevOps overhead for MVP, Supabase is batteries-included

**Trade-offs:**
- ✅ RLS eliminates entire class of security bugs, automatic API generation
- ❌ Vendor lock-in (migration to self-hosted Postgres possible but painful)

#### Payments: Stripe

**Decision Rationale:**
- Industry standard, excellent documentation
- Subscription management built-in (recurring $3.33/month)
- Customer portal for self-service cancellation
- Webhooks for subscription state sync

**Trade-offs:**
- ✅ Reliable, scales automatically, handles PCI compliance
- ❌ 2.9% + $0.30 per transaction (acceptable for $3.33 price point)

#### AI: Anthropic Claude API

**Decision Rationale:**
- **Two-tier analysis approach**:
  - **Tier 1 (Haiku)**: Fast, cheap word frequency + theme extraction
  - **Tier 2 (Sonnet)**: Deep, expensive narrative pattern insights
- Claude excels at nuanced text analysis (better than GPT for this use case)
- JSON mode for structured pattern output

**Why Client-Side AI Calls?**
- **Simplicity**: No backend API proxy needed
- **Cost**: Direct API calls, no server compute
- **Security**: API key exposed (VITE_ANTHROPIC_API_KEY) but limited to pattern gen, read-only on user's own data
- **Trade-off**: Key visible in browser (acceptable risk for MVP, consider backend proxy later)

**Trade-offs:**
- ✅ Simple architecture, fast iteration
- ❌ API key exposure (mitigated by RLS), rate limiting on client IP

#### Deployment: Vercel

**Decision Rationale:**
- Zero-config deployment from Git
- Serverless functions for Stripe API routes (`/api/*`)
- Automatic HTTPS, CDN, preview deployments
- Environment variable management

**Trade-offs:**
- ✅ No DevOps, scales automatically, generous free tier
- ❌ Cold starts on serverless functions (acceptable for low-traffic MVP)

### Complex Design Patterns Explained

#### 1. Two-Tier AI Analysis System

**File:** `src/lib/ai.ts`, `src/lib/patterns.ts`

**The Pattern:**
```typescript
// Tier 1: Quick analysis (Haiku) extracts themes + word frequency
const quickAnalysis = await analyzePatternsQuick(entries);

// Tier 2: Deep analysis (Sonnet) uses Tier 1 results + full entries
const insights = await analyzePatternsDeep(entries, quickAnalysis);
```

**Why?**
- Haiku is 10x cheaper than Sonnet
- Extract common words/themes once (Tier 1), then Sonnet focuses on deeper patterns (Tier 2)
- Reduces token usage by ~60% compared to single Sonnet call
- Total cost: ~$0.15-0.30 per pattern generation vs. ~$0.50 single-tier

**Known Limitation:**
- If Tier 1 fails, Tier 2 cannot proceed (cascading failure)
- JSON parsing is regex-based (`content.text.match(/\{[\s\S]*\}/)`), could break if AI returns wrapped JSON

#### 2. Stripe Webhook Subscription Sync

**File:** `api/stripe-webhook.ts`

**The Pattern:**
```typescript
// Webhook receives Stripe events → Updates Supabase profiles table
case 'customer.subscription.updated': {
  const subscription = event.data.object as Stripe.Subscription;
  const userId = subscription.metadata.supabase_user_id; // ← Critical link

  await supabase.from('profiles').update({
    subscription_status: subscription.status,
    subscription_tier: subscription.status === 'active' ? 'premium' : 'free',
    // ...
  }).eq('id', userId);
}
```

**Why Webhooks Instead of Polling?**
- Instant updates when user subscribes/cancels
- Stripe is source of truth for payment state
- No background job polling needed

**Critical Dependencies:**
1. Webhook secret (`STRIPE_WEBHOOK_SECRET`) must match Stripe dashboard
2. `metadata.supabase_user_id` must be set on checkout session creation
3. Vercel endpoint `/api/stripe-webhook` must be publicly accessible

**Ghost Warning:**
- If webhook delivery fails, Supabase profile is out of sync with Stripe
- User may pay but still see free tier
- Manual fix: Re-trigger webhook from Stripe dashboard or sync via script

#### 3. Row-Level Security (RLS) Pattern

**Files:** `supabase-schema.sql`, all `src/lib/*.ts` files

**The Pattern:**
```sql
-- Example: entries table RLS policy
CREATE POLICY "Users can view own entries"
  ON entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries"
  ON entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**Why?**
- **Zero-trust architecture**: Even if client code has bugs, DB enforces isolation
- No backend authorization logic needed
- Supabase auto-passes `auth.uid()` from session token to policies

**How It Works:**
1. User signs in → Supabase session token stored in browser
2. All `supabase.from('entries').select()` calls include session token
3. PostgreSQL checks RLS policies using `auth.uid()`
4. Returns only rows where `user_id` matches `auth.uid()`

**Non-Negotiable:** NEVER disable RLS on user data tables (profiles, entries, patterns)

#### 4. Streak Calculation Trigger

**File:** `supabase-schema.sql` (lines ~150-200)

**The Pattern:**
```sql
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate streak based on last_entry_date vs. NEW entry created_at
  -- Streak continues if entry is on consecutive day OR same day
  -- Streak breaks if gap > 1 day
  -- Update longest_streak if current_streak exceeds it
END;
$$;

CREATE TRIGGER on_entry_created
  AFTER INSERT ON entries
  FOR EACH ROW
  EXECUTE FUNCTION update_user_streak();
```

**Why Database Trigger, Not Application Logic?**
- Guaranteed consistency (even if client forgets to call updateStreak)
- Atomic transaction (entry insert + stats update succeed/fail together)
- No race conditions (concurrent inserts handled by DB)

**Ghost Warning:**
- Streak logic assumes user timezone = server timezone (UTC)
- If user journals at 11:59 PM local time, might be next day UTC → breaks streak
- **TODO:** Add timezone support to user profile, calculate streaks in user's timezone

#### 5. Photo Upload + Compression Flow

**File:** `src/lib/storage.ts`

**The Pattern:**
```typescript
export const uploadPhoto = async (userId: string, file: File): Promise<string> => {
  // 1. Compress image client-side (max 1200px width, 0.8 quality)
  const compressed = await compressImage(file);

  // 2. Upload to Supabase Storage (user-specific path)
  const filePath = `${userId}/${Date.now()}-${file.name}`;
  await supabase.storage.from('journal-photos').upload(filePath, compressed);

  // 3. Get public URL
  const { data } = supabase.storage.from('journal-photos').getPublicUrl(filePath);
  return data.publicUrl;
};
```

**Why Client-Side Compression?**
- Reduces upload bandwidth (critical for mobile users)
- Reduces storage costs (compressed images ~80% smaller)
- Faster uploads → better UX

**Ghost Warning:**
- Compression uses browser Canvas API (not supported in old browsers)
- Large images (>20MB) may crash on low-memory devices
- **Fallback:** If compression fails, upload original (see try-catch in storage.ts)

---

## The 'Ghosts' (Fragile Parts & Known Issues)

These are the parts of the codebase that will bite you if you're not careful. Document them, handle with care, and consider refactoring when time permits.

### 1. Stripe Webhook TypeScript Workaround

**Location:** `api/stripe-webhook.ts:79-84`

**The Issue:**
```typescript
case 'invoice.payment_failed': {
  const invoice = event.data.object as Stripe.Invoice;
  // HACK: Type definitions don't include 'subscription' but it exists at runtime
  const subscription = (invoice as any).subscription;
  const subscriptionId = typeof subscription === 'string' ? subscription : subscription?.id;
  // ...
}
```

**Why It's Fragile:**
- Stripe's TypeScript definitions lag behind their actual API
- `invoice.subscription` exists in API responses but not in `@types/stripe`
- Using `as any` bypasses type safety

**When It Breaks:**
- If Stripe updates webhook payload structure
- If `invoice.payment_failed` event stops including subscription data
- TypeScript won't catch it → runtime error

**How to Fix:**
- Monitor Stripe API changelog for breaking changes
- Test webhook locally using Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe-webhook`
- Consider updating `@types/stripe` or filing PR to DefinitelyTyped

**Mitigation in Place:**
- Defensive check: `typeof subscription === 'string'` handles both string ID and object
- Error logging in catch block will surface issues

### 2. AI JSON Parsing Brittleness

**Location:** `src/lib/ai.ts:75-79`, `src/lib/ai.ts:153-158`

**The Issue:**
```typescript
const content = message.content[0];
if (content.type === 'text') {
  const jsonMatch = content.text.match(/\{[\s\S]*\}/); // ← Regex-based JSON extraction
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;
  }
}
throw new Error('Failed to parse response');
```

**Why It's Fragile:**
- AI might return JSON wrapped in markdown code blocks: `` ```json\n{...}\n``` ``
- AI might include explanatory text before/after JSON
- Regex `\{[\s\S]*\}` greedily matches first `{` to last `}` (could include extra text)

**When It Breaks:**
- Claude changes default response format
- Prompt doesn't clearly specify "return ONLY JSON"
- Nested braces in description text confuse regex

**Recent Failure Example (Hypothetical):**
```
AI Response: "Here's the analysis:\n```json\n{\"wordFrequency\": [...]}\n```\nLet me know if you need more!"
Regex matches: "Here's the analysis:\n```json\n{\"wordFrequency\": [...]}\n```\nLet me know if you need more!" (doesn't parse)
```

**How to Fix:**
- Use Claude's new JSON mode (structured outputs) - **TODO: Upgrade to JSON mode**
- Improve regex: `/```json\s*(\{[\s\S]*?\})\s*```/` to extract from code blocks
- Add fallback parsing logic

**Mitigation in Place:**
- Try-catch around JSON.parse
- Error message logged to console
- User sees "Failed to generate patterns" error

### 3. Client-Side API Key Exposure

**Location:** `src/lib/ai.ts:3-11`

**The Issue:**
```typescript
const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY; // ← Visible in browser bundle
export const anthropic = new Anthropic({
  apiKey: apiKey || '',
  dangerouslyAllowBrowser: true, // ← Required for client-side usage
});
```

**Why It's Fragile:**
- `VITE_ANTHROPIC_API_KEY` is embedded in JavaScript bundle (public)
- Anyone can extract key from DevTools and call Anthropic API directly
- Rate limits apply to the KEY, not the user

**Risk Assessment:**
- **Medium risk**: API key has no spending limits configured
- **Mitigated by:** Supabase RLS (users can only read their own entries), so scrapers can't steal journal data
- **Worst case:** Bad actor generates patterns for their own fake data → costs us $$$

**How to Fix:**
- Move AI calls to backend serverless function (`/api/generate-patterns`)
- Frontend calls backend with user ID, backend uses server-side API key
- **Trade-off:** Adds complexity, increases latency (2 round trips instead of 1)

**TODO for Production:**
- Set Anthropic API key spending limit ($100/month)
- Monitor usage in Anthropic dashboard
- Consider backend proxy if abuse detected

### 4. Subscription Webhook Delay Window

**Location:** `api/stripe-webhook.ts`, `src/pages/PatternsPage.tsx:157-181`

**The Issue:**
```typescript
// User subscribes via Stripe → Redirected to /app/patterns?success=true
// But webhook hasn't fired yet → Profile still shows 'free' tier

if (unlocked && !hasActiveSubscription) {
  const success = searchParams.get('success') === 'true';
  return (
    <div>
      <p>Your subscription is being activated. Refresh the page in a moment...</p>
      <button onClick={() => window.location.reload()}>Refresh Page</button>
    </div>
  );
}
```

**Why It's Fragile:**
- Stripe webhook delivery is asynchronous (typically 1-5 seconds, can be minutes)
- User redirected immediately after checkout but webhook hasn't updated Supabase yet
- Creates confusing "limbo" state: paid but still locked out

**When It Breaks:**
- High webhook delivery latency (Vercel cold start, Stripe API slowdown)
- Webhook fails entirely (wrong secret, endpoint down)
- User rage-refreshes 50 times, still sees paywall

**How to Fix (Ideal):**
- Use Stripe checkout session ID to verify payment server-side immediately
- Backend endpoint: `POST /api/verify-subscription { sessionId }` → Updates profile immediately
- No waiting for webhook (webhook becomes redundancy/backup)

**Mitigation in Place:**
- Show encouraging message: "Your subscription is being activated..."
- Refresh button to retry loading profile
- Most users wait 2-3 seconds and it works

**TODO:**
- Add checkout session verification endpoint
- Or: Poll Supabase profile every 2 seconds after redirect, auto-refresh on status change

### 5. 777 Unlock Edge Cases

**Location:** `src/lib/helpers.ts:45-52`

**The Issue:**
```typescript
export const hasUnlockedPatterns = (
  totalEntries: number,
  firstEntryDate: string | null
): boolean => {
  if (!firstEntryDate) return false;
  const daysSinceFirst = calculateDaysSinceFirstEntry(firstEntryDate);
  return totalEntries >= 7 && daysSinceFirst >= 7; // ← Both conditions must be true
};
```

**Edge Cases:**
1. **User writes 7 entries in one day**:
   - ✅ totalEntries = 7
   - ❌ daysSinceFirst = 0
   - **Result:** Not unlocked (correct behavior)

2. **User writes 1 entry/day for 10 days, deletes 4 old entries**:
   - ✅ daysSinceFirst = 10
   - ❌ totalEntries = 6
   - **Result:** Not unlocked (entries were deleted)
   - **Fragile:** If we add soft-delete (deleted_at column), this breaks

3. **User writes entry, waits 7 days, writes 6 more entries same day**:
   - ✅ totalEntries = 7
   - ✅ daysSinceFirst = 7
   - **Result:** Unlocked (correct)

**Ghost Warning:**
- No soft-delete implemented, so deleting entries reduces `totalEntries`
- If we add soft-delete later, must update query: `.eq('deleted_at', null)`

**Philosophical Question:**
- Should 777 be "7 entries over at least 7 days" (current)?
- Or "7 entries on 7 different days" (stricter)?
- Current implementation allows cheating (7 entries on day 1, day 8, day 15... = 21 total days but only 3 journaling days)

### 6. Image Compression Failure Modes

**Location:** `src/lib/storage.ts` (compressImage function)

**The Issue:**
- Client-side image compression uses browser Canvas API
- Not all images compress successfully (corrupt files, exotic formats, huge dimensions)
- Current implementation: try to compress, if fails → upload original

**Failure Modes:**
1. **File >25MB**: Supabase storage rejects (default limit)
2. **Corrupt image**: Canvas fails to load, compress fails, upload fails → user gets error
3. **Exotic format** (HEIC, AVIF): Browser may not support → compression fails → upload original (might exceed size limit)

**When It Breaks:**
- User uploads 40MB HEIC from iPhone → compression fails, original upload fails
- User sees generic "Upload failed" error (not helpful)

**How to Fix:**
- Validate file size BEFORE compression: `if (file.size > 25_000_000) throw new Error('File too large')`
- Convert HEIC to JPEG server-side (or use library like `heic2any`)
- Better error messages: "Image too large (max 25MB)" vs "Upload failed"

**Mitigation in Place:**
- Try-catch around upload logic
- Error message shown to user
- Most users upload <5MB JPEG/PNG from phone camera (works fine)

### 7. Timezone-Naive Streak Calculation

**Location:** `supabase-schema.sql` (update_user_streak function)

**The Issue:**
- All timestamps stored as UTC (Supabase default)
- Streak calculation compares dates in UTC
- User in timezone UTC-8 journals at 11:30 PM local → stored as 7:30 AM next day UTC → breaks streak

**Example Failure:**
```
User in Los Angeles (UTC-8):
Day 1: Journal at 11:30 PM (Dec 1, 11:30 PM PST = Dec 2, 7:30 AM UTC)
Day 2: Journal at 11:45 PM (Dec 2, 11:45 PM PST = Dec 3, 7:45 AM UTC)

Database sees:
Dec 2, 7:30 AM UTC (Day 1)
Dec 3, 7:45 AM UTC (Day 2)
✅ Consecutive days → Streak continues

But if user journals Dec 1, 11:30 PM then waits until Dec 3, 11:30 PM:
Dec 2, 7:30 AM UTC (Day 1)
Dec 4, 7:30 AM UTC (Day 2 skipped)
❌ Gap detected → Streak broken
```

**Why This Is Critical:**
- Breaks user trust if streak "randomly" resets
- Especially bad for users near midnight in non-UTC timezones

**How to Fix:**
- Add `timezone` column to profiles table (e.g., 'America/Los_Angeles')
- Update streak calculation to convert UTC timestamps to user timezone before comparing dates
- Use PostgreSQL `AT TIME ZONE` in trigger function

**Why Not Fixed Yet:**
- MVP simplicity (assumes most users journal during daytime)
- Adds complexity to streak logic
- Requires user to set timezone (extra friction in signup)

**TODO for V2:**
- Implement timezone support
- Default to browser timezone on signup: `Intl.DateTimeFormat().resolvedOptions().timeZone`

---

## Current Context

### What We Were Working On Most Recently

**Git History Analysis (Last 10 Commits):**

1. **5499fa2** - Add vercel.json for SPA routing configuration
   - **Why:** Vercel was returning 404 on direct navigation to `/app/timeline`
   - **Fix:** All routes except `/api/*` now rewrite to `index.html` (SPA behavior)

2. **e9b794d** - Fix Invoice.subscription TypeScript error in webhook handler
   - **Why:** TypeScript complained about `invoice.subscription` not existing in types
   - **Fix:** Used `(invoice as any).subscription` workaround (see Ghost #1)

3. **955ad9e** - Fix text color visibility on subscription pricing page
   - **Why:** Purple text on purple gradient was unreadable
   - **Fix:** Changed to dark text for better contrast

4. **9b3eb85** - Fix Stripe checkout to use direct URL redirect instead of deprecated redirectToCheckout
   - **Why:** Stripe deprecated `stripe.redirectToCheckout()` client-side method
   - **Fix:** Backend now returns checkout session URL, frontend does `window.location.href = url`

5. **e5acf1d** - Fix Stripe API version compatibility issues
   - **Why:** Stripe Webhook constructor required specific API version
   - **Fix:** Explicitly set `apiVersion: '2025-10-29.clover'` in all Stripe SDK calls

**Before That:**
- Implemented full Stripe subscription flow (checkout, webhooks, customer portal)
- Implemented AI pattern detection (two-tier Haiku + Sonnet)
- Added photo upload functionality
- Built core journaling features (timeline, new entry, streak tracking)
- Set up Supabase auth and database

### Immediate Next Steps

**If this were my project, here's what I'd do next:**

#### High Priority (Week 1)

1. **Add Environment Variable Validation on Startup**
   - **Why:** Silent failures when API keys are missing (AI just doesn't work)
   - **How:** In `src/main.tsx`, check all required env vars and show error modal if missing
   - **Files:** `src/main.tsx`

2. **Improve AI JSON Parsing**
   - **Why:** Current regex is brittle (see Ghost #2)
   - **How:** Use Claude's JSON mode or add markdown code block extraction
   - **Files:** `src/lib/ai.ts`

3. **Add Subscription Verification Endpoint**
   - **Why:** Eliminate webhook delay window (see Ghost #4)
   - **How:** `POST /api/verify-subscription` checks Stripe checkout session, updates profile immediately
   - **Files:** New file `api/verify-subscription.ts`, update `src/pages/SubscribePage.tsx`

4. **Set Anthropic API Spending Limit**
   - **Why:** Client-side API key exposure risk (see Ghost #3)
   - **How:** Log into Anthropic dashboard → Set $100/month limit
   - **Non-code:** Dashboard configuration

#### Medium Priority (Week 2-3)

5. **Add Timezone Support**
   - **Why:** Streak calculation broken for late-night journalers (see Ghost #7)
   - **How:** Add `timezone` to profiles, update `update_user_streak()` function
   - **Files:** `supabase-schema.sql`, `src/lib/entries.ts`

6. **Implement Pattern Regeneration Limits**
   - **Why:** Users can spam "Refresh Patterns" → expensive API calls
   - **How:** Allow 1 regeneration per day, store `last_pattern_generated_at` in `user_stats`
   - **Files:** `src/lib/patterns.ts`, `src/pages/PatternsPage.tsx`

7. **Add Image Validation + Better Error Messages**
   - **Why:** Upload failures are cryptic (see Ghost #6)
   - **How:** Validate file size/type before upload, show specific errors
   - **Files:** `src/lib/storage.ts`, `src/pages/NewEntryPage.tsx`

8. **Write E2E Tests for Subscription Flow**
   - **Why:** Stripe integration is critical revenue path, no tests currently
   - **How:** Playwright tests with Stripe test mode
   - **New files:** `tests/subscription.spec.ts`

#### Low Priority (Week 4+)

9. **Migrate AI Calls to Backend**
   - **Why:** Remove client-side API key exposure (see Ghost #3)
   - **How:** New endpoint `/api/generate-patterns`, move AI logic server-side
   - **Files:** New `api/generate-patterns.ts`, refactor `src/lib/patterns.ts`

10. **Add Pattern Sharing (Optional Feature)**
    - **Why:** Users may want to share beautiful pattern cards
    - **How:** Generate PNG of pattern card, allow download/share
    - **New feature:** Significant scope

11. **Add Export Journal Data**
    - **Why:** User data portability, trust-building
    - **How:** Export all entries as JSON or PDF
    - **New files:** `api/export-journal.ts`

### Known Bugs to Fix

**Minor bugs that don't break core flows:**

1. **Floating shapes clip outside viewport on mobile landscape**
   - **Repro:** Rotate phone to landscape → purple shapes partially off-screen
   - **Fix:** Add `overflow-x: hidden` to body or constrain shape positions

2. **Long journal entries cause horizontal scroll in timeline cards**
   - **Repro:** Write entry with very long word (no spaces) → card overflows
   - **Fix:** Add `overflow-wrap: break-word` to entry text

3. **Angel number milestones show old count on timeline page**
   - **Repro:** Write entry #111 → Timeline shows "110 entries" until refresh
   - **Fix:** Invalidate query cache after creating entry (or refetch stats)

4. **Subscription status polling doesn't stop after success**
   - **Repro:** Subscribe, wait for webhook, subscription activates → polling continues forever
   - **Fix:** Clear interval once `hasActiveSubscription === true`

5. **Photo uploads don't show loading state**
   - **Repro:** Upload large photo → no visual feedback during compression/upload
   - **Fix:** Add progress spinner next to photo input

---

## Style Guide

### Code Style Principles

**These are the conventions used throughout the codebase. Follow them for consistency.**

#### TypeScript

- **Strict mode enabled** (`tsconfig.app.json` has `"strict": true`)
- **No implicit any**: All variables/parameters must be typed
- **Interfaces over types** for object shapes: `interface UserProfile { ... }`
- **Type aliases for unions**: `type SubscriptionStatus = 'active' | 'canceled' | ...`

**Example:**
```typescript
// ✅ Good
interface EntryFormData {
  entryText: string;
  guidedResponse?: string;
  photo?: File;
}

// ❌ Avoid
const formData: any = { ... };
```

#### React Components

- **Functional components ONLY** (no class components)
- **React.FC type** for all components
- **Props interface naming**: `ComponentNameProps`
- **Destructure props** in function signature

**Example:**
```typescript
// ✅ Good
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', onClick, children }) => {
  return <button className={`btn-${variant}`} onClick={onClick}>{children}</button>;
};

// ❌ Avoid
export const Button = (props: any) => {
  return <button className={`btn-${props.variant}`}>{props.children}</button>;
};
```

#### Hooks

- **Use hooks at top level** (never inside conditionals/loops)
- **Custom hooks prefix with `use`**: `useAuth`, `usePatterns`
- **Prefer `useEffect` cleanup** for subscriptions/timers

**Example:**
```typescript
// ✅ Good
useEffect(() => {
  const timer = setInterval(() => { ... }, 1000);
  return () => clearInterval(timer); // Cleanup
}, []);

// ❌ Avoid
useEffect(() => {
  setInterval(() => { ... }, 1000); // No cleanup → memory leak
}, []);
```

#### Styling (Tailwind CSS)

- **Utility classes ONLY** (no custom CSS files except `index.css` for global styles)
- **Custom color palette**: Use `kairos-*` colors, not Tailwind defaults
  - `kairos-dark` - Dark purple text (#1C132E)
  - `kairos-purple` - Accent purple (#2A1E4C)
  - `kairos-gold` - Highlight gold (#E9C46A)
  - `kairos-light` - Off-white background (#F8F5F1)
  - `kairos-border` - Light purple border (#DAD0E7)
  - `kairos-pink` - Soft pink accent (#EFD7DA)

- **Glass-morphism pattern**: `card-glass` class (defined in `index.css`)
  ```css
  .card-glass {
    background: rgba(248, 245, 241, 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(218, 208, 231, 0.5);
  }
  ```

- **Button classes**: `btn-primary`, `btn-secondary`, `btn-ghost` (defined in `index.css`)

**Example:**
```tsx
// ✅ Good
<div className="card-glass p-6 rounded-2xl">
  <h2 className="text-2xl font-serif text-kairos-dark mb-4">Title</h2>
  <button className="btn-primary">Click Me</button>
</div>

// ❌ Avoid
<div style={{ background: 'rgba(248,245,241,0.6)' }}>
  <h2 style={{ color: '#1C132E' }}>Title</h2>
</div>
```

#### Async/Await & Error Handling

- **Always use try-catch** around async operations
- **Log errors to console** (no error tracking service yet)
- **Show user-friendly error messages** (not raw error.message)

**Example:**
```typescript
// ✅ Good
const handleSubmit = async () => {
  try {
    await createEntry(entryText);
    navigate('/app/timeline');
  } catch (error) {
    console.error('Failed to create entry:', error);
    setError('Unable to save your entry. Please try again.');
  }
};

// ❌ Avoid
const handleSubmit = async () => {
  await createEntry(entryText); // Uncaught promise rejection
};
```

#### Supabase Queries

- **Use typed responses**: `as EntryType[]`, not `as any`
- **Check for errors explicitly**: `if (error) throw error;`
- **Use RLS** (never query with service role key on client)

**Example:**
```typescript
// ✅ Good
export const getUserEntries = async (userId: string): Promise<Entry[]> => {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Entry[];
};

// ❌ Avoid
const { data } = await supabase.from('entries').select('*'); // No type, no error check
```

#### File Organization

- **Group by feature, not by type**
  - ✅ `src/lib/entries.ts` (all entry-related logic)
  - ❌ `src/services/`, `src/utils/`, `src/api/` (generic buckets)

- **One component per file** (except tightly coupled sub-components)
- **Colocate types** with usage (interfaces in same file as component)

**Example File Structure:**
```
src/
├── pages/           ← One page per route
│   ├── TimelinePage.tsx
│   └── PatternsPage.tsx
├── components/      ← Reusable UI components
│   ├── Button.tsx
│   └── Card.tsx
├── contexts/        ← React contexts
│   └── AuthContext.tsx
├── lib/            ← Business logic libraries
│   ├── entries.ts  ← Entry CRUD
│   ├── patterns.ts ← Pattern generation
│   └── ai.ts       ← AI API calls
```

#### Naming Conventions

- **Components**: PascalCase (`TimelinePage`, `AppNav`)
- **Functions**: camelCase (`getUserEntries`, `hasUnlockedPatterns`)
- **Constants**: SCREAMING_SNAKE_CASE (`ANGEL_NUMBERS`, `STRIPE_PRICE_ID`)
- **Files**: Match export name (`TimelinePage.tsx`, `entries.ts`)

#### Comments

- **Use JSDoc for exported functions**
  ```typescript
  /**
   * Generate AI patterns for a user (runs both Tier 1 and Tier 2 analysis)
   */
  export const generatePatterns = async (userId: string): Promise<PatternInsight[]> => { ... }
  ```

- **Explain "why", not "what"**
  ```typescript
  // ✅ Good
  // Use Haiku first to reduce Sonnet token usage by ~60%
  const quickAnalysis = await analyzePatternsQuick(entries);

  // ❌ Avoid
  // Call the quick analysis function
  const quickAnalysis = await analyzePatternsQuick(entries);
  ```

- **Mark hacks/workarounds**
  ```typescript
  // HACK: Stripe types don't include subscription on invoice (but it exists at runtime)
  const subscription = (invoice as any).subscription;
  ```

#### Testing (Currently None - Add These)

**When you add tests, follow these conventions:**

- **Unit tests**: `filename.test.ts` (in same directory as source)
- **E2E tests**: `tests/feature-name.spec.ts`
- **Test naming**: `describe('Component', () => { it('should do X when Y', ...) })`

---

## Quick Start Guide

### For a New Developer

**You're taking over this project. Here's how to get up and running in 30 minutes:**

#### 1. Prerequisites

- Node.js 18+ (`node -v`)
- npm or pnpm
- Supabase account (free tier)
- Stripe account (test mode)
- Anthropic API key

#### 2. Clone & Install

```bash
git clone https://github.com/puzzlinglogic/Kairos-App.git
cd Kairos-App
npm install
```

#### 3. Set Up Supabase

Follow `SUPABASE_SETUP.md` (comprehensive guide). Summary:

1. Create new project at supabase.com
2. Run `supabase-schema.sql` in SQL editor
3. Run `supabase-subscription-migration.sql`
4. Create storage bucket `journal-photos` with RLS policies
5. Copy project URL + anon key

#### 4. Set Up Stripe

Follow `STRIPE_SETUP.md` (comprehensive guide). Summary:

1. Create Stripe account (test mode)
2. Create product: "Kairos Premium" at $3.33/month
3. Copy price ID (starts with `price_`)
4. Copy secret key (starts with `sk_test_`)
5. Set up webhook endpoint (after deploying to Vercel)

#### 5. Get Anthropic API Key

1. Go to console.anthropic.com
2. Create API key
3. Set spending limit ($100/month recommended)

#### 6. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in values:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PRICE_ID=price_...
STRIPE_SECRET_KEY=sk_test_...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (for webhooks)
VITE_APP_URL=http://localhost:5173
STRIPE_WEBHOOK_SECRET=whsec_... (get after webhook setup)
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

#### 7. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173

#### 8. Test Locally

1. Sign up for account
2. Create 7 entries over 7 days (or cheat: manually update `user_stats` in Supabase)
3. Go to Patterns page → Should prompt for subscription
4. Use Stripe test card: `4242 4242 4242 4242`, any future expiry, any CVC
5. Subscribe → Patterns should unlock

#### 9. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard
# (all the same as .env, but for production)
```

#### 10. Set Up Stripe Webhook (Production)

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/stripe-webhook`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy webhook signing secret → Add to Vercel env vars as `STRIPE_WEBHOOK_SECRET`

### Common Development Tasks

**Add a new page:**
1. Create `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`: `<Route path="/app/newpage" element={<NewPage />} />`
3. Add navigation link in `src/components/AppNav.tsx`

**Add a new database table:**
1. Write migration SQL
2. Run in Supabase SQL editor
3. Add RLS policies (users can only access own data)
4. Add TypeScript type in `src/lib/supabase.ts`
5. Create CRUD functions in `src/lib/table-name.ts`

**Update AI prompts:**
- Edit `src/lib/ai.ts` functions `analyzePatternsQuick` and `analyzePatternsDeep`
- Prompts are string templates - be specific about output format
- Test with real journal data, not Lorem Ipsum

**Debug Stripe webhooks locally:**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to http://localhost:5173/api/stripe-webhook

# Trigger test events
stripe trigger customer.subscription.created
```

---

## Key File Reference

### Critical Files You'll Edit Frequently

| File | Purpose | When to Edit |
|------|---------|--------------|
| `src/lib/ai.ts` | AI analysis prompts & logic | Improving pattern quality, changing AI models |
| `src/lib/patterns.ts` | Pattern generation flow | Adding pattern types, regeneration limits |
| `src/pages/PatternsPage.tsx` | Patterns UI | Subscription paywall, pattern display |
| `api/stripe-webhook.ts` | Stripe webhook handler | Handling new subscription events |
| `src/contexts/AuthContext.tsx` | Auth state & methods | Adding auth features (password reset, etc.) |
| `src/lib/entries.ts` | Entry CRUD operations | Adding entry fields (mood, tags, etc.) |
| `supabase-schema.sql` | Database schema | Adding tables, columns, indexes |
| `src/index.css` | Global styles | Adding Tailwind utilities, button variants |

### Configuration Files

| File | Purpose | Don't Touch Unless... |
|------|---------|----------------------|
| `package.json` | Dependencies | Adding new npm packages |
| `vite.config.ts` | Vite build config | Changing build output, adding plugins |
| `tailwind.config.js` | Tailwind theme | Adding colors, fonts, animations |
| `tsconfig.app.json` | TypeScript config | Changing strict mode, target ES version |
| `vercel.json` | Vercel routing | Adding new API routes, changing SPA behavior |

### Reference-Only Files (Read, Don't Edit)

| File | Purpose |
|------|---------|
| `SUPABASE_SETUP.md` | Supabase setup guide for new developers |
| `STRIPE_SETUP.md` | Stripe setup guide for new developers |
| `README.md` | Generic React/Vite template info (not updated) |

---

## Final Notes for Handover

### What Makes This Project Special

This isn't just another CRUD app. **Kairos is about helping people understand themselves** through AI-powered pattern recognition. The spiritual/mystical theming (angel numbers, ethereal design) is core to the user experience - it makes journaling feel meaningful, not mechanical.

### What I'm Proud Of

1. **Two-tier AI analysis** - Saves 60% on API costs while maintaining quality
2. **RLS-first security** - Zero-trust architecture, no backend auth logic needed
3. **Thoughtful UX** - Streak celebrations, milestone tracking, encouraging language
4. **Clean codebase** - No "temp" hacks (except documented Ghosts), strong typing

### What I'd Do Differently

1. **Add tests from day one** - Stripe integration is too critical to have zero test coverage
2. **Backend AI proxy** - Client-side API key was a shortcut, should've used serverless function
3. **Timezone support earlier** - Streak bugs are trust-killers, should've been MVP scope
4. **Better error tracking** - Console.log isn't enough, should integrate Sentry or similar

### Advice for Maintainer

- **Don't break the 777 unlock flow** - It's the core motivation loop
- **Monitor Anthropic API costs** - Pattern generation is $0.20-0.30 per user, could spike with growth
- **Respect the vibe** - Keep the mystical/spiritual aesthetic, users chose Kairos for this
- **Read the Ghosts section** - Those are the landmines, handle with care

### Questions?

If you're the developer taking over, feel free to add notes to this doc as you learn the codebase. Update the "Current Context" section when you finish major features. Keep the Ghosts section updated - **document your workarounds so the next person doesn't repeat them**.

Good luck, and may the patterns be ever in your favor. ✨

---

**Handover Complete** | Created: November 19, 2025 | For: Senior Developer/AI Agent
