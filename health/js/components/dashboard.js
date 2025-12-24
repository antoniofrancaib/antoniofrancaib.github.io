// Dashboard rendering and visualization functionality

// Create nutrition dashboard HTML (reusable component)
function createNutritionDashboard(data, isModal = false) {
    const dashboardId = isModal ? 'modal' : 'today';
    const mealsTableId = isModal ? 'modal-meals-tbody' : 'meals-tbody';

    return `
        <div class="nutrition-dashboard">
            ${!isModal ? `
            <div class="dashboard-header">
                <div>
                    <h3 class="dashboard-title">${data.title}</h3>
                    ${data.title !== data.date ? `<p class="dashboard-date">${data.date}</p>` : ''}
                </div>
                <div class="dashboard-buttons">
                    <a href="recipes.html" class="icon-btn" title="Add Preset Meal">
                        <i data-lucide="book-marked" style="width: 20px; height: 20px;"></i>
                    </a>
                </div>
            </div>
            ` : ''}

            <!-- Macros Grid -->
            <div class="nutrition-grid">
                <div class="nutrition-metric">
                    <div class="metric-header">
                        <span class="metric-label">CALORIES</span>
                    </div>
                    <div class="metric-value" id="calories-current-${dashboardId}">${data.nutrition.calories} kcal</div>
                    <div class="metric-goal">Goal: ${data.goals.calories} kcal</div>
                    <div class="progress-bar">
                        <div class="progress-fill ${data.nutrition.calories > data.goals.calories ? 'over' : (data.nutrition.calories / data.goals.calories > 0.95 ? 'warning' : '')}"
                             id="calories-progress-${dashboardId}"
                             style="width: ${Math.min((data.nutrition.calories / data.goals.calories) * 100, 100)}%"></div>
                    </div>
                </div>

                <div class="nutrition-metric">
                    <div class="metric-header">
                        <span class="metric-label">PROTEIN</span>
                    </div>
                    <div class="metric-value" id="protein-current-${dashboardId}">${data.nutrition.protein}g</div>
                    <div class="metric-goal">Goal: ${data.goals.protein}g</div>
                    <div class="progress-bar">
                        <div class="progress-fill ${data.nutrition.protein > data.goals.protein ? 'over' : (data.nutrition.protein / data.goals.protein > 0.95 ? 'warning' : '')}"
                             id="protein-progress-${dashboardId}"
                             style="width: ${Math.min((data.nutrition.protein / data.goals.protein) * 100, 100)}%"></div>
                    </div>
                </div>

                <div class="nutrition-metric">
                    <div class="metric-header">
                        <span class="metric-label">CARBS</span>
                    </div>
                    <div class="metric-value" id="carbs-current-${dashboardId}">${data.nutrition.carbs}g</div>
                    <div class="metric-goal">Goal: ${data.goals.carbs}g</div>
                    <div class="progress-bar">
                        <div class="progress-fill ${data.nutrition.carbs > data.goals.carbs ? 'over' : (data.nutrition.carbs / data.goals.carbs > 0.95 ? 'warning' : '')}"
                             id="carbs-progress-${dashboardId}"
                             style="width: ${Math.min((data.nutrition.carbs / data.goals.carbs) * 100, 100)}%"></div>
                    </div>
                </div>

                <div class="nutrition-metric">
                    <div class="metric-header">
                        <span class="metric-label">FAT</span>
                    </div>
                    <div class="metric-value" id="fat-current-${dashboardId}">${data.nutrition.fat}g</div>
                    <div class="metric-goal">Goal: ${data.goals.fat}g</div>
                    <div class="progress-bar">
                        <div class="progress-fill ${data.nutrition.fat > data.goals.fat ? 'over' : (data.nutrition.fat / data.goals.fat > 0.95 ? 'warning' : '')}"
                             id="fat-progress-${dashboardId}"
                             style="width: ${Math.min((data.nutrition.fat / data.goals.fat) * 100, 100)}%"></div>
                    </div>
                </div>
            </div>

            <!-- Meals List -->
            ${!isModal ? `<div class="meals-header">Today's Meals</div>` : ''}
            <table class="meals-table">
                <thead>
                    <tr>
                        <th>MEAL</th>
                        <th>PROTEIN</th>
                        <th>CARBS</th>
                        <th>FAT</th>
                        <th>CALORIES</th>
                    <th style="width: 60px; text-align: right;"> </th>
                    </tr>
                </thead>
                <tbody id="${mealsTableId}">
                    ${data.meals.map(meal => `
                        <tr class="meal-row" data-meal-id="${meal.id}">
                            <td class="meal-name-cell">${meal.name}</td>
                            <td><span class="meal-value">${meal.protein}g</span></td>
                            <td><span class="meal-value">${meal.carbs}g</span></td>
                            <td><span class="meal-value">${meal.fat}g</span></td>
                            <td><span class="meal-value">${meal.calories} kcal</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Toggle past day inline expansion
function togglePastDayExpansion(dayId, row) {
    const tbody = document.getElementById('past-nutrition-tbody');

    // Check if this row is already expanded
    const existingExpandedRow = row.nextElementSibling;
    if (existingExpandedRow && existingExpandedRow.classList.contains('past-day-expanded')) {
        existingExpandedRow.remove();
        row.classList.remove('active');
        return;
    }

    // Remove any other expanded rows
    tbody.querySelectorAll('.past-day-expanded').forEach(er => er.remove());
    tbody.querySelectorAll('.past-day-row').forEach(r => r.classList.remove('active'));

    // Mark this row as active
    row.classList.add('active');

    // Get day data
    const dayData = pastDaysData[dayId];
    if (!dayData) return;

    // Create dashboard data
    const dashboardData = {
        title: dayData.date,
        date: dayData.date,
        nutrition: dayData.totals,
        goals: CONFIG.NUTRITION_GOALS,
        meals: dayData.meals
    };

    // Create expanded row
    const expandedRow = document.createElement('tr');
    expandedRow.className = 'past-day-expanded';
    expandedRow.innerHTML = `
        <td colspan="5">
            <div class="past-day-expanded-content">
                ${createNutritionDashboard(dashboardData, true)}
            </div>
        </td>
    `;

    // Insert after clicked row
    row.after(expandedRow);

    // Reinitialize icons
    lucide.createIcons();
}

// Render past nutrition table
function renderPastNutritionTable() {
    const tbody = document.getElementById('past-nutrition-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const dayKeys = Object.keys(pastDaysData).sort((a, b) => new Date(b) - new Date(a));
    if (dayKeys.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5" style="text-align:center; color: var(--text-muted); padding: 12px;">No past nutrition data yet.</td>`;
        tbody.appendChild(row);
        return;
    }

    dayKeys.forEach(dayId => {
        const dayData = pastDaysData[dayId];
        const dateLabel = new Date(`${dayId}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const row = document.createElement('tr');
        row.className = 'past-day-row';
        row.setAttribute('data-day-id', dayId);
        row.style.cursor = 'pointer';
        row.innerHTML = `
            <td>${dateLabel}</td>
            <td>${Math.round(dayData.totals.calories)} / ${CONFIG.NUTRITION_GOALS.calories} kcal</td>
            <td>${Math.round(dayData.totals.protein)} / ${CONFIG.NUTRITION_GOALS.protein} g</td>
            <td>${Math.round(dayData.totals.carbs)} / ${CONFIG.NUTRITION_GOALS.carbs} g</td>
            <td>${Math.round(dayData.totals.fat)} / ${CONFIG.NUTRITION_GOALS.fat} g</td>
        `;
        row.addEventListener('click', () => togglePastDayExpansion(dayId, row));
        tbody.appendChild(row);
    });
}

// Initialize past day click handlers
function initPastDayHandlers() {
    document.querySelectorAll('.past-day-row').forEach(row => {
        row.addEventListener('click', function() {
            const dayId = this.getAttribute('data-day-id');
            togglePastDayExpansion(dayId, this);
        });
    });
}

// Heatmap day click functionality
function initHeatmapHandlers() {
    document.addEventListener('DOMContentLoaded', function() {
        const heatmapDays = document.querySelectorAll('.heatmap-day');
        heatmapDays.forEach(day => {
            day.addEventListener('click', function() {
                const dayNumber = this.getAttribute('data-day');
                const title = this.getAttribute('title');

                // Simple alert for now - can be enhanced to show modal with details
                alert(`Day ${dayNumber} Details:\n${title}`);

                // TODO: Implement modal with full day details
            });
        });
    });
}

// Initialize dashboard components
document.addEventListener('DOMContentLoaded', function() {
    initPastDayHandlers();
    initHeatmapHandlers();
});
