import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WellnessInput {
  energy: number
  mood: number
  clarity: number
  notes?: string
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
    const wellnessData: WellnessInput = await req.json()

    // Validate input
    const { energy, mood, clarity } = wellnessData

    if (!energy || !mood || !clarity) {
      return new Response(
        JSON.stringify({ error: 'Energy, mood, and clarity scores are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate ranges
    if (energy < 1 || energy > 10 || mood < 1 || mood > 10 || clarity < 1 || clarity > 10) {
      return new Response(
        JSON.stringify({ error: 'All scores must be between 1 and 10' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Determine date (today by default, or specified date)
    const targetDate = wellnessData.date
      ? new Date(wellnessData.date)
      : new Date()

    // Format date for database
    const dateString = targetDate.toISOString().split('T')[0]

    // Insert or update wellness entry
    const { data, error } = await supabaseClient
      .from('wellness_entries')
      .upsert({
        user_id: user.id,
        date: dateString,
        energy_score: energy,
        mood_score: mood,
        clarity_score: clarity,
        notes: wellnessData.notes || null,
        source: 'shortcut'
      }, {
        onConflict: 'user_id,date'
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving wellness data:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to save wellness data' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Calculate overall wellness score
    const overallScore = ((energy + mood + clarity) / 30) * 100

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: data.id,
          date: dateString,
          energy_score: data.energy_score,
          mood_score: data.mood_score,
          clarity_score: data.clarity_score,
          overall_score: Math.round(overallScore),
          notes: data.notes
        },
        message: 'Wellness metrics recorded successfully'
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
