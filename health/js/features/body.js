// Body/activity tracking functionality

// Initialize body tab features
function initBodyFeatures() {
    updateStepsMetric();
}

// Update steps metric
function updateStepsMetric() {
    const stepsCurrent = document.getElementById('steps-current');
    const stepsProgress = document.getElementById('steps-progress');
    const stepsStatus = document.getElementById('steps-status');
    const stepsIndicator = document.getElementById('steps-indicator');

    if (!stepsCurrent || !stepsProgress) return;

    const currentSteps = parseInt(stepsCurrent.textContent.replace(',', ''));
    const goalSteps = CONFIG.ACTIVITY_GOALS.steps;

    const percent = (currentSteps / goalSteps) * 100;
    stepsProgress.style.width = `${Math.min(percent, 100)}%`;

    if (currentSteps >= goalSteps) {
        stepsStatus.textContent = 'Goal exceeded!';
        if (stepsIndicator) {
            stepsIndicator.style.display = 'flex';
        }
    } else {
        stepsStatus.textContent = '';
        if (stepsIndicator) {
            stepsIndicator.style.display = 'none';
        }
    }
}

// Update exercise metrics from WHOOP/Apple Health
function updateExerciseMetrics(exerciseData) {
    // Placeholder for exercise API integration
    console.log('Exercise data update:', exerciseData);
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initBodyFeatures,
        updateStepsMetric,
        updateExerciseMetrics
    };
}
