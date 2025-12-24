// Main application initialization and core functionality

// Initialize Supabase client
const supabaseClient = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

// Global state
let currentNutrition = {
    calories: 2445,
    protein: 128,
    carbs: 285,
    fat: 88,
    fiber: 24,
    sugar: 12,
    alcohol: 0,
    caffeine: 245,
    water: 1.5
};

let mealsData = {};
let nextMealId = 6;

// Initialize the application
function initApp() {
    // Theme switching based on time
    initThemeSwitcher();

    // Initialize Lucide icons
    lucide.createIcons();

    // Load data from Supabase
    loadMealsFromSupabase();
    loadPastNutritionFromSupabase();

    // Check for pending recipe from localStorage
    checkPendingRecipe();

    // Initialize tab switching
    initTabs();

    // Initialize sync status
    initSyncStatus();

    // Set today's date
    setTodayDate();
}

// Theme switching functionality
function initThemeSwitcher() {
    function applyTheme() {
        const hour = new Date().getHours();
        const isDark = hour < CONFIG.THEME_SWITCH.darkEnd || hour >= CONFIG.THEME_SWITCH.darkStart;
        document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }

    applyTheme();
    setInterval(applyTheme, CONFIG.SYNC_INTERVALS.themeUpdate);
}

// Tab switching functionality
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(`${targetTab}-content`).classList.add('active');
        });
    });
}

// Check for pending recipe from localStorage
function checkPendingRecipe() {
    const pendingRecipe = localStorage.getItem('pendingRecipe');
    if (pendingRecipe) {
        try {
            const recipe = JSON.parse(pendingRecipe);

            // Add recipe to mealsData
            const mealId = `meal-${Date.now()}`;
            mealsData[mealId] = {
                name: recipe.name,
                protein: recipe.protein,
                carbs: recipe.carbs,
                fat: recipe.fat,
                calories: recipe.calories
            };

            // Update current nutrition totals
            currentNutrition.calories += recipe.calories;
            currentNutrition.protein += recipe.protein;
            currentNutrition.carbs += recipe.carbs;
            currentNutrition.fat += recipe.fat;

            // Add to meals list in UI
            addMealToList(
                mealId,
                recipe.name,
                recipe.protein,
                recipe.carbs,
                recipe.fat,
                recipe.calories
            );

            // Update dashboard
            updateNutritionDashboard();

            // Clear from localStorage
            localStorage.removeItem('pendingRecipe');

            // Switch to Food tab
            document.querySelector('.tab[data-tab="food"]').click();
        } catch (e) {
            console.error('Error processing pending recipe:', e);
            localStorage.removeItem('pendingRecipe');
        }
    }
}

// Set today's date in the dashboard
function setTodayDate() {
    const todayDateElement = document.getElementById('today-date');
    if (todayDateElement) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        todayDateElement.textContent = today.toLocaleDateString('en-US', options);
    }

    const overviewTodayDateElement = document.getElementById('overview-today-date');
    if (overviewTodayDateElement) {
        overviewTodayDateElement.textContent = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
}

// Sync status indicator
function initSyncStatus() {
    function updateSyncStatus() {
        const syncIndicator = document.getElementById('sync-status');
        if (syncIndicator) {
            const now = new Date();
            const lastSync = new Date(now.getTime() - 10 * 60 * 1000); // 10 minutes ago
            const timeString = lastSync.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            syncIndicator.innerHTML = `
                <div class="sync-dot"></div>
                <span>Auto-synced: ${timeString}</span>
            `;
        }
    }

    updateSyncStatus();
    setInterval(updateSyncStatus, CONFIG.SYNC_INTERVALS.syncStatusUpdate);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
