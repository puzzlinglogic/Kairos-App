# Supabase Setup Instructions

## Step 1: Create Supabase Project ✅

1. Go to https://supabase.com
2. Sign in with GitHub
3. Click "New Project"
4. Fill in:
   - **Name**: `kairos-app`
   - **Database Password**: Generate and save it!
   - **Region**: Choose closest to you
   - **Plan**: Free
5. Click "Create new project" (takes ~2 min)

## Step 2: Run Database Schema 📊

Once your project is ready:

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire contents of `supabase-schema.sql` from this repo
4. Paste it into the SQL editor
5. Click **"Run"** (bottom right)

You should see:
- ✅ 4 tables created (profiles, entries, user_stats, patterns)
- ✅ RLS policies enabled
- ✅ Triggers and functions created

## Step 3: Configure Authentication 🔐

1. Go to **Authentication** → **Providers** (left sidebar)
2. Make sure **Email** is enabled (it should be by default)
3. Under **Email Auth** settings:
   - ✅ Enable email confirmations (optional for MVP)
   - Set **Site URL**: `http://localhost:5173` (for development)
4. Click **Save**

## Step 4: Create Storage Bucket 📸

1. Go to **Storage** (left sidebar)
2. Click **"New bucket"**
3. Name: `journal-photos`
4. **Public bucket**: ✅ Yes (so users can see their own photos)
5. Click **Create bucket**

Then set up storage policies:

1. Click on the `journal-photos` bucket
2. Click **"New policy"**
3. Choose **"Custom"**
4. Add these policies:

**Policy 1: Users can upload their own photos**
```sql
CREATE POLICY "Users can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'journal-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 2: Users can view their own photos**
```sql
CREATE POLICY "Users can view own photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'journal-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 3: Users can delete their own photos**
```sql
CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'journal-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Step 5: Get Your API Keys 🔑

1. Go to **Settings** → **API** (left sidebar)
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 6: Add Keys to Your App ⚙️

1. Open `.env.local` in this repo
2. Replace the placeholder values:
```env
VITE_SUPABASE_URL=https://your-actual-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```
3. Save the file

## Step 7: Test Connection 🧪

Run the dev server:
```bash
npm run dev
```

If everything is configured correctly, you should be able to:
- Sign up for an account
- Sign in
- Create journal entries

## Troubleshooting 🔧

**Error: "Missing Supabase environment variables"**
- Make sure `.env.local` has the correct values
- Restart your dev server after adding env vars

**Error: "new row violates row-level security policy"**
- Check that RLS policies were created correctly in Step 2
- Run the schema.sql again if needed

**Can't upload photos**
- Verify the storage bucket is public
- Check that storage policies were created in Step 4

## Next Steps 🚀

Once Supabase is configured:
1. Build authentication pages (Sign up / Sign in)
2. Create the daily entry form
3. Build the timeline view
4. Add streak counter logic

---

**Need help?** Check the Supabase docs: https://supabase.com/docs
