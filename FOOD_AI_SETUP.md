# Food Image to Nutrients Feature - Setup Guide

## Implementation Complete

The following has been implemented:

### 1. Supabase Edge Function
- **Location**: `supabase/functions/analyze-meal/index.ts`
- **Functionality**: 
  - Accepts base64 image uploads
  - Uploads images to Supabase Storage
  - Calls OpenAI GPT-4 Vision API for food recognition
  - Extracts nutritional information
  - Stores data in Supabase database
  - Returns structured nutrition data

### 2. Frontend Integration
- **Location**: `health/index.html`
- **Changes**:
  - Added Supabase client library
  - Replaced mock AI analysis with real API call
  - Added loading states and error handling
  - Updated UI to show processing status

## Your Setup Tasks

### Step 1: Supabase Setup

1. **Create Supabase Project**
   - Go to https://supabase.com and create a new project
   - Note your project URL and anon key from Settings > API

2. **Create Storage Bucket**
   - Go to Storage in Supabase Dashboard
   - Create a new bucket named `meal-images`
   - Set it to public access (or configure RLS as needed)

3. **Create Database Table**
   - Go to SQL Editor in Supabase Dashboard
   - Run this SQL:
   ```sql
   CREATE TABLE meal_entries (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     image_url TEXT,
     meal_name TEXT,
     calories NUMERIC,
     protein NUMERIC,
     carbs NUMERIC,
     fat NUMERIC,
     fiber NUMERIC,
     added_sugar NUMERIC,
     sodium NUMERIC,
     magnesium NUMERIC,
     iron NUMERIC,
     zinc NUMERIC,
     potassium NUMERIC,
     vitamin_b6 NUMERIC,
     created_at TIMESTAMP DEFAULT NOW(),
     date DATE DEFAULT CURRENT_DATE
   );
   ```

4. **Configure RLS (Row Level Security)**
   - Decide on your access policy (public read/write, authenticated only, etc.)
   - Configure RLS policies in the Authentication > Policies section

### Step 2: OpenAI API Setup

1. **Get OpenAI API Key**
   - Go to https://platform.openai.com
   - Create an account or sign in
   - Go to API Keys section
   - Create a new API key
   - Ensure you have access to GPT-4 Vision API (may require paid account)

### Step 3: Deploy Supabase Edge Function

1. **Install Supabase CLI** (if not already installed)
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link Your Project**
   ```bash
   supabase link --project-ref your-project-ref
   ```
   Find your project ref in your Supabase dashboard URL

4. **Set OpenAI API Key as Secret**
   ```bash
   supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
   ```
   Or set it in Supabase Dashboard: Settings > Edge Functions > Secrets

5. **Deploy the Function**
   ```bash
   supabase functions deploy analyze-meal
   ```

### Step 4: Update Frontend Configuration

1. **Open** `health/index.html`

2. **Find these lines** (around line 1748):
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```

3. **Replace with your actual values**:
   ```javascript
   const SUPABASE_URL = 'https://xxxxx.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key-here';
   ```

### Step 5: Test

1. Open your health dashboard: `https://antoniofrancaib.github.io/health/`
2. Click the camera icon in the Food tab
3. Upload a food image
4. Wait for AI analysis (may take 10-30 seconds)
5. Verify the meal is added with nutritional data

## Troubleshooting

### Function Not Found Error
- Make sure you've deployed the Edge Function: `supabase functions deploy analyze-meal`
- Verify the function name matches exactly: `analyze-meal`

### OpenAI API Errors
- Check that your API key is set correctly: `supabase secrets list`
- Verify you have GPT-4 Vision API access
- Check your OpenAI account has sufficient credits

### Storage Errors
- Verify the `meal-images` bucket exists and is accessible
- Check bucket permissions (should be public or have proper RLS)

### Database Errors
- Verify the `meal_entries` table exists with correct schema
- Check RLS policies allow inserts

### Frontend Errors
- Check browser console for detailed error messages
- Verify SUPABASE_URL and SUPABASE_ANON_KEY are set correctly
- Ensure Supabase client library is loaded (check Network tab)

## Cost Estimates

- **OpenAI GPT-4 Vision**: ~$0.01-0.03 per image analysis
- **Supabase Storage**: Free tier includes 1GB storage
- **Supabase Database**: Free tier includes 500MB database

## Notes

- The AI analysis may take 10-30 seconds depending on image size and API response time
- Image quality affects recognition accuracy - well-lit, clear photos work best
- The function stores images in Supabase Storage and nutrition data in the database
- All errors are logged to Supabase function logs (viewable in dashboard)

