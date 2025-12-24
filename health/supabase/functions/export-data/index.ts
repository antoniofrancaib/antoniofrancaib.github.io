import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExportRequest {
  startDate?: string
  endDate?: string
  dataTypes?: string[] // 'meals', 'wellness', 'activity', 'sleep', 'cognitive', 'blood'
  format?: 'json' | 'csv'
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
    const exportReq: ExportRequest = await req.json()

    const startDate = exportReq.startDate ? new Date(exportReq.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    const endDate = exportReq.endDate ? new Date(exportReq.endDate) : new Date()
    const dataTypes = exportReq.dataTypes || ['meals', 'wellness', 'activity', 'sleep', 'cognitive']
    const format = exportReq.format || 'json'

    // Build date filter
    const dateFilter = {
      gte: startDate.toISOString().split('T')[0],
      lte: endDate.toISOString().split('T')[0]
    }

    // Collect all data
    const exportData: any = {
      user_id: user.id,
      export_date: new Date().toISOString(),
      date_range: {
        start: dateFilter.gte,
        end: dateFilter.lte
      },
      data_types: dataTypes
    }

    // Fetch meals data
    if (dataTypes.includes('meals')) {
      const { data: meals } = await supabaseClient
        .from('meal_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', dateFilter.gte)
        .lte('date', dateFilter.lte)
        .order('date', { ascending: false })

      exportData.meals = meals || []
    }

    // Fetch wellness data
    if (dataTypes.includes('wellness')) {
      const { data: wellness } = await supabaseClient
        .from('wellness_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', dateFilter.gte)
        .lte('date', dateFilter.lte)
        .order('date', { ascending: false })

      exportData.wellness = wellness || []
    }

    // Fetch activity data
    if (dataTypes.includes('activity')) {
      const { data: activity } = await supabaseClient
        .from('activity_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', dateFilter.gte)
        .lte('date', dateFilter.lte)
        .order('date', { ascending: false })

      exportData.activity = activity || []
    }

    // Fetch sleep data
    if (dataTypes.includes('sleep')) {
      const { data: sleep } = await supabaseClient
        .from('sleep_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', dateFilter.gte)
        .lte('date', dateFilter.lte)
        .order('date', { ascending: false })

      exportData.sleep = sleep || []
    }

    // Fetch cognitive data
    if (dataTypes.includes('cognitive')) {
      const { data: cognitive } = await supabaseClient
        .from('cognitive_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', dateFilter.gte)
        .lte('date', dateFilter.lte)
        .order('date', { ascending: false })

      exportData.cognitive = cognitive || []
    }

    // Fetch blood test data
    if (dataTypes.includes('blood')) {
      const { data: blood } = await supabaseClient
        .from('blood_tests')
        .select('*')
        .eq('user_id', user.id)
        .gte('test_date', dateFilter.gte)
        .lte('test_date', dateFilter.lte)
        .order('test_date', { ascending: false })

      exportData.blood_tests = blood || []
    }

    // Handle different export formats
    if (format === 'csv') {
      // Convert to CSV format
      const csvContent = convertToCSV(exportData)
      const fileName = `health-data-export-${dateFilter.gte}-to-${dateFilter.lte}.csv`

      return new Response(csvContent, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${fileName}"`
        }
      })
    } else {
      // JSON format
      const jsonContent = JSON.stringify(exportData, null, 2)
      const fileName = `health-data-export-${dateFilter.gte}-to-${dateFilter.lte}.json`

      return new Response(jsonContent, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${fileName}"`
        }
      })
    }

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

// Helper function to convert data to CSV format
function convertToCSV(data: any): string {
  const csvRows: string[] = []

  // Add header
  csvRows.push('Data Type,Date,Details')

  // Add meals
  if (data.meals) {
    data.meals.forEach((meal: any) => {
      csvRows.push(`Meal,${meal.date},"${meal.meal_name}: ${meal.calories} cal, ${meal.protein}g protein, ${meal.carbs}g carbs, ${meal.fat}g fat"`)
    })
  }

  // Add wellness
  if (data.wellness) {
    data.wellness.forEach((wellness: any) => {
      csvRows.push(`Wellness,${wellness.date},"Energy: ${wellness.energy_score}, Mood: ${wellness.mood_score}, Clarity: ${wellness.clarity_score}"`)
    })
  }

  // Add activity
  if (data.activity) {
    data.activity.forEach((activity: any) => {
      csvRows.push(`Activity,${activity.date},"${activity.steps} steps, ${activity.active_calories} cal burned, ${activity.exercise_minutes} min exercise"`)
    })
  }

  // Add sleep
  if (data.sleep) {
    data.sleep.forEach((sleep: any) => {
      csvRows.push(`Sleep,${sleep.date},"${Math.round(sleep.time_asleep_minutes / 60)}h ${sleep.time_asleep_minutes % 60}m asleep, ${sleep.efficiency_percentage}% efficiency, Recovery: ${sleep.recovery_score}"`)
    })
  }

  // Add cognitive
  if (data.cognitive) {
    data.cognitive.forEach((cognitive: any) => {
      csvRows.push(`Cognitive,${cognitive.date},"${cognitive.deep_work_minutes} min deep work, ${cognitive.screen_time_minutes} min screen time, Focus ratio: ${Math.round(cognitive.focus_ratio * 100)}%"`)
    })
  }

  // Add blood tests
  if (data.blood_tests) {
    data.blood_tests.forEach((blood: any) => {
      csvRows.push(`Blood Test,${blood.test_date},"Total Cholesterol: ${blood.total_cholesterol}, HDL: ${blood.hdl_cholesterol}, LDL: ${blood.ldl_cholesterol}, Triglycerides: ${blood.triglycerides}"`)
    })
  }

  return csvRows.join('\n')
}
