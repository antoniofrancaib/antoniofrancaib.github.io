# Security Notes - API Keys

## Current Status

### ✅ Safe (No Action Needed)

1. **Supabase Anon Key in Frontend** (`health/index.html`)
   - **Status**: SAFE - This is intentional and expected
   - **Why**: Supabase's anon key is designed to be public and used client-side
   - **Protection**: Your data is protected by Row Level Security (RLS) policies, not by hiding the key
   - **Action**: None needed - this is the correct architecture

2. **OpenAI API Key**
   - **Status**: SAFE - Never exposed in code
   - **Location**: Only stored as a secret in Supabase Dashboard
   - **Action**: None needed

### ⚠️ Fixed (Action Taken)

1. **Edge Function Hardcoded Keys** (`supabase/functions/analyze-meal/index.ts`)
   - **Status**: FIXED - Removed hardcoded fallback keys
   - **Previous Issue**: Had hardcoded Supabase URL and anon key as fallbacks
   - **Fix**: Now only uses environment variables provided by Supabase
   - **Action**: Already fixed in latest commit

## What Was Exposed

### In Git History (Commit 600ae9f)
- Supabase anon key was hardcoded in Edge Function as a fallback
- This commit has been fixed, but the key is still in git history

### Recommendation

Since the Supabase anon key is meant to be public anyway, **no rotation is necessary**. However, if you want to be extra cautious:

1. **Rotate Supabase Anon Key** (optional):
   - Go to Supabase Dashboard > Settings > API
   - Generate a new anon key
   - Update `health/index.html` with the new key
   - Update any other places using the old key

2. **Monitor Usage**:
   - Check Supabase Dashboard for any unusual activity
   - Monitor OpenAI API usage for unexpected calls

## Best Practices Going Forward

1. ✅ **Never commit** OpenAI API keys or service account keys
2. ✅ **Use environment variables** for all sensitive keys in Edge Functions
3. ✅ **Use Supabase secrets** for backend-only keys (like OpenAI API key)
4. ✅ **Supabase anon key** can be public (it's designed for client-side use)
5. ✅ **Use RLS policies** to protect data, not by hiding keys

## Current Configuration

- **Frontend**: Uses Supabase anon key (public, safe)
- **Edge Function**: Uses environment variables (no hardcoded keys)
- **OpenAI API**: Stored as Supabase secret (secure)

