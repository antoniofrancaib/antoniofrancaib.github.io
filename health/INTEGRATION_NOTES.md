## Health Image Capture - Current State & Next Steps

### Working today
- **Capture Health web flow** (`/health/capture.html`):
  - Opens camera on mobile, uploads the photo to `bright-api` Edge Function.
  - Edge Function uploads to Supabase Storage, then calls OpenAI Vision, stores nutrition in `meal_entries`.
  - Health dashboard loads today’s meals from Supabase; entries persist and can be deleted.

### In-progress / target flow
- **Capture Health Direct (iOS Shortcut)**:
  - Shortcut: Take Photo → Resize (≈1280px) → Convert to JPEG → Base64 encode → POST to `bright-api`.
  - Goal: quicker capture without opening the web page.
  - Current issue: OpenAI returns “Unknown meal” despite successful upload; we added logging to inspect AI response.

### What’s deployed in `bright-api`
- Uses signed URL for the uploaded image when calling OpenAI (avoids access issues).
- Added logging (truncated) for:
  - Signed image URL
  - OpenAI status
  - `aiContent` snippet
  - Parsed `meal_name`
- Fallback `meal_name` to “Analyzed Meal” if missing.

### What’s needed to continue
1) Redeploy `bright-api` after code changes (Supabase Edge Functions don’t auto-pull Git).
2) Run the **Capture Health Direct** Shortcut once, capture logs showing:
   - Signed URL (truncated)
   - OpenAI status and `aiContent` snippet
   - Parsed `meal_name`
3) If `aiContent` is empty or meal_name is missing, inspect the signed URL accessibility and consider modestly increasing image size (already ~1280px) or quality (~75–80%).

### Files to know
- `health/capture.html` — Web capture flow (working).
- `supabase/functions/analyze-meal/index.ts` — Edge Function (upload → signed URL → OpenAI → DB).

### Notes
- Untracked local files (images, debug docs) were left out intentionally.
- Dashboard loads meals from Supabase and supports delete; past nutrition is aggregated from Supabase by date.***

