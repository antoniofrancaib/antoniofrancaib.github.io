# Deploy Edge Function via Supabase Dashboard (No Docker Required)

Since Docker Desktop isn't installed, you can deploy the function directly through the Supabase Dashboard.

## Steps:

1. **Go to Edge Functions in Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/smuiaaeluqklideovsqn/functions

2. **Create New Function**
   - Click "Create a new function"
   - Name it: `analyze-meal`

3. **Copy Function Code**
   - Open `supabase/functions/analyze-meal/index.ts` in your editor
   - Copy ALL the code from that file
   - Paste it into the function editor in the dashboard

4. **Set Environment Variable**
   - Before deploying, make sure you've set the `OPENAI_API_KEY` secret:
     - Go to Settings > Edge Functions > Secrets
     - Add secret: `OPENAI_API_KEY` = `your-openai-api-key-here`

5. **Deploy**
   - Click "Deploy" button in the dashboard

## Alternative: Install Docker Desktop

If you prefer using the CLI:

1. **Download Docker Desktop**: https://www.docker.com/products/docker-desktop/
2. **Install and start Docker Desktop**
3. **Then run**: `supabase functions deploy analyze-meal`

