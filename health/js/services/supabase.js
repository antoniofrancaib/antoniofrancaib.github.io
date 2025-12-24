// Supabase service for database operations

// Load today's meals from Supabase to persist across refreshes
async function loadMealsFromSupabase() {
    if (!supabaseClient) {
        return;
    }

    try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabaseClient
            .from('meal_entries')
            .select('id, meal_name, calories, protein, carbs, fat, created_at, date')
            .eq('date', today)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Failed to load meals from Supabase:', error);
            return;
        }

        if (!data || data.length === 0) {
            console.log('No meals found for today in Supabase.');
            return;
        }

        // Reset local state and UI
        mealsData = {};
        nextMealId = 1;
        currentNutrition.calories = 0;
        currentNutrition.protein = 0;
        currentNutrition.carbs = 0;
        currentNutrition.fat = 0;
        currentNutrition.fiber = 0;
        currentNutrition.sugar = 0;
        currentNutrition.alcohol = 0;
        const mealsTbody = document.getElementById('meals-tbody');
        if (mealsTbody) mealsTbody.innerHTML = '';

        data.forEach(row => {
            const meal = {
                id: row.id,
                supabaseId: row.id,
                name: row.meal_name || 'Meal',
                calories: Number(row.calories) || 0,
                protein: Number(row.protein) || 0,
                carbs: Number(row.carbs) || 0,
                fat: Number(row.fat) || 0,
                fiber: Number(row.fiber) || 0,
                sugar: Number(row.sugar) || 0,
                alcohol: Number(row.alcohol) || 0
            };

            addMealToList(meal);

            // Update totals
            currentNutrition.calories += meal.calories;
            currentNutrition.protein += meal.protein;
            currentNutrition.carbs += meal.carbs;
            currentNutrition.fat += meal.fat;
            currentNutrition.fiber += meal.fiber;
            currentNutrition.sugar += meal.sugar;
            currentNutrition.alcohol += meal.alcohol;
        });

        updateNutritionDashboard();
        console.log('Loaded meals from Supabase for today:', data.length);
    } catch (err) {
        console.error('Unexpected error loading meals from Supabase:', err);
    }
}

// Load past nutrition aggregated by date (excluding today)
let pastDaysData = {};

async function loadPastNutritionFromSupabase() {
    if (!supabaseClient) return;

    try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabaseClient
            .from('meal_entries')
            .select('id, meal_name, calories, protein, carbs, fat, date, created_at')
            .order('date', { ascending: false })
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Failed to load past nutrition from Supabase:', error);
            return;
        }

        const grouped = {};

        (data || []).forEach(row => {
            if (!row.date || row.date === today) return;
            const key = row.date;
            if (!grouped[key]) {
                grouped[key] = {
                    date: row.date,
                    totals: {
                        calories: 0, protein: 0, carbs: 0, fat: 0
                    },
                    meals: []
                };
            }

            const meal = {
                id: row.id,
                name: row.meal_name || 'Meal',
                calories: Number(row.calories) || 0,
                protein: Number(row.protein) || 0,
                carbs: Number(row.carbs) || 0,
                fat: Number(row.fat) || 0
            };

            grouped[key].meals.push(meal);
            const t = grouped[key].totals;
            t.calories += meal.calories;
            t.protein += meal.protein;
            t.carbs += meal.carbs;
            t.fat += meal.fat;
        });

        pastDaysData = grouped;
        renderPastNutritionTable();
    } catch (err) {
        console.error('Unexpected error loading past nutrition:', err);
    }
}

// Save a meal to Supabase
async function saveMealToSupabase(mealData) {
    if (!supabaseClient) return null;

    try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabaseClient
            .from('meal_entries')
            .insert([{
                meal_name: mealData.name,
                calories: mealData.calories,
                protein: mealData.protein,
                carbs: mealData.carbs,
                fat: mealData.fat,
                fiber: mealData.fiber || 0,
                sugar: mealData.sugar || 0,
                alcohol: mealData.alcohol || 0,
                date: today
            }])
            .select()
            .single();

        if (error) {
            console.error('Failed to save meal to Supabase:', error);
            return null;
        }

        console.log('Meal saved to Supabase:', data);
        return data;
    } catch (err) {
        console.error('Unexpected error saving meal to Supabase:', err);
        return null;
    }
}

// Delete a meal from Supabase
async function deleteMealFromSupabase(supabaseId) {
    if (!supabaseClient || !supabaseId) return false;

    try {
        const { error } = await supabaseClient
            .from('meal_entries')
            .delete()
            .eq('id', supabaseId);

        if (error) {
            console.error('Failed to delete meal in Supabase:', error);
            return false;
        }

        console.log('Meal deleted from Supabase:', supabaseId);
        return true;
    } catch (err) {
        console.error('Unexpected error deleting meal in Supabase:', err);
        return false;
    }
}
