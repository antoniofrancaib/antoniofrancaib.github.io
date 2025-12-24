import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface QuickMealInput {
  presetId: string
  customName?: string
  date?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from JWT
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse request body
    const mealData: QuickMealInput = await req.json()

    if (!mealData.presetId) {
      return new Response(
        JSON.stringify({ error: 'Preset ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get preset meal data
    const { data: preset, error: presetError } = await supabaseClient
      .from('meal_presets')
      .select('*')
      .eq('id', mealData.presetId)
      .eq('user_id', user.id)
      .single()

    if (presetError || !preset) {
      return new Response(
        JSON.stringify({ error: 'Preset meal not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Determine date
    const targetDate = mealData.date
      ? new Date(mealData.date)
      : new Date()

    const dateString = targetDate.toISOString().split('T')[0]

    // Create meal name (use custom name if provided, otherwise preset name)
    const mealName = mealData.customName || preset.name

    // Insert meal entry
    const { data: mealEntry, error: mealError } = await supabaseClient
      .from('meal_entries')
      .insert({
        user_id: user.id,
        meal_name: mealName,
        calories: preset.calories,
        protein: preset.protein,
        carbs: preset.carbs,
        fat: preset.fat,
        fiber: preset.fiber,
        sugar: preset.sugar,
        alcohol: preset.alcohol,
        caffeine: preset.caffeine,
        source: 'preset',
        date: dateString
      })
      .select()
      .single()

    if (mealError) {
      console.error('Error saving quick meal:', mealError)
      return new Response(
        JSON.stringify({ error: 'Failed to save meal' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: mealEntry.id,
          meal_name: mealEntry.meal_name,
          nutrition: {
            calories: preset.calories,
            protein: preset.protein,
            carbs: preset.carbs,
            fat: preset.fat,
            fiber: preset.fiber,
            sugar: preset.sugar,
            alcohol: preset.alcohol,
            caffeine: preset.caffeine
          },
          date: dateString,
          source: 'preset',
          preset_used: preset.name
        },
        message: 'Quick meal added successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
