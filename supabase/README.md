# Supabase Edge Functions Setup

This directory contains the Supabase Edge Function for analyzing meal images.

## Setup Instructions

### 1. Install Supabase CLI (if not already installed)

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link your project

```bash
supabase link --project-ref your-project-ref
```

You can find your project ref in the Supabase dashboard URL: `https://supabase.com/dashboard/project/your-project-ref`

### 4. Set Environment Variables

Set the OpenAI API key as a secret in Supabase:

```bash
supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
```

Or set it through the Supabase Dashboard:
- Go to Settings > Edge Functions > Secrets
- Add `OPENAI_API_KEY` with your OpenAI API key

### 5. Deploy the Function

```bash
supabase functions deploy analyze-meal
```

### 6. Test the Function

You can test the function locally:

```bash
supabase functions serve analyze-meal
```

Or test the deployed function through the Supabase dashboard or your frontend.

## Function Endpoint

Once deployed, the function will be available at:
```
https://your-project-ref.supabase.co/functions/v1/analyze-meal
```

## Database Setup

Make sure you've created the `meal_entries` table in your Supabase database with the schema specified in the plan.

## Storage Setup

Make sure you've created a storage bucket named `meal-images` with public access enabled.

