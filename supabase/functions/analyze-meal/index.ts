import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get Supabase URL and anon key from environment variables
    // These are automatically provided by Supabase Edge Functions
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables')
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error: Missing Supabase credentials' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Supabase URL configured')
    console.log('Request method:', req.method)
    console.log('Request URL:', req.url)

    // Initialize Supabase client
    const supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: false
        }
      }
    )

    // Parse request body
    let requestBody
    try {
      requestBody = await req.json()
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid request body' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    let { image } = requestBody
    console.log('Received image data, length:', image?.length || 0)

    // If image is raw base64 (no data URI), wrap it so OpenAI can fetch it
    if (typeof image === 'string' && !image.startsWith('data:image/')) {
      image = `data:image/jpeg;base64,${image}`
    }

    if (!image) {
      return new Response(
        JSON.stringify({ success: false, error: 'No image provided' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate image format (should be base64)
    let imageBuffer: Uint8Array
    let mimeType: string

    try {
      // Remove data URL prefix if present
      const base64Data = image.includes(',') ? image.split(',')[1] : image
      imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))
      
      // Detect MIME type from base64 prefix or default to jpeg
      if (image.startsWith('data:image/')) {
        mimeType = image.split(';')[0].split('/')[1]
      } else {
        mimeType = 'jpeg'
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid image format' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `meal-${timestamp}.${mimeType === 'jpeg' ? 'jpg' : mimeType}`
    const filePath = `${filename}`

    // Upload image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('meal-images')
      .upload(filePath, imageBuffer, {
        contentType: `image/${mimeType}`,
        upsert: false
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to upload image: ' + uploadError.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get a public/signed URL for the uploaded image (use signed to avoid access issues)
    let imageUrl = ''
    const { data: signed } = await supabaseClient.storage
      .from('meal-images')
      .createSignedUrl(filePath, 600) // 10 minutes
    if (signed?.signedUrl) {
      imageUrl = signed.signedUrl
    } else {
      const { data: urlData } = supabaseClient.storage
        .from('meal-images')
        .getPublicUrl(filePath)
      imageUrl = urlData.publicUrl
    }
    console.log('Using image URL (truncated):', imageUrl?.slice(0, 120) || 'none')

    // Use the uploaded public URL for AI (avoid sending data URLs to OpenAI)
    const imageForAi = imageUrl

    // Call OpenAI API for food recognition
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'OpenAI API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Prepare the prompt for OpenAI
    const systemPrompt = `You are a nutrition analysis expert. Analyze food images and provide detailed nutritional information.

Your task:
1. Identify all food items visible in the image
2. Estimate portion sizes realistically
3. Calculate nutritional values based on standard food databases

Return ONLY a valid JSON object with this exact structure:
{
  "meal_name": "Descriptive name of the meal",
  "calories": number (total calories),
  "protein": number (grams),
  "carbs": number (grams),
  "fat": number (grams),
  "fiber": number (grams),
  "added_sugar": number (grams),
  "sodium": number (milligrams),
  "magnesium": number (milligrams),
  "iron": number (milligrams),
  "zinc": number (milligrams),
  "potassium": number (milligrams),
  "vitamin_b6": number (milligrams, can be decimal)
}

Be realistic and accurate. If you cannot identify certain foods, estimate conservatively. Ensure all values are non-negative numbers.`

    const userPrompt = `Analyze this food image and provide the nutritional breakdown in the exact JSON format specified.`

    // Call OpenAI GPT-4 Vision API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageForAi
                }
              }
            ]
          }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 500,
        temperature: 0.3
      })
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text()
      console.error('OpenAI API error:', errorData)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to analyze image: ' + (errorData || 'Unknown error')
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const openaiData = await openaiResponse.json()
    const aiContent = openaiData.choices?.[0]?.message?.content

    if (!aiContent) {
      return new Response(
        JSON.stringify({ success: false, error: 'No response from AI' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('OpenAI status:', openaiResponse.status)
    console.log('aiContent (truncated):', aiContent?.slice(0, 200) || 'none')

    // Parse AI response
    let nutritionData: any
    try {
      nutritionData = JSON.parse(aiContent)
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent)
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid AI response format' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Parsed meal_name:', nutritionData?.meal_name || 'none')

    // Validate and normalize nutrition data
    const mealData = {
      meal_name: nutritionData.meal_name || 'Analyzed Meal',
      calories: Math.max(0, Number(nutritionData.calories) || 0),
      protein: Math.max(0, Number(nutritionData.protein) || 0),
      carbs: Math.max(0, Number(nutritionData.carbs) || 0),
      fat: Math.max(0, Number(nutritionData.fat) || 0),
      fiber: Math.max(0, Number(nutritionData.fiber) || 0),
      added_sugar: Math.max(0, Number(nutritionData.added_sugar) || 0),
      sodium: Math.max(0, Number(nutritionData.sodium) || 0),
      magnesium: Math.max(0, Number(nutritionData.magnesium) || 0),
      iron: Math.max(0, Number(nutritionData.iron) || 0),
      zinc: Math.max(0, Number(nutritionData.zinc) || 0),
      potassium: Math.max(0, Number(nutritionData.potassium) || 0),
      vitamin_b6: Math.max(0, Number(nutritionData.vitamin_b6) || 0)
    }

    // Store in database and return the inserted row id
    const { data: insertedRows, error: dbError } = await supabaseClient
      .from('meal_entries')
      .insert({
        image_url: imageUrl,
        meal_name: mealData.meal_name,
        calories: mealData.calories,
        protein: mealData.protein,
        carbs: mealData.carbs,
        fat: mealData.fat,
        fiber: mealData.fiber,
        added_sugar: mealData.added_sugar,
        sodium: mealData.sodium,
        magnesium: mealData.magnesium,
        iron: mealData.iron,
        zinc: mealData.zinc,
        potassium: mealData.potassium,
        vitamin_b6: mealData.vitamin_b6,
        date: new Date().toISOString().split('T')[0]
      })
      .select('id')
      .maybeSingle()

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Don't fail the request if DB insert fails, still return the nutrition data
    }

    const insertedId = insertedRows?.id;

    // Return success response with nutrition data
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: insertedId,
          name: mealData.meal_name,
          calories: mealData.calories,
          protein: mealData.protein,
          carbs: mealData.carbs,
          fat: mealData.fat,
          fiber: mealData.fiber,
          addedSugar: mealData.added_sugar,
          sodium: mealData.sodium,
          magnesium: mealData.magnesium,
          iron: mealData.iron,
          zinc: mealData.zinc,
          potassium: mealData.potassium,
          vitaminB6: mealData.vitamin_b6,
          image_url: imageUrl
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

