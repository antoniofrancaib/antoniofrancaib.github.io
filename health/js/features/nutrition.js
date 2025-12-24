// Nutrition tracking and meal management functionality

// Add meal to the meals table
function addMealToList(mealData) {
    const mealId = mealData.id || `meal-${nextMealId++}`;
    const supabaseId = mealData.supabaseId || mealData.id;
    mealsData[mealId] = { ...mealData, id: mealId, supabaseId };

    const mealsTbody = document.getElementById('meals-tbody');
    const row = document.createElement('tr');
    row.className = 'meal-row';
    row.setAttribute('data-meal-id', mealId);
    row.innerHTML = `
        <td class="meal-name-cell">${mealData.name}</td>
        <td class="meal-value">${mealData.protein}g</td>
        <td class="meal-value">${mealData.carbs}g</td>
        <td class="meal-value">${mealData.fat}g</td>
        <td class="meal-value">${mealData.calories} kcal</td>
        <td class="meal-value" style="text-align: right;">
            <button class="icon-btn" data-delete-meal="${mealId}" title="Remove meal" aria-label="Remove meal" style="padding: 6px; border: 1px solid var(--border-color-medium);">
                <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
            </button>
        </td>
    `;
    mealsTbody.appendChild(row);

    // Add click handler
    row.addEventListener('click', function() {
        toggleMealDetails(this);
    });

    // Delete handler
    const deleteBtn = row.querySelector('[data-delete-meal]');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeMeal(mealId);
        });
    }
}

// Remove a meal from UI/state and Supabase if available
async function removeMeal(mealId) {
    const meal = mealsData[mealId];
    if (!meal) return;

    // Update state
    delete mealsData[mealId];

    // Adjust totals
    currentNutrition.calories -= (meal.calories || 0);
    currentNutrition.protein -= (meal.protein || 0);
    currentNutrition.carbs -= (meal.carbs || 0);
    currentNutrition.fat -= (meal.fat || 0);
    currentNutrition.fiber -= (meal.fiber || 0);
    currentNutrition.sugar -= (meal.sugar || 0);
    currentNutrition.alcohol -= (meal.alcohol || 0);

    // Update dashboard
    updateNutritionDashboard();

    // Remove table row and any expanded details
    const row = document.querySelector(`tr[data-meal-id="${mealId}"]`);
    if (row) {
        const detailsRow = row.nextElementSibling;
        if (detailsRow && detailsRow.classList.contains('expanded-row')) {
            detailsRow.remove();
        }
        row.remove();
    }

    // Delete from Supabase if we have an id
    if (meal.supabaseId && supabaseClient) {
        const success = await deleteMealFromSupabase(meal.supabaseId);
        if (!success) {
            console.error('Failed to delete meal from Supabase');
        }
    }
}

// Toggle meal details
function toggleMealDetails(row) {
    const mealId = row.getAttribute('data-meal-id');
    const existingDetailsRow = row.nextElementSibling;

    // If details are already shown, hide them
    if (existingDetailsRow && existingDetailsRow.classList.contains('expanded-row')) {
        existingDetailsRow.remove();
        return;
    }

    // Hide any other open details
    document.querySelectorAll('.expanded-row').forEach(r => r.remove());

    // Get meal data
    const meal = mealsData[mealId];
    if (!meal) return;

    // Create details row
    const detailsRow = document.createElement('tr');
    detailsRow.className = 'expanded-row';
    detailsRow.innerHTML = `
        <td colspan="5">
            <div class="meal-details">
                <div class="meal-details-header">Nutritional Details</div>
                <div class="micronutrients-grid">
                    <div class="micronutrient-item">
                        <span class="micronutrient-label">Calories</span>
                        <span class="micronutrient-value">${meal.calories}</span>
                    </div>
                    <div class="micronutrient-item">
                        <span class="micronutrient-label">Protein</span>
                        <span class="micronutrient-value">${meal.protein}g</span>
                    </div>
                    <div class="micronutrient-item">
                        <span class="micronutrient-label">Carbs</span>
                        <span class="micronutrient-value">${meal.carbs}g</span>
                    </div>
                    <div class="micronutrient-item">
                        <span class="micronutrient-label">Fat</span>
                        <span class="micronutrient-value">${meal.fat}g</span>
                    </div>
                </div>
            </div>
        </td>
    `;

    // Insert after the clicked row
    row.after(detailsRow);
}

// Update nutrition dashboard with current values
function updateNutritionDashboard() {
    // Helper function to update a metric
    function updateMetric(nutrient, unit = 'g') {
        const percent = (currentNutrition[nutrient] / CONFIG.NUTRITION_GOALS[nutrient]) * 100;
        const value = Math.round(currentNutrition[nutrient]);
        document.getElementById(`${nutrient}-current`).textContent = `${value}${unit}`;
        const progress = document.getElementById(`${nutrient}-progress`);
        progress.style.width = `${Math.min(percent, 100)}%`;
        progress.className = 'progress-fill';
        if (percent > 100) progress.classList.add('over');
        else if (percent > 95) progress.classList.add('warning');
    }

    // Update calories (no rounding)
    const caloriesPercent = (currentNutrition.calories / CONFIG.NUTRITION_GOALS.calories) * 100;
    document.getElementById('calories-current').textContent = currentNutrition.calories;
    const caloriesProgress = document.getElementById('calories-progress');
    caloriesProgress.style.width = `${Math.min(caloriesPercent, 100)}%`;
    caloriesProgress.className = 'progress-fill';
    if (caloriesPercent > 100) caloriesProgress.classList.add('over');
    else if (caloriesPercent > 95) caloriesProgress.classList.add('warning');

    // Update macros
    updateMetric('protein', 'g');
    updateMetric('carbs', 'g');
    updateMetric('fat', 'g');

    // Update modulators
    updateSugarMetric();
    updateAlcoholMetric();
    updateCaffeineMetric();
    updateWaterMetric();
}

// Update sugar limit bar (inverse progress)
function updateSugarMetric() {
    const sugarValue = currentNutrition.sugar;
    const sugarLimit = CONFIG.NUTRITION_GOALS.sugar;
    const percent = Math.min((sugarValue / sugarLimit) * 100, 100);

    document.getElementById('sugar-current').textContent = `${sugarValue}g`;
    const sugarProgress = document.getElementById('sugar-limit-progress');
    sugarProgress.style.width = `${percent}%`;
}

// Update alcohol counter and warning
function updateAlcoholMetric() {
    const alcoholValue = currentNutrition.alcohol;
    document.getElementById('alcohol-current').textContent = alcoholValue;

    const warningElement = document.getElementById('alcohol-warning');
    if (alcoholValue > 0) {
        warningElement.style.display = 'flex';
    } else {
        warningElement.style.display = 'none';
    }
}

// Update caffeine in hydration section
function updateCaffeineMetric() {
    const caffeineValue = currentNutrition.caffeine;
    const caffeineLimit = CONFIG.NUTRITION_GOALS.caffeine;
    const percent = Math.min((caffeineValue / caffeineLimit) * 100, 100);

    document.getElementById('caffeine-current').textContent = `${caffeineValue}mg`;
    const caffeineProgress = document.getElementById('caffeine-hydration-progress');
    caffeineProgress.style.width = `${percent}%`;
}

// Update water metric
function updateWaterMetric() {
    const waterValue = currentNutrition.water;
    const waterGoal = CONFIG.NUTRITION_GOALS.water;
    const percent = Math.min((waterValue / waterGoal) * 100, 100);

    document.getElementById('water-progress').style.width = `${percent}%`;
    // You might want to update a display value here if added
}
