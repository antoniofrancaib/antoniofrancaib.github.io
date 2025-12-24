// Food tracking functionality

// Initialize food tab features
function initFoodFeatures() {
    // Add meal button functionality (already handled in modals.js)
    // Fasting window display
    updateFastingWindow();

    // Fiber sub-metric update
    updateFiberMetric();
}

// Update fasting window display
function updateFastingWindow() {
    // This would be updated based on actual fasting tracking
    // For now, it's static as in the original
}

// Update fiber sub-metric
function updateFiberMetric() {
    const fiberValue = currentNutrition.fiber;
    const fiberGoal = CONFIG.NUTRITION_GOALS.fiber;

    const fiberCurrentElement = document.getElementById('fiber-current');
    if (fiberCurrentElement) {
        fiberCurrentElement.textContent = `${fiberValue}g`;
    }

    const fiberIndicator = document.querySelector('.fiber-indicator');
    if (fiberIndicator) {
        if (fiberValue >= fiberGoal) {
            fiberIndicator.innerHTML = '<span class="fiber-check">✓</span>';
        } else {
            fiberIndicator.innerHTML = '';
        }
    }
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initFoodFeatures,
        updateFastingWindow,
        updateFiberMetric
    };
}
