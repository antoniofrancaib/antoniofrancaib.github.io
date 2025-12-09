# Quick Setup Instructions

## Step 1: Create Database Table

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/smuiaaeluqklideovsqn
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the contents of `setup.sql` file
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Verify the table was created by going to **Table Editor** and checking for `meal_entries`

## Step 2: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage** (left sidebar)
2. Click **New bucket**
3. Name it: `meal-images`
4. **Important**: Toggle **Public bucket** to ON (this allows public access to images)
5. Click **Create bucket**
6. (Optional) Go to **Policies** tab and ensure there's a policy allowing uploads

### Storage Policy (if needed)

If uploads fail, you may need to create a storage policy:

1. Go to Storage > Policies
2. Click **New Policy** for `meal-images` bucket
3. Select **For full customization**
4. Policy name: `Allow public uploads`
5. Allowed operation: `INSERT`
6. Policy definition:
   ```sql
   true
   ```
7. Click **Review** then **Save policy**

## Step 3: Set OpenAI API Key Secret

You have two options:

### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI if not already installed:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref smuiaaeluqklideovsqn
   ```

4. Set the OpenAI API key secret:
   ```bash
   supabase secrets set OPENAI_API_KEY=your-openai-api-key-here
   ```

### Option B: Using Supabase Dashboard

1. Go to **Settings** > **Edge Functions** > **Secrets**
2. Click **Add secret**
3. Name: `OPENAI_API_KEY`
4. Value: `your-openai-api-key-here`
5. Click **Save**

## Step 4: Deploy Edge Function

1. Make sure you're in the project root directory
2. Deploy the function:
   ```bash
   supabase functions deploy analyze-meal
   ```

   If you haven't linked the project yet:
   ```bash
   supabase link --project-ref smuiaaeluqklideovsqn
   supabase functions deploy analyze-meal
   ```

## Step 5: Test

1. Open your health dashboard
2. Go to the Food tab
3. Click the camera icon
4. Upload a food image
5. Wait for analysis (10-30 seconds)
6. Verify the meal appears with nutritional data

## Troubleshooting

### Function deployment fails
- Make sure you're logged in: `supabase login`
- Verify project ref is correct: `smuiaaeluqklideovsqn`
- Check that you're in the correct directory with `supabase/functions/analyze-meal/index.ts`

### Storage upload fails
- Verify bucket `meal-images` exists and is public
- Check storage policies allow INSERT operations

### Database insert fails
- Verify `meal_entries` table exists
- Check RLS policies allow INSERT
- Run the SQL from `setup.sql` again if needed

### OpenAI API errors
- Verify the secret is set: `supabase secrets list`
- Check your OpenAI account has credits and GPT-4 Vision access

