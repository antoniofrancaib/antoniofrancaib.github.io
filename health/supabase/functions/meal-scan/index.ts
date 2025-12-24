import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MealScanInput {
  image: string // Base64 encoded image
  mealName?: string
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
    const scanData: MealScanInput = await req.json()

    if (!scanData.image) {
      return new Response(
        JSON.stringify({ error: 'Image data is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Upload image to storage
    const imageData = scanData.image.replace(/^data:image\/[a-z]+;base64,/, '')
    const imageBuffer = Uint8Array.from(atob(imageData), c => c.charCodeAt(0))

    const fileName = `${user.id}/${Date.now()}_meal.jpg`

    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('meal-photos')
      .upload(fileName, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload image' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get public URL for the uploaded image
    const { data: { publicUrl } } = supabaseClient.storage
      .from('meal-photos')
      .getPublicUrl(fileName)

    // TODO: Implement AI meal analysis here
    // For now, we'll use a mock response with estimated nutrition
    // In production, you'd call OpenAI Vision API or similar

    const mockNutritionData = {
      meal_name: scanData.mealName || 'Analyzed Meal',
      calories: 450,
      protein: 25,
      carbs: 45,
      fat: 18,
      fiber: 8,
      sugar: 12,
      sodium: 680,
      potassium: 1200,
      calcium: 180,
      iron: 3.2,
      vitamin_c: 45,
      vitamin_d: 2.5,
      magnesium: 85,
      zinc: 2.8,
      omega_3: 1.2
    }

    // Determine date
    const targetDate = scanData.date
      ? new Date(scanData.date)
      : new Date()

    const dateString = targetDate.toISOString().split('T')[0]

    // Save meal to database
    const { data: mealData, error: mealError } = await supabaseClient
      .from('meal_entries')
      .insert({
        user_id: user.id,
        meal_name: mockNutritionData.meal_name,
        calories: mockNutritionData.calories,
        protein: mockNutritionData.protein,
        carbs: mockNutritionData.carbs,
        fat: mockNutritionData.fat,
        fiber: mockNutritionData.fiber,
        sugar: mockNutritionData.sugar,
        sodium: mockNutritionData.sodium,
        potassium: mockNutritionData.potassium,
        calcium: mockNutritionData.calcium,
        iron: mockNutritionData.iron,
        vitamin_c: mockNutritionData.vitamin_c,
        vitamin_d: mockNutritionData.vitamin_d,
        magnesium: mockNutritionData.magnesium,
        zinc: mockNutritionData.zinc,
        omega_3: mockNutritionData.omega_3,
        source: 'ai_scan',
        meal_photo_url: publicUrl,
        date: dateString
      })
      .select()
      .single()

    if (mealError) {
      console.error('Error saving meal:', mealError)
      return new Response(
        JSON.stringify({ error: 'Failed to save meal data' }),
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
          id: mealData.id,
          meal_name: mealData.meal_name,
          nutrition: mockNutritionData,
          image_url: publicUrl,
          date: dateString,
          source: 'ai_scan'
        },
        message: 'Meal analyzed and saved successfully',
        note: 'Using mock AI analysis - implement OpenAI Vision API for production'
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
