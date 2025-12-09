# Setup Verification Checklist

## ✅ Completed
- [x] Supabase project linked
- [x] Edge Function deployed (`analyze-meal`)
- [x] Frontend configured with Supabase credentials

## ⚠️ Remaining Setup Tasks

### 1. Create Database Table
**Status**: ⚠️ Needs to be done

**Steps**:
1. Go to: https://supabase.com/dashboard/project/smuiaaeluqklideovsqn/sql/new
2. Open `supabase/setup.sql` file
3. Copy ALL the SQL code
4. Paste into SQL Editor
5. Click **Run** (or Cmd/Ctrl + Enter)
6. Verify: Go to Table Editor and check for `meal_entries` table

### 2. Create Storage Bucket
**Status**: ⚠️ Needs to be done

**Steps**:
1. Go to: https://supabase.com/dashboard/project/smuiaaeluqklideovsqn/storage/buckets
2. Click **New bucket**
3. Name: `meal-images`
4. **Important**: Toggle **Public bucket** to ON
5. Click **Create bucket**

### 3. Set OpenAI API Key Secret
**Status**: ⚠️ Needs to be done

**Steps**:
1. Go to: https://supabase.com/dashboard/project/smuiaaeluqklideovsqn/settings/functions
2. Scroll to **Secrets** section
3. Click **Add secret**
4. Name: `OPENAI_API_KEY`
5. Value: `your-openai-api-key-here` (get from OpenAI platform)
6. Click **Save**

## 🧪 Testing

Once all 3 tasks above are complete:

1. Open your health dashboard: https://antoniofrancaib.github.io/health/
2. Navigate to the **Food** tab
3. Click the **camera icon** (📷)
4. Upload a food image
5. Wait 10-30 seconds for analysis
6. Verify the meal appears with nutritional data

## 🔍 Troubleshooting

### "Function not found" error
- Verify function is deployed: https://supabase.com/dashboard/project/smuiaaeluqklideovsqn/functions
- Check function name is exactly: `analyze-meal`

### "Storage upload error"
- Verify `meal-images` bucket exists and is public
- Check bucket policies allow INSERT

### "Database insert error"
- Verify `meal_entries` table exists
- Run `setup.sql` again if needed
- Check RLS policies allow INSERT

### "OpenAI API key not configured"
- Verify secret is set: Settings > Edge Functions > Secrets
- Check secret name is exactly: `OPENAI_API_KEY`

### "Failed to analyze image"
- Check OpenAI account has credits
- Verify GPT-4 Vision API access
- Check function logs: https://supabase.com/dashboard/project/smuiaaeluqklideovsqn/functions/analyze-meal/logs

