// Configuration constants for the Health Dashboard

const CONFIG = {
    // Supabase configuration
    SUPABASE_URL: 'https://smuiaaeluqklideovsqn.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtdWlhYWVsdXFrbGlkZW92c3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMDk0OTcsImV4cCI6MjA4MDg4NTQ5N30.SsAOS0HieZgNe5408udl8mjVT-4UqzfOIPy8k2O7aok',

    // Nutrition goals
    NUTRITION_GOALS: {
        calories: 3000,
        protein: 150,
        carbs: 330,
        fat: 110,
        fiber: 30,
        sugar: 40,
        caffeine: 400,
        water: 2.5
    },

    // Wellness ranges
    WELLNESS_RANGES: {
        energy: { min: 1, max: 10 },
        mood: { min: 1, max: 10 },
        clarity: { min: 1, max: 10 }
    },

    // Activity goals
    ACTIVITY_GOALS: {
        steps: 10000,
        deepWorkHours: 5,
        screenTimeLimit: 4,
        focusRatioTarget: 0.7
    },

    // Theme switching timing
    THEME_SWITCH: {
        darkStart: 18, // 6 PM
        darkEnd: 6     // 6 AM
    },

    // Sync intervals
    SYNC_INTERVALS: {
        themeUpdate: 60000,      // 1 minute
        syncStatusUpdate: 60000   // 1 minute
    }
};

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
